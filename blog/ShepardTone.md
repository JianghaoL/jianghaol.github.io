# Endless Tension: Shepard Tones and Adaptive Music in Games
### Jianghao Li

## Tension Building Without a Known Ending

Imagine a large-scale multiplayer shooting game. The two teams are having an extended standoff. Neither sides are able to advance their progress. The combat might end in just a few seconds, or it could last a couple of minutes.

This brings an interesting challenge for the sound designers to consider: how do you design sounds to express the growing tension without knowing exactly after how long the game is going to end?

It's easy in a predetermined structure. In film productions, for example, the sound designers and composers are given very specific and defined clips to work with, and they know clearly that at the moment of `01:23:34:533`, there will be an end to the scene. That is to say, traditional sound build-ups follow a given structure, and volume increases, rhythm accelerations, or pitch rises could be applied until the music reaches a climax.

In our interactive example, however, the progression of the game depends heavily on the players. It's highly possible that the music will reach climax before the game resolves, vice versa.

Luckily, there is a psychoacoustic approach to this problem: the use of **Shepard-Risset glissando**. It creates the illusion of endlessly continuously rising pitch, allowed to be controlled via game parameters.

Before we dive into more geeky technical stuff, let's discuss why rising pitches bring tension to the audience.

## The Pyschoacoustics of Rising Sound

### Acoustic Motion and Perceived Urgency

How sounds evolve provides information of the surrounding.

Neuhoff (1998) discovered that listeners tended to *overestimate* increases in sound levels compared with equivalent decreases. This helps to explain why in sound design, people tend to **increase loudness, rise pitch, and change spectral brightness**, in order to **reinforce the impressions of escalation**.

### Pitch, Arousal, and Musical Expression

Pitch plays an important role in communicating emotions along with tempo, volume, and timbre.

In game music, upward pitch evolvement tend to be used to build up emotional escalation. Some examples include: a rising synthesizer creating an impression of accumulating energy (laser guns); ascending string textures establishing unstable and tense atmospheres; rising pitch combined with accelerating tempo preparing for an resolving event.

Overall, a growing pitch appears to be developing into something significant.

### Expectation and Music Climax

Again, rising pitch comes with a sense of expectation. Continuous risers traditionally are used followed by significant events, such as an explosion, a musical drop, or some sort of resolution. 

In our multiplayer shooting game example, the final resolution of the standoff is the end of the game (or taking down a site). The riser played contributes to create a sense of expectation, but the game may or may not end at the moment when the riser reaches its climax. This is where we need to maintain this developing tension, while making sure it's responsive to an unpredictable series of events.

### Auditory Adaptation

A sustained sound can lead to auditory adaptation, which is a reduction in sensitivity to a constant stimulus. Even when such stimuli are "moving", if the rate of change or the overall tonal characteristics are almost constant, people get used to it, and those sounds will be perceptionally faded.

This is an important note for sound designers, that the behavior of a tension-building sound should respond to the evolving gameplay context.

This article will show how Shepard tones can be adapted to address this.

> References: Neuhoff (1998); Juslin & Laukka (2003); Huron (2006).

## The Shepard-Risset Illusion

### Why is Conventional Pitch Rising Not Enough?

A typical rising pitch can be described as

$f(t) = f_0 \cdot 2^{rt}$

where $f_0$ is the initial frequency, $r$ is the rate of octave increase, and $t$ is time. This is a simple exponential function that describes a pitch that rises continuously over time. As long as $r$ is positive, the pitch rises **exponentially**. 

However, per the **Nyquist-Shannon Sampling Theorem**, the highest frequency that can be represented in a digital audio system is half of the sampling rate.

$f_{max} = \frac{f_s}{2}$

This simple pitch rise will eventually reach the Nyquist frequency and become aliased. 

More practically speaking, the usable frequency range is typically limited by the desired timbre, overall mix, and hearing comfort.

Once the pitch reaches the upper bound, sound designers will have to stop it, hold it, or reset it, all of which break the perceived continuity.

An undetermined game length will thus benefit from a special sound structure that can maintain upward movement without reaching its audible limit.

### Shepard Tones and Circularly Structured Pitch

In 1964, Roger Shepard introduced a special type of sound that creates the illusion of endlessly rising pitch. The Shepard tone is constructed by layering several sine waves separated by octaves, and applying a specific amplitude envelope to each layer.

This arrangement creates ambiguity in absolute pitch height while preserving the perception of relative pitch movement.

When the same principle is extended to continuous pitch motion, it turns into a **Shepard–Risset glissando**.

### Endless Ascent

In a Shepard-Risset glissando, multiple oscillators play in parallel, each moving up in pitch at the same rate. Their amplitudes are controlled by an **envelope**, which fades the ocsillators out as they approaches the upper frequency boundary, and fades them back in at the lower one.

Because there are several oscillators playing simultaneously, the listener perceives a continuous rise in pitch, even though the actual frequencies are cycling back to lower octaves, without noticing a clear start or end point.

// PLACE HOLDER - CONVENTIONAL PITCH RISE VS SHEPARD TONE

## Rendering Shepard Tones Sample by Sample

The reason we want to use a Shepard tone is that it can be generated in real-time, and its parameters can be adjusted dynamically based on the game state. Here we will discuss how to render it in a digital audio system.

### Multiple Oscillators

To begin with, we define a set of `N` sine wave oscillators, each separated by an octave. 

For a given oscillator `k`, its instaneuos frequency at any sample is given by:

