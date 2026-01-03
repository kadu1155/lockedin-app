// Simple White/Pink Noise Generator using Web Audio API

let audioCtx = null;
let noiseSource = null;
let gainNode = null;

export const soundEngine = {
    init: () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playWhiteNoise: (volume = 0.1) => {
        if (!audioCtx) soundEngine.init();
        if (noiseSource) return; // Already playing

        const bufferSize = audioCtx.sampleRate * 2; // 2 seconds buffer
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            // White noise: random between -1 and 1
            data[i] = Math.random() * 2 - 1;
        }

        noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        gainNode = audioCtx.createGain();
        gainNode.gain.value = volume;

        noiseSource.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noiseSource.start();
    },

    playPinkNoise: (volume = 0.1) => {
        // Pink noise approximation (1/f)
        if (!audioCtx) soundEngine.init();
        if (noiseSource) return;

        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11; // compensate for gain
            b6 = white * 0.115926;
        }

        noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        gainNode = audioCtx.createGain();
        gainNode.gain.value = volume;

        noiseSource.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noiseSource.start();
    },

    stop: () => {
        if (noiseSource) {
            noiseSource.stop();
            noiseSource.disconnect();
            noiseSource = null;
        }
        if (gainNode) {
            gainNode.disconnect();
            gainNode = null;
        }
    }
};
