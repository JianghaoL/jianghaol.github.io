/** Browser counterpart of ShepardTone.hpp; all DSP runs sample by sample. */
export class ShepardTone {
  constructor(sampleRate) {
    if (!Number.isFinite(sampleRate) || sampleRate < 8000) {
      throw new RangeError('Invalid audio sample rate');
    }
    this.m_sampleRate = sampleRate;
    this.m_numOscillators = 8;
    // Keep even the top oscillator below Nyquist at low device sample rates.
    this.m_fMin = Math.min(30, sampleRate * 0.45 / 2 ** this.m_numOscillators);
    this.m_centerOctave = this.m_numOscillators / 2;
    this.m_sigma = 1.6;
    this.m_maxRiseRate = 0.5;
    this.m_maxGain = 0.2;
    this.m_alpha = Math.exp(-1 / (0.05 * sampleRate));
    this.m_intensity = 0;
    this.m_smoothedIntensity = 0;
    this.m_oscillators = Array.from({ length: this.m_numOscillators }, (_, octave) => ({ octave, phase: 0 }));
  }

  setIntensity(value) {
    this.m_intensity = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  }

  calculateWeight(x_n) {
    const hannWeight = 0.5 * (1 - Math.cos(2 * Math.PI * x_n / this.m_numOscillators));
    const z = (x_n - this.m_centerOctave) / this.m_sigma;
    const gaussianWeight = Math.exp(-0.5 * z * z);
    return hannWeight * gaussianWeight;
  }

  updateSmoothedIntensity(I) {
    return this.m_alpha * this.m_smoothedIntensity + (1 - this.m_alpha) * I;
  }

  processSample() {
    this.m_smoothedIntensity = this.updateSmoothedIntensity(this.m_intensity);
    const riseRate = this.m_maxRiseRate * this.m_smoothedIntensity;
    const gain = this.m_maxGain * this.m_smoothedIntensity;
    let output = 0;
    let weightSquaredSum = 0;

    for (const osc of this.m_oscillators) {
      const x_n = osc.octave;
      const freq = this.m_fMin * 2 ** x_n;
      const weight = this.calculateWeight(x_n);
      const sample = Math.sin(2 * Math.PI * osc.phase);
      output += weight * sample;
      weightSquaredSum += weight * weight;
      osc.phase += freq / this.m_sampleRate;
      osc.phase -= Math.floor(osc.phase);
      osc.octave += riseRate / this.m_sampleRate;
      if (osc.octave >= this.m_numOscillators) osc.octave -= this.m_numOscillators;
    }
    output /= Math.sqrt(weightSquaredSum) + 1e-6;
    return gain * output;
  }
}
