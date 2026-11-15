# C++ 中的可变延迟
### Jianghao Li

## 固定延迟

最近在制作 ***Dreamcatchers*** 时，我实现了一个带固定延迟的“传声筒”。玩家的实时语音数据进入缓冲区后，会先等待 `X` 时间，再从输出端播放。

实现这个效果通常有两种方法。最直接的做法是设置一个计时器，等计时结束后再开始向输出缓冲区写入音频。这个办法虽然简单，却很依赖游戏主线程的计时。一旦主线程因为繁重的渲染任务等原因降低了更新频率，计时就可能出现偏差。这与 Unity 中的情况类似：如果需要采样级精确的时序，就不应该在 `Update()` 中计时。另一种方法就是使用环形缓冲区。

对于熟悉音频编程的人来说，环形缓冲区几乎是处理这类问题的标准方案。我们先创建一个容量等于最大延迟的数组，并维护延迟采样数 `X`、读指针和写指针。每次处理时，读指针先取出数组中的历史采样，写指针再用新数据覆盖同一位置。只要让读指针始终落后写指针 `X` 个采样，就能得到 `X` 个采样的延迟。

下面是一个 C++ 示例实现：

```c++
class FixedDelay
{
public:
    FixedDelay(...) // You want to pass in all the parameters to initialize the private members
    {
        // You do need to dynamically allocate the array and set all element to 0.f
        // We're using a simple C-styled array here
        ...

        m_readPtr = 0;

        // Notice m_readPtr essentially equals to m_writePtr - m_delaySamples
        // I did this only because we used std::size_t which cannot go below 0
        m_readPtr = m_maxDelaySamples - m_delaySamples;
    }

    // Destructors, others...
    //
    // Explicitly delete copy and move constructors so we don't need to deal
    // with deep and shallow copy issues

    bool process(float* buffer, std::size_t size)
    {
        // Here you want some guard clauses just so you don't get UB

        for (std::size_t i = 0; i < size; ++i)
        {
            const float historySample = m_history[m_readPtr];
            m_history[m_writePtr] = buffer[i];
            buffer[i] = historySample;

            // Wraps the pointer so it stays in the array's range
            m_writePtr = (m_writePtr + 1) % m_maxDelaySamples;
            m_readPtr = (m_readPtr + 1) % m_maxDelaySamples;
        }

        return true
    }

private:
    float* m_history; // This is the history sample array

    std::size_t m_maxDelaySamples = 0;
    std::size_t m_delaySamples = 0;

    std::size_t m_readPtr = 0;
    std::size_t m_writePtr = 0;
};
```

这样就得到了一条采样精确、稳定工作的固定延迟线。它运行在音频回调线程上，不依赖游戏线程；只要音频线程没有被阻塞，就能可靠地工作。这套思路也很容易迁移到其他语言，而且语法往往更简单。例如在 Unity/C# 中，`process` 回调可以直接写成：

```csharp
bool process(float[] buffer);
```

C# 会自行管理数组长度，不过其他状态仍然需要手动维护。

## 可变延迟

固定延迟有很多用途，其中之一就是模拟声音的传播时间。声音在任何介质中都有一定的传播速度；在空气中，声速约为 `343m/s`。如果想让游戏中的声学体验更真实，加入声音传播延迟是一种简单而有效的做法。在 `Battlefield`、`Squad` 这类大地图游戏中，远处的声音不会在事件发生的瞬间响起。比如爆炸声，需要经过 `距离 / 声速` 的时间才会传到玩家耳中。

固定延迟可以模拟这种效果，但适用范围有限。如果声源和听者的位置都不变，传播时间也是固定的，一条固定延迟线就足够了。可一旦两者开始移动，声音传到听者位置所需的时间也会随距离不断变化。这时，固定延迟就不够用了，我们需要可变延迟。

顾名思义，可变延迟就是可以在运行时调整延迟时间。实现思路并不复杂。前面提到的 `m_readPtr = m_writePtr - m_delaySamples` 正是关键：让读指针始终落后写指针 `X` 个采样。不过，要让它真正工作，还需要额外处理几个问题。

### 糟了！非整数采样？

假设一次爆炸发生在离你 `400m` 远的地方，理想情况下，爆炸声需要 `1.166 秒` 才能传到你这里。由于延迟线使用的是`采样`数，而不是`秒`数，我们首先要把时间换算成采样。

| 采样率 | 每个采样的毫秒数 |
|:------:|:---------------:|
| 44100 | 0.0226 |
| 48000 | 0.0208 |

从表中可以看出，在 `48000` 的采样率下，每个采样约为 `0.0208ms`。回到刚才的例子，`1.166 秒` 对应 `55976.68 个采样`——这显然***不是***整数。数组当然不能使用 `m_history[55976.68]` 这样的分数索引。好在我们可以对采样进行***插值***。由于相邻采样之间的时间间隔极短，可以把它们之间的变化近似看作线性，再通过线性插值得到中间位置的近似值。

$$
y[n] = x[n_{floor}]\times(n_{ceil} - n) + x[n_{ceil}]\times(n-n_{floor})
$$

稍微调整一下代码，就会得到类似下面的实现：

```c++
bool process(float* buffer, int size)
{
    // Other guard clauses and manipulations
    ...
    for (int i = 0; i < size; ++i)
    {
        const unsigned nFloor = static_cast<unsigned> (std::floor(m_readPtrInFloat));
        const unsigned nCeil = static_cast<unsigned> (std::ceil(m_readPtrInFloat)) % m_maxDelaySamples;

        const float fraction = m_readPositionInFloat - std::floor(m_readPtrInFloat);
        const float historyA = m_delayHistory[indexA];
        const float historyB = m_delayHistory[indexB];

        const float history = historyA * (1.f - fraction) + historyB * fraction; 

        // Other behaviors
        ...
    }
}
```

以采样位置 `55976.68` 为例，我们读取第 50657 和第 56058 个采样，再根据小数部分在两者之间插值。假设 `history[55976] = -0.3f`、`history[55977] = 0.4f`，那么 `history[55976.68] = 0.183f`。严格来说，这已经属于***重采样***，不过那是另一个话题了。

### 平滑延迟变化

继续用爆炸的例子。爆炸发生在 `400m` 外，声音需要 `1.166s` 才能传到你这里——前提是你站着不动。如果你正朝爆炸位置移动，声源与你之间的距离会不断缩短，声音传播所需的时间也会随之减少。换句话说，延迟时间，也就是延迟采样数，正在逐渐减小。

我们可以直接算出新的延迟采样数，并立即把 `m_readPtr` 跳到对应位置，但更稳妥的做法是对变化进行平滑。音频波形中的任何突变都会造成不连续，进而产生咔嗒声，因此通常需要让当前值平滑地过渡到目标值。这里的做法很简单：每处理一个数据块，先算出目标延迟采样数，再计算当前延迟在块内每个采样上应该增加或减少多少。

代码如下：

```c++
bool process(float* buffer, int size)
{
    // Other guard clauses and manipulations
    
    m_delaySamplesInFloat = getDelayInSamples();
    const float deltaDelay = (m_delaySamplesInFloat - m_currentDelayInFloat) / static_cast<float>(size);

    for (int i = 0; i < size; ++i)
    {
        // Our fractional sample implementation
        ...

        m_writeIndex = (m_writeIndex + 1) % m_maxDelaySamples;
        m_readPositionInFloat = static_cast<float>(m_writeIndex) - m_currentDelayInFloat;
        if (m_readPositionInFloat < 0) m_readPositionInFloat += static_cast<float>(m_maxDelaySamples);

        // Increase delay per sample
        m_currentDelayInFloat += deltaDelay; 
    }
}
```

`getDelayInSamples()` 的实现如下：

```c++
float getDelayInSamples() const
{
    const auto delayInSeconds = m_delayInSeconds.load(); // m_delayInSeconds is atomic<float> for thread safety
    return delayInSeconds * static_cast<float>(m_sampleRate);
}
```

这样，一条变化平滑、不会产生咔嗒声的可变延迟线就完成了。

这套实现还有一个很有意思的结果：它会自动产生***多普勒效应***。当物体朝你移动时，延迟时间会不断减小，读指针相对于写指针移动得更快。也就是说，单位时间内读取的采样更多，因此音高会上升。反过来，当物体远离你时，读指针会移动得更慢，音高也会随之下降。

我还制作了一个 JUCE 独立演示程序，可以直接听到多普勒效应如何作用于声音。源代码在这里：[VariableDelay](https://github.com/JianghaoL/VariableDelay)
