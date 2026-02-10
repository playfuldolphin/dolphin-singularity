/**
 * Dolphin Audio Analysis Module
 * Processes dolphin vocalizations and prepares data for Claude analysis
 * 
 * Features:
 * - Audio file loading and validation
 * - Spectrogram generation
 * - Feature extraction (frequency, duration, patterns)
 * - Signature whistle detection
 * - Click pattern analysis
 */

class DolphinAudioAnalyzer {
    constructor(config = {}) {
        this.sampleRate = config.sampleRate || 44100;
        this.fftSize = config.fftSize || 2048;
        this.hopSize = config.hopSize || 512;
        
        // Dolphin vocalization frequency ranges (Hz)
        this.frequencyRanges = {
            whistles: { min: 4000, max: 20000 },
            clicks: { min: 40000, max: 150000 },
            burstPulse: { min: 2000, max: 50000 }
        };
        
        // Minimum duration for classification (ms)
        this.minDuration = {
            whistle: 100,
            click: 1,
            burstPulse: 50
        };
    }

    /**
     * Main analysis pipeline
     * Takes audio file and returns structured analysis
     */
    async analyze(audioBuffer, metadata = {}) {
        const analysis = {
            metadata: {
                ...metadata,
                duration: this.getDuration(audioBuffer),
                sampleRate: this.sampleRate,
                timestamp: new Date().toISOString()
            },
            vocalizations: [],
            statistics: {},
            spectrogramData: null
        };

        // Generate spectrogram
        analysis.spectrogramData = await this.generateSpectrogram(audioBuffer);

        // Detect vocalizations
        analysis.vocalizations = await this.detectVocalizations(audioBuffer);

        // Extract features
        for (let vocalization of analysis.vocalizations) {
            vocalization.features = await this.extractFeatures(
                audioBuffer,
                vocalization.startTime,
                vocalization.endTime
            );
        }

        // Calculate statistics
        analysis.statistics = this.calculateStatistics(analysis.vocalizations);

        return analysis;
    }

    /**
     * Generate spectrogram from audio buffer
     */
    async generateSpectrogram(audioBuffer) {
        // In a real implementation, this would use:
        // - Web Audio API for browser
        // - Native audio libraries for Node.js (like @tensorflow/tfjs-node)
        // - Python integration for advanced processing
        
        const spectrogram = {
            width: Math.floor(audioBuffer.length / this.hopSize),
            height: this.fftSize / 2,
            data: [], // 2D array of frequency intensities
            timeResolution: this.hopSize / this.sampleRate,
            frequencyResolution: this.sampleRate / this.fftSize
        };

        // Simplified spectrogram generation (placeholder)
        // Real implementation would use FFT
        for (let i = 0; i < spectrogram.width; i++) {
            const timeSlice = [];
            for (let j = 0; j < spectrogram.height; j++) {
                // Placeholder: random data
                // Real: FFT magnitude at this frequency bin
                timeSlice.push(0);
            }
            spectrogram.data.push(timeSlice);
        }

        return spectrogram;
    }

    /**
     * Convert spectrogram to base64 image for Claude
     */
    async spectrogramToImage(spectrogramData) {
        // In production, use Canvas API or image library
        // to render spectrogram as PNG
        
        const width = spectrogramData.width;
        const height = spectrogramData.height;
        
        // Placeholder: return data URL format
        return {
            format: 'image/png',
            width: width,
            height: height,
            base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 1x1 placeholder
            url: `data:image/png;base64,${this.base64}`
        };
    }

