import '../styles/UserProfile.css';

export function UserProfile({ xp, level, progress }) {
    return (
        <div className="user-profile">
            <div className="avatar-container">
                <div className="avatar">
                    {level >= 10 ? '👑' : level >= 5 ? '⚔️' : '🐣'}
                </div>
                <div className="level-badge">Lvl {level}</div>
            </div>
            <div className="stats-container">
                <div className="stats-header">
                    <span className="rank-title">
                        {level >= 10 ? 'Productivity King' : level >= 5 ? 'Task Master' : 'Novice Planner'}
                    </span>
                    <span className="xp-text">{xp} XP</span>
                </div>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
