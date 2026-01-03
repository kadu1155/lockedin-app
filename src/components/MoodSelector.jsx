import '../styles/MoodSelector.css';

export function MoodSelector({ currentMood, onMoodChange }) {
    const moods = [
        { label: 'High Energy', icon: '⚡' },
        { label: 'Neutral', icon: '😐' },
        { label: 'Low Energy', icon: '🔋' }
    ];

    return (
        <div className="mood-selector">
            <h3>How are you feeling?</h3>
            <div className="mood-options">
                {moods.map((m) => (
                    <button
                        key={m.label}
                        className={`mood-btn ${currentMood === m.label ? 'active' : ''}`}
                        onClick={() => onMoodChange(m.label)}
                    >
                        <span className="mood-icon">{m.icon}</span>
                        <span className="mood-label">{m.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