    /**
     * Detect individual vocalizations in audio
     */
    async detectVocalizations(audioBuffer) {
        const vocalizations = [];
        
        // Energy-based detection (simplified)
        const windowSize = Math.floor(this.sampleRate * 0.01); // 10ms windows
        const threshold = this.calculateNoiseThreshold(audioBuffer);
        
        let inVocalization = false;
        let startSample = 0;
        
        for (let i = 0; i < audioBuffer.length; i += windowSize) {
            const window = audioBuffer.slice(i, i + windowSize);
            const energy = this.calculateEnergy(window);
            
            if (energy > threshold && !inVocalization) {
                // Start of vocalization
                inVocalization = true;
                startSample = i;
            } else if (energy <= threshold && inVocalization) {
                // End of vocalization
                inVocalization = false;
                const endSample = i;
                
                vocalizations.push({
                    startTime: startSample / this.sampleRate,
                    endTime: endSample / this.sampleRate,
                    duration: (endSample - startSample) / this.sampleRate,
                    startSample: startSample,
                    endSample: endSample,
                    type: null // Will be classified later
                });
            }
        }
        
        // Classify each vocalization
        for (let voc of vocalizations) {
            voc.type = await this.classifyVocalization(audioBuffer, voc);
        }
        
        return vocalizations;
    }

    /**
     * Classify vocalization type
     */
    async classifyVocalization(audioBuffer, vocalization) {
        const segment = audioBuffer.slice(
            vocalization.startSample,
            vocalization.endSample
        );
        
        const dominantFreq = this.findDominantFrequency(segment);
        const duration = vocalization.duration * 1000; // Convert to ms
        
        // Classification logic based on frequency and duration
        if (dominantFreq >= this.frequencyRanges.whistles.min &&
            dominantFreq <= this.frequencyRanges.whistles.max &&
            duration >= this.minDuration.whistle) {
            return {
                category: 'whistle',
                subtype: this.classifyWhistle(segment),
                confidence: 0.85
            };
        } else if (dominantFreq >= this.frequencyRanges.clicks.min &&
                   duration <= this.minDuration.click * 5) {
            return {
                category: 'click',
                subtype: 'echolocation',
                confidence: 0.90
            };
        } else if (dominantFreq >= this.frequencyRanges.burstPulse.min &&
                   duration >= this.minDuration.burstPulse) {
            return {
                category: 'burst-pulse',
                subtype: 'unknown',
                confidence: 0.75
            };
        }
        
        return {
            category: 'unknown',
            subtype: null,
            confidence: 0.5
        };
    }

    /**
     * Classify whistle subtype
     */
    classifyWhistle(segment) {
        // Analyze frequency contour
        const contour = this.extractFrequencyContour(segment);
        
        // Signature whistle characteristics:
        // - Unique frequency modulation pattern
        // - Relatively stable frequency
        // - Duration typically 0.5-2 seconds
        
        const stability = this.calculateFrequencyStability(contour);
        const complexity = this.calculateContourComplexity(contour);
        
        if (stability > 0.7 && complexity < 0.5) {
            return 'signature_whistle';
        } else if (complexity > 0.7) {
            return 'modulated_whistle';
        }
        
        return 'simple_whistle';
    }

    /**
     * Extract audio features for ML/AI analysis
     */
    async extractFeatures(audioBuffer, startTime, endTime) {
        const startSample = Math.floor(startTime * this.sampleRate);
        const endSample = Math.floor(endTime * this.sampleRate);
        const segment = audioBuffer.slice(startSample, endSample);
        
        return {
            // Time domain features
            duration: endTime - startTime,
            energy: this.calculateEnergy(segment),
            zeroCrossingRate: this.calculateZeroCrossingRate(segment),
            
            // Frequency domain features
            dominantFrequency: this.findDominantFrequency(segment),
            frequencyRange: this.getFrequencyRange(segment),
            spectralCentroid: this.calculateSpectralCentroid(segment),
            spectralRolloff: this.calculateSpectralRolloff(segment),
            
            // Whistle-specific features
            frequencyContour: this.extractFrequencyContour(segment),
            contourComplexity: this.calculateContourComplexity(
                this.extractFrequencyContour(segment)
            ),
            frequencyStability: this.calculateFrequencyStability(
                this.extractFrequencyContour(segment)
            ),
            
            // Statistical features
            mean: this.calculateMean(segment),
            variance: this.calculateVariance(segment),
            skewness: this.calculateSkewness(segment),
            kurtosis: this.calculateKurtosis(segment)
        };
    }

