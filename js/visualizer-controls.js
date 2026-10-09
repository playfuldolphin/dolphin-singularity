document.addEventListener('DOMContentLoaded', () => {
    const visualizer = new DolphinSoundVisualizer('visualizerCanvas');
    const buttons = [...document.querySelectorAll('.play-btn:not(:disabled)')];
    const status = document.getElementById('audioStatus');
    let generator;
    let activeSource = null;
    let activeButton = null;
    let requestId = 0;

    function resetButtons() {
        buttons.forEach(button => {
            button.textContent = '▶';
            button.setAttribute('aria-pressed', 'false');
            button.setAttribute('aria-label', button.dataset.sound === 'signature' ? 'Play whistle demo' : 'Play click demo');
        });
    }

    function stopPlayback() {
        requestId += 1;
        if (activeSource) {
            activeSource.onended = null;
            activeSource.stop();
            activeSource.disconnect();
        }
        activeSource = null;
        activeButton = null;
        visualizer.stop();
        resetButtons();
        status.textContent = 'Playback stopped.';
    }

    document.querySelectorAll('.viz-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.viz-btn').forEach(item => {
                item.classList.toggle('active', item === button);
                item.setAttribute('aria-pressed', String(item === button));
            });
            visualizer.setVisualizationType(button.dataset.type);
        });
    });

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const wasPlaying = activeButton === button;
            stopPlayback();
            if (wasPlaying) return;
            const currentRequest = requestId;
            activeButton = button;
            try {
                // Create/resume audio only in response to a visitor's play action.
                if (!generator) generator = new DolphinSoundGenerator();
                await generator.audioContext.resume();
                if (currentRequest !== requestId) return;
                visualizer.initialize(generator.audioContext);
                const buffer = button.dataset.sound === 'signature'
                    ? generator.generateSignatureWhistle(2)
                    : generator.generateEcholocationClicks(2, 20);
                const source = generator.playBuffer(buffer, visualizer.analyser);
                activeSource = source;
                button.textContent = '■';
                button.setAttribute('aria-pressed', 'true');
                button.setAttribute('aria-label', 'Stop demo');
                status.textContent = 'Playing a synthesized teaching example.';
                source.onended = () => {
                    if (activeSource !== source) return;
                    source.disconnect();
                    activeSource = null;
                    activeButton = null;
                    visualizer.stop();
                    resetButtons();
                    status.textContent = 'Demo finished. Choose another sound or display.';
                };
            } catch (_) {
                if (currentRequest !== requestId) return;
                stopPlayback();
                status.textContent = 'Audio could not start. Check your browser’s audio settings and try again.';
            }
        });
    });
    window.addEventListener('pagehide', stopPlayback);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopPlayback();
    });
});
