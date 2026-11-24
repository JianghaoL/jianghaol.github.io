import { ShepardTone } from './shepard-tone-engine.js';

class ShepardToneProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'intensity', defaultValue: 0.5, minValue: 0, maxValue: 1, automationRate: 'k-rate' }];
  }

  constructor() {
    super();
    this.tone = new ShepardTone(sampleRate);
  }

  process(_inputs, outputs, parameters) {
    const channels = outputs[0];
    if (!channels.length) return true;
    this.tone.setIntensity(parameters.intensity[0]);
    for (let i = 0; i < channels[0].length; ++i) {
      const sample = this.tone.processSample();
      for (let channel = 0; channel < channels.length; ++channel) channels[channel][i] = sample;
    }
    return true;
  }
}
registerProcessor('shepard-tone', ShepardToneProcessor);
