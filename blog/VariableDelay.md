# Variable Delay in C++
### Jianghao Li

## Fixed Delay
Recently I was working on ***Dreamcatchers*** where I implemented a "string telephone" that had a fixed length delay. When real-time players' voice data gets fed into the buffer, it delays the output for `X` amount of time before it 
plays.

Naturally, there are two ways to make this happen. The very first approach would simply be adding a timer, and only starts feeding audio data into the output buffer when the timer stops. This is an easy method, but it depends heavily on game's main thread timing, meaning if, for some reason (such as handling heavy rendering tasks) the main thread tick rate drops, the timer might give the wrong timing (this is the identical to Unity situation where, if you want a sample-accurate timing, you don't want to use Update() to count time). Then there comes the second way, that is to use a ring buffer.

Now, if you're familiar with audio programming, this is almost the default way to do it. The idea is simple: keep an array that has the size of max delay you want, maintain a delay sample count `X`, a read pointer, and a write pointer. The read pointer will always read the history sample in the array first, then the write pointer overwrites that slot with newer data. How would you get the delay? Well, always make sure the read is `X` samples behind the write buffer, and you'll get an `X` sample delay.

Here's a sample implementation in C++:
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
    // Explicitly delete copy and move constructors so we dont need to deal
    // with deep and shallow copy issues

    bool process(float* buffer, std::size_t size)
    {
        // Here you want some guard clauses just so you dont get UB

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

This then gives a beautifully working fixed-delay effect that is sample-accurate. It does not depend on the game thread but the audio callback thread. So long as the audio thread is not blocked, this gets the job done decently. The idea transfers to other languages easily, with potentially easier syntax. For example, in Unity/C#, your `process` callback might simply be
```csharp
bool process(float[] buffer);
```
because C# manages arrays' sizes internally. Although, you do need to maintain other states manually.

## Variable Delay

Fixed delay could be useful in many ways, one of which could be to emulate the propagation of sound. Not surprisingly, sound waves in any medium have their own speed of propagation. In regular air, the speed of sound is approximately `343m/s`. In games, if you want a more realistic acoustic experience, emulating sound travel duration is a simple but great thing to do. Notice in many larger world games such as `Battlefield` or `Squad`, sounds do not get played instantly as an event triggers (such as an explosion), they take `distance / speed of sound` amount of time for you to hear.

A fixed delay can help you achieve this - in limited scenerios. If the incident sound source and the listener's position is fixed, then the amount of time a sound takes to travel is fixed, and a fixed delay will do it. But, what if they are moving? In this case, a sound could take a changing amount of time to propagate to the listener's position. That's when a fixed delay breaks, and variable delay comes into play.

It's pretty self explanatory what a variable delay does: it has a changeable delay time that can be adjusted at runtime. The implementation idea is not complicated either. Remember what we've discussed above, that `m_readPtr = m_writePtr - m_delaySamples`? That shows the very core concept. Essentially, we're just making the read pointer `X` samples behind the write pointer. To make it work, however, there are some extra things to do.

### Oh no! Non-integer samples?

Imagine there is an explosion, and let's say orginally it's `400m` from you. Ideally, the sound results from it will take `1.166 second` to travel to your position. How are we going to calculate the delay? Remember our delay works with `samples` but not `seconds`? We'll need to compute them into samples.

| Sample Rate | ms per Sample |
|:------:|:------:|
|44100|0.0226|
|48000|0.0208|

Looking at the commonly used sample rate chart here, with a sample rate of `48000`, every sample will take `0.0208ms`. Back to our example, `1.166 second` therefore will translate into `56057.69 samples`. And there we have a sample count that is ***not*** in integer! Sadly enough, there is no built-in function, for now, (or more likely ever) for fractional indexing in an array, for our current purpose `m_history[56057.69]`. Thankfully, mathematically, we can ***interpolate*** samples! Because every sample takes so little time, we can see the change between each as linear, and thus we can linearly interpolate between two samples to get an approximate number.
$$
y[n] = x[n_{floor}]\times(n_{ceil} - n) + x[n_{ceil}]\times(n-n_{floor})
$$
With a little code manipulation, we end up with something like this:
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

So, for our `56057.69`th sample, we take sample number 50657 and number 56058, and interpolate between them using the decimal part. Let's say `history[56057] = -0.3f` and `history[56058] = 0.4f`, we get `history[56057.69] = 0.183f`. This, in fact, is ***resampling***, but that's another whole different topic.

### Smoothing Delay Changes

Still the explosion example. We've said that it happens `400m` away from you and it'll take `1.166s` to get to you. This is when you're standing still. What if you're actively moving towards the explosion? Well, since the distance between you and the incident sound is decreasing, the time it takes for you to hear it is decreasing as well! Qualitatively, we're decrementing the delay time, or in this case, number of delay samples.

While we could simply compute how many samples it should delay and just set our `m_readPtr` to that number, it's better to add a smoothing process. In audio programming, any abrupt changes will lead to dicountinuity in it's waveform, and that causes clicking noise. We almost always want to smoothly lerp to our target change. Here, the process is simple: for every block of data we process, find out how many samples of delay we need and then find out how much our current delay should increment or decrement per sample.

Here's the code that demonstrate this:
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
        m_readPositionInFloat = static_cast<flaot>(m_writeIndex) - m_currentDelayInFloat;
        if (m_readPositionInFloat < 0) m_readPositionInFloat += static_cast<float>(m_maxDelaySamples);

        // Increase delay per sample
        m_currentDelayInFloat += deltaDelay; 
    }
}
```

where `getDelayInSamples()` is:
```c++
float getDelayInSamples() const
{
    const auto delayInSeconds = m_delayInSeconds.load(); // m_delayInSeconds is atomic<float> for thread safety
    return delayInSeconds * static_cast<float>(m_sampleRate);
}
```

This then gives us a non-clicking smoothed changeable delay.

What's particularly good about this implementation is that it automatically adds ***Doppler Effect*** to your sound! Notice when an object is heading towards you, the delay time keeps decreasing. Qualitatively, that means the read pointer is moving faster than the write pointer is. Essentially, the pitch will rise because you're reading more samples than you normally would. On the other hand, if such an object is moving away from you, the delay time will decrease, resulting in a slower moving read pointer, and eventually a dropping pitch. 

I've made a JUCE standalone demo so you can hear how doppler effect is applied to the sound. You can find source code here: [VariableDelay](https://github.com/JianghaoL/VariableDelay)