    /**
     * Calculate overall statistics
     */
    calculateStatistics(vocalizations) {
        const byType = {};
        
        for (let voc of vocalizations) {
            const type = voc.type?.category || 'unknown';
            if (!byType[type]) {
                byType[type] = {
                    count: 0,
                    totalDuration: 0,
                    frequencies: []
                };
            }
            
            byType[type].count++;
            byType[type].totalDuration += voc.duration;
            if (voc.features) {
                byType[type].frequencies.push(voc.features.dominantFrequency);
            }
        }
        
        return {
            totalVocalizations: vocalizations.length,
            byType: byType,
            averageRate: vocalizations.length / this.getTotalDuration(vocalizations),
            densityMap: this.calculateDensityMap(vocalizations)
        };
    }

    /**
     * Helper: Calculate audio energy
     */
    calculateEnergy(buffer) {
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
            sum += buffer[i] * buffer[i];
        }
        return Math.sqrt(sum / buffer.length);
    }

    /**
     * Helper: Calculate noise threshold
     */
    calculateNoiseThreshold(audioBuffer) {
        // Sample first 0.5 seconds as noise floor
        const noiseSamples = Math.min(
            Math.floor(this.sampleRate * 0.5),
            audioBuffer.length
        );
        const noiseSegment = audioBuffer.slice(0, noiseSamples);
        const noiseEnergy = this.calculateEnergy(noiseSegment);
        
        // Threshold is 3x noise floor
        return noiseEnergy * 3;
    }

    /**
     * Helper: Find dominant frequency
     */
    findDominantFrequency(buffer) {
        // Simplified: would use FFT in production
        return 12000; // Placeholder
    }

    /**
     * Helper: Extract frequency contour over time
     */
    extractFrequencyContour(buffer) {
        const contour = [];
        const windowSize = 512;
        
        for (let i = 0; i < buffer.length; i += windowSize) {
            const window = buffer.slice(i, i + windowSize);
            contour.push({
                time: i / this.sampleRate,
                frequency: this.findDominantFrequency(window)
            });
        }
        
        return contour;
    }

    /**
     * Helper: Calculate frequency stability
     */
    calculateFrequencyStability(contour) {
        if (contour.length < 2) return 1.0;
        
        const frequencies = contour.map(c => c.frequency);
        const mean = frequencies.reduce((a, b) => a + b) / frequencies.length;
        const variance = frequencies.reduce((sum, f) => 
            sum + Math.pow(f - mean, 2), 0) / frequencies.length;
        const stdDev = Math.sqrt(variance);
        
        // Normalized stability (0 = unstable, 1 = very stable)
        return 1 / (1 + stdDev / mean);
    }

    /**
     * Helper: Calculate contour complexity
     */
    calculateContourComplexity(contour) {
        if (contour.length < 3) return 0;
        
        let directionChanges = 0;
        let lastDirection = 0;
        
        for (let i = 1; i < contour.length; i++) {
            const diff = contour[i].frequency - contour[i-1].frequency;
            const direction = Math.sign(diff);
            
            if (direction !== 0 && direction !== lastDirection && lastDirection !== 0) {
                directionChanges++;
            }
            lastDirection = direction;
        }
        
        return directionChanges / (contour.length - 2);
    }

    /**
     * Helper: Calculate zero crossing rate
     */
    calculateZeroCrossingRate(buffer) {
        let crossings = 0;
        for (let i = 1; i < buffer.length; i++) {
            if ((buffer[i] >= 0 && buffer[i-1] < 0) ||
                (buffer[i] < 0 && buffer[i-1] >= 0)) {
                crossings++;
            }
        }
        return crossings / buffer.length;
    }

    /**
     * Helper: Get frequency range
     */
    getFrequencyRange(buffer) {
        // Would use FFT to find min/max frequencies
        return { min: 5000, max: 15000 }; // Placeholder
    }

    /**
     * Helper: Calculate spectral centroid
     */
    calculateSpectralCentroid(buffer) {
        // Weighted mean of frequencies
        return 10000; // Placeholder
    }

    /**
     * Helper: Calculate spectral rolloff
     */
    calculateSpectralRolloff(buffer) {
        // Frequency below which 85% of energy is contained
        return 18000; // Placeholder
    }

    /**
     * Helper: Statistical calculations
     */
    calculateMean(buffer) {
        return buffer.reduce((a, b) => a + b, 0) / buffer.length;
    }

    calculateVariance(buffer) {
        const mean = this.calculateMean(buffer);
        return buffer.reduce((sum, val) => 
            sum + Math.pow(val - mean, 2), 0) / buffer.length;
    }

    calculateSkewness(buffer) {
        // Measure of asymmetry
        return 0; // Placeholder
    }

    calculateKurtosis(buffer) {
        // Measure of "tailedness"
        return 0; // Placeholder
    }

    /**
     * Helper: Get duration
     */
    getDuration(audioBuffer) {
        return audioBuffer.length / this.sampleRate;
    }

    getTotalDuration(vocalizations) {
        if (vocalizations.length === 0) return 0;
        const last = vocalizations[vocalizations.length - 1];
        return last.endTime;
    }

    /**
     * Helper: Calculate vocalization density over time
     */
    calculateDensityMap(vocalizations) {
        // Divide into 1-second bins
        const bins = {};
        
        for (let voc of vocalizations) {
            const bin = Math.floor(voc.startTime);
            bins[bin] = (bins[bin] || 0) + 1;
        }
        
        return bins;
    }

    /**
     * Export analysis to various formats
     */
    exportAnalysis(analysis, format = 'json') {
        switch (format) {
            case 'json':
                return JSON.stringify(analysis, null, 2);
            
            case 'csv':
                return this.toCSV(analysis.vocalizations);
            
            case 'summary':
                return this.generateTextSummary(analysis);
            
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    /**
     * Generate human-readable summary
     */
    generateTextSummary(analysis) {
        const stats = analysis.statistics;
        let summary = `Dolphin Vocalization Analysis Summary\n`;
        summary += `=====================================\n\n`;
        summary += `Duration: ${analysis.metadata.duration.toFixed(2)}s\n`;
        summary += `Total Vocalizations: ${stats.totalVocalizations}\n`;
        summary += `Vocalization Rate: ${stats.averageRate.toFixed(2)}/s\n\n`;
        
        summary += `Breakdown by Type:\n`;
        for (let [type, data] of Object.entries(stats.byType)) {
            summary += `  ${type}: ${data.count} (${data.totalDuration.toFixed(2)}s)\n`;
        }
        
        return summary;
    }

    /**
     * Convert vocalizations to CSV
     */
    toCSV(vocalizations) {
        let csv = 'Start Time,End Time,Duration,Type,Subtype,Confidence,Dominant Frequency\n';
        
        for (let voc of vocalizations) {
            csv += `${voc.startTime.toFixed(3)},`;
            csv += `${voc.endTime.toFixed(3)},`;
            csv += `${voc.duration.toFixed(3)},`;
            csv += `${voc.type?.category || 'unknown'},`;
            csv += `${voc.type?.subtype || 'unknown'},`;
            csv += `${voc.type?.confidence || 0},`;
            csv += `${voc.features?.dominantFrequency || 0}\n`;
        }
        
        return csv;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DolphinAudioAnalyzer;
}

if (typeof window !== 'undefined') {
    window.DolphinAudioAnalyzer = DolphinAudioAnalyzer;
}
