import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { ShepardTone } from '../src/site/blog/shepard-tone-engine.js';

function render(tone, size) {
  const buffer = new Float32Array(size);
  for (let i = 0; i < size; ++i) buffer[i] = tone.processSample();
  return buffer;
}
const rms = data => Math.sqrt(data.reduce((sum, sample) => sum + sample * sample, 0) / data.length);

test('zero intensity is silent and invalid inputs are bounded', () => {
  const tone = new ShepardTone(48000);
  assert.ok(render(tone, 1024).every(value => value === 0));
  for (const [value, expected] of [[2, 1], [-1, 0], [NaN, 0], [Infinity, 0]]) {
    tone.setIntensity(value);
    assert.equal(tone.m_intensity, expected);
  }
  assert.throws(() => new ShepardTone(0), RangeError);
});

test('intensity controls pitch rate and gain with sample-rate independent smoothing', () => {
  for (const sampleRate of [44100, 48000, 96000]) {
    const tone = new ShepardTone(sampleRate);
    tone.setIntensity(1);
    const first = tone.processSample();
    assert.equal(first, 0);
    assert.ok(tone.m_smoothedIntensity < 0.001);
    assert.ok(rms(render(tone, sampleRate)) > 0.05);
    assert.ok(Math.abs(tone.m_smoothedIntensity - 1) < 1e-8);
    assert.ok(tone.m_oscillators[0].octave > 0.45);
    assert.ok(tone.m_oscillators[0].octave < 0.51);
    tone.setIntensity(0);
    render(tone, sampleRate);
    assert.ok(rms(render(tone, 1024)) < 1e-8);
  }
});

test('octave wrapping stays finite, bounded and below Nyquist', () => {
  const tone = new ShepardTone(8000);
  tone.setIntensity(1);
  const samples = render(tone, 8000 * 20);
  assert.ok(samples.every(value => Number.isFinite(value) && Math.abs(value) < 0.57));
  for (const osc of tone.m_oscillators) {
    assert.ok(osc.octave >= 0 && osc.octave < 8);
    assert.ok(osc.phase >= 0 && osc.phase < 1);
    assert.ok(tone.m_fMin * 2 ** osc.octave < 4000);
  }
  assert.ok(tone.m_oscillators[0].octave < 2, 'lowest oscillator completed an octave-range wrap');
});

test('rendering across blocks preserves phase and exact output', () => {
  const a = new ShepardTone(48000);
  const b = new ShepardTone(48000);
  a.setIntensity(0.75); b.setIntensity(0.75);
  const contiguous = render(a, 1024);
  const blocks = new Float32Array(1024);
  for (let offset = 0; offset < blocks.length; offset += 128) blocks.set(render(b, 128), offset);
  assert.deepEqual(contiguous, blocks);
});

test('AudioWorklet fills each output channel and responds to intensity', async () => {
  let Processor;
  const scope = vm.createContext({
    ShepardTone, sampleRate: 48000, AudioWorkletProcessor: class {},
    registerProcessor: (name, implementation) => { assert.equal(name, 'shepard-tone'); Processor = implementation; }
  });
  const source = (await readFile(new URL('../src/site/blog/shepard-tone-worklet.js', import.meta.url), 'utf8')).replace(/^import .*?;\n/, '');
  vm.runInContext(source, scope);
  const processor = new Processor();
  const channels = [new Float32Array(128), new Float32Array(128)];
  assert.equal(processor.process([], [channels], { intensity: [1] }), true);
  assert.deepEqual(channels[0], channels[1]);
  assert.ok(channels[0].some(value => value !== 0));
  assert.equal(processor.process([], [[]], { intensity: [0] }), true);
});
