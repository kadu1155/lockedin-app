import { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import '../styles/FocusMode.css';

export function FocusMode({ isOpen, onClose }) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // focus (25) | break (5)
    const [soundEnabled, setSoundEnabled] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            soundEngine.stop(); // Stop sound when timer ends
            setSoundEnabled(false);
            // Play notification sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => { });
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Handle Sound Toggle
    useEffect(() => {
        if (soundEnabled && isActive) {
            soundEngine.playPinkNoise(0.05);
        } else {
            soundEngine.stop();
        }
        return () => soundEngine.stop(); // Cleanup
    }, [soundEnabled, isActive]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setSoundEnabled(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setSoundEnabled(false);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="focus-overlay">
            <button className="close-focus" onClick={onClose}>✕</button>

            <div className="focus-container">
                <h2 className="focus-title">{mode === 'focus' ? 'Deep Focus' : 'Take a Break'}</h2>

                <div className="timer-display">
                    {formatTime(timeLeft)}
                </div>

                <div className="focus-controls">
                    <button
                        className={`control-btn ${isActive ? 'pause' : 'start'}`}
                        onClick={toggleTimer}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button className="control-btn reset" onClick={resetTimer}>Reset</button>
                </div>

                <div className="mode-switch">
                    <button
                        className={mode === 'focus' ? 'active' : ''}
                        onClick={() => switchMode('focus')}
                    >
                        Focus (25m)
                    </button>
                    <button
                        className={mode === 'break' ? 'active' : ''}
                        onClick={() => switchMode('break')}
                    >
                        Break (5m)
                    </button>
                </div>

                <label className="sound-toggle">
                    <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={() => setSoundEnabled(!soundEnabled)}
                    />
                    <span>🌊 Play White Noise</span>
                </label>
            </div>
        </div>
    );
}
