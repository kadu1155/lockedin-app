import { useEffect, useRef } from 'react';
import '../styles/ReminderModal.css';

export function ReminderModal({ reminder, onDismiss, onSnooze }) {
    const audioContextRef = useRef(null);

    useEffect(() => {
        if (!reminder) return;

        // Play pleasant chime using Web Audio API
        const playChime = () => {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;

                const ctx = new AudioContext();
                audioContextRef.current = ctx;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6

                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 1.5);
            } catch (e) {
                console.error("Audio play failed", e);
            }
        };

        playChime();
        // Loop chime every 3 seconds
        const interval = setInterval(playChime, 3000);

        return () => {
            clearInterval(interval);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [reminder]);

    if (!reminder) return null;

    return (
        <div className="reminder-overlay">
            <div className="reminder-modal">
                <div className="reminder-icon">⏰</div>
                <h3>Reminder!</h3>
                <p className="reminder-text">{reminder.text}</p>
                <div className="reminder-actions">
                    <button className="snooze-btn" onClick={() => onSnooze(reminder)}>
                        Snooze 5m
                    </button>
                    <button className="dismiss-btn" onClick={() => onDismiss(reminder.id)}>
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
