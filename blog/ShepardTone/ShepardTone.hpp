#pragma once

#include <algorithm>
#include <array>
#include <cmath>
#include <cstddef>
#include <stdexcept>

// Call setIntensity() and processSample() from the same audio thread.
// Transfer game-thread parameters safely before calling setIntensity().
class ShepardTone
{
public:
    explicit ShepardTone(double sampleRate)
        : m_sampleRate(sampleRate)
    {
        if (!std::isfinite(sampleRate) || sampleRate < 8000.0)
            throw std::invalid_argument("Invalid audio sample rate");

        m_fMin = std::min(30.0, sampleRate * 0.45 / std::pow(2.0, m_numOscillators));
        m_alpha = std::exp(-1.0 / (0.05 * sampleRate));
        reset();
    }

    void reset() noexcept
    {
        m_smoothedIntensity = 0.0;
        for (std::size_t k = 0; k < m_oscillators.size(); ++k)
            m_oscillators[k] = { static_cast<double>(k), 0.0 };
    }

    void setIntensity(double value) noexcept
    {
        m_intensity = std::isfinite(value) ? std::clamp(value, 0.0, 1.0) : 0.0;
    }

    float processSample() noexcept
    {
        m_smoothedIntensity = updateSmoothedIntensity(m_intensity);
        const double riseRate = m_maxRiseRate * m_smoothedIntensity;
        const double gain = m_maxGain * m_smoothedIntensity;
        double output = 0.0;
        double weightSquaredSum = 0.0;

        for (Oscillator& osc : m_oscillators)
        {
            const double x_n = osc.octave;
            const double freq = m_fMin * std::pow(2.0, x_n);
            const double weight = calculateWeight(x_n);
            const double sample = std::sin(2.0 * PI * osc.phase);
            output += weight * sample;
            weightSquaredSum += weight * weight;

            osc.phase += freq / m_sampleRate;
            osc.phase -= std::floor(osc.phase);
            osc.octave += riseRate / m_sampleRate;
            if (osc.octave >= m_numOscillators)
                osc.octave -= m_numOscillators;
        }

        output /= std::sqrt(weightSquaredSum) + 1e-6;
        return static_cast<float>(gain * output);
    }

    void process(float* output, std::size_t size) noexcept
    {
        if (output == nullptr) return;
        for (std::size_t i = 0; i < size; ++i) output[i] = processSample();
    }

private:
    struct Oscillator { double octave; double phase; };

    double calculateWeight(double x_n) const noexcept
    {
        const double hannWeight = 0.5 * (1.0 - std::cos(2.0 * PI * x_n / m_numOscillators));
        // The center is an octave position on the logarithmic frequency axis.
        const double z = (x_n - m_centerOctave) / m_sigma;
        return hannWeight * std::exp(-0.5 * z * z);
    }

    double updateSmoothedIntensity(double I) const noexcept
    {
        return m_alpha * m_smoothedIntensity + (1.0 - m_alpha) * I;
    }

    static constexpr double PI = 3.14159265358979323846;
    static constexpr std::size_t m_numOscillators = 8;
    static constexpr double m_centerOctave = 4.0;
    static constexpr double m_sigma = 1.6;
    static constexpr double m_maxRiseRate = 0.5; // octaves per second
    static constexpr double m_maxGain = 0.2;
    double m_sampleRate;
    double m_fMin = 30.0;
    double m_alpha = 0.0;
    double m_intensity = 0.0;
    double m_smoothedIntensity = 0.0;
    std::array<Oscillator, m_numOscillators> m_oscillators {};
};
