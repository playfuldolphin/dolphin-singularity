/**
 * Interactive Dolphin Sound Visualizer
 * Visualizes audio waveforms and spectrograms
 */

class DolphinSoundVisualizer {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.animationId = null;
        
        // Options
        this.options = {
            fftSize: options.fftSize || 2048,
            smoothingTimeConstant: options.smoothingTimeConstant || 0.8,
            visualizationType: options.visualizationType || 'waveform', // 'waveform', 'frequency', 'spectrogram'
            colors: options.colors || {
                primary: '#00c9ff',
                secondary: '#0077be',
                background: '#0a1628'
            }
        };
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height || 300;
    }
    
    async initialize(audioElement) {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.options.fftSize;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            const source = this.audioContext.createMediaElementSource(audioElement);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        }
        
        this.draw();
    }
    
    draw() {
        this.animationId = requestAnimationFrame(() => this.draw());
        
        const { width, height } = this.canvas;
        this.ctx.fillStyle = this.options.colors.background;
        this.ctx.fillRect(0, 0, width, height);
        
        switch (this.options.visualizationType) {
            case 'waveform':
                this.drawWaveform();
                break;
            case 'frequency':
                this.drawFrequency();
                break;
            case 'spectrogram':
                this.drawSpectrogram();
                break;
            case 'circular':
                this.drawCircular();
                break;
        }
    }
    
    drawWaveform() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        
        const { width, height } = this.canvas;
        const sliceWidth = width / this.bufferLength;
        
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.options.colors.primary;
        this.ctx.beginPath();
        
        let x = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = v * height / 2;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        this.ctx.lineTo(width, height / 2);
        this.ctx.stroke();
    }
    
    drawFrequency() {
        this.analyser.getByteFrequencyData(this.dataArray);
        
        const { width, height } = this.canvas;
        const barWidth = (width / this.bufferLength) * 2.5;
        let x = 0;
        
        for (let i = 0; i < this.bufferLength; i++) {
            const barHeight = (this.dataArray[i] / 255) * height;
            
            // Create gradient
            const gradient = this.ctx.createLinearGradient(0, height - barHeight, 0, height);
            gradient.addColorStop(0, this.options.colors.primary);
            gradient.addColorStop(1, this.options.colors.secondary);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }
    
    drawSpectrogram() {
        this.analyser.getByteFrequencyData(this.dataArray);
        
        const { width, height } = this.canvas;
        
        // Shift existing spectrogram left
        const imageData = this.ctx.getImageData(1, 0, width - 1, height);
        this.ctx.putImageData(imageData, 0, 0);
        
        // Draw new column
        for (let i = 0; i < this.bufferLength; i++) {
            const value = this.dataArray[i];
            const y = (i / this.bufferLength) * height;
            const intensity = value / 255;
            
            // Color based on intensity
            const r = Math.floor(intensity * 0);
            const g = Math.floor(intensity * 201);
            const b = Math.floor(intensity * 255);
            
            this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            this.ctx.fillRect(width - 1, height - y, 1, height / this.bufferLength);
        }
    }
    
    drawCircular() {
        this.analyser.getByteFrequencyData(this.dataArray);
        
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius / 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.options.colors.secondary;
        this.ctx.fill();
        
        const bars = 128;
        const step = (this.bufferLength / bars) | 0;
        
        for (let i = 0; i < bars; i++) {
            const value = this.dataArray[i * step];
            const barHeight = (value / 255) * (radius / 2);
            const angle = (i / bars) * Math.PI * 2;
            
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            const x2 = centerX + Math.cos(angle) * (radius + barHeight);
            const y2 = centerY + Math.sin(angle) * (radius + barHeight);
            
            const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, this.options.colors.secondary);
            gradient.addColorStop(1, this.options.colors.primary);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }
    
    setVisualizationType(type) {
        this.options.visualizationType = type;
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stop();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Demo sound generator for testing
class DolphinSoundGenerator {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Generate a signature whistle (frequency sweep)
    generateSignatureWhistle(duration = 1.0) {
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            // Sweep from 5kHz to 15kHz
            const freq = 5000 + (10000 * t / duration);
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3;
        }
        
        return buffer;
    }
    
    // Generate echolocation clicks
    generateEcholocationClicks(duration = 1.0, clickRate = 10) {
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        const clickInterval = sampleRate / clickRate;
        
        for (let i = 0; i < buffer.length; i++) {
            const clickPhase = i % clickInterval;
            if (clickPhase < 50) {
                // Short burst pulse
                data[i] = Math.sin(2 * Math.PI * 100000 * (i / sampleRate)) * 0.5;
            }
        }
        
        return buffer;
    }
    
    playBuffer(buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start();
        return source;
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.DolphinSoundVisualizer = DolphinSoundVisualizer;
    window.DolphinSoundGenerator = DolphinSoundGenerator;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DolphinSoundVisualizer, DolphinSoundGenerator };
}
