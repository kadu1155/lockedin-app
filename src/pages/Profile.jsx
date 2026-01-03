import { useGamification } from '../hooks/useGamification';
import { UserProfile } from '../components/UserProfile';
import '../styles/App.css'; // Reusing generic styles

export function Profile() {
    const { xp, level, getProgress } = useGamification();

    return (
        <div className="profile-page">
            <header style={{ marginBottom: '2rem' }}>
                <h2>My Stats 📈</h2>
                <p className="status-text">Track your grind.</p>
            </header>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <UserProfile xp={xp} level={level} progress={getProgress()} />

                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)'
                }}>
                    <h3>Achievements 🏆</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        <div className="achievement-badge" style={{ opacity: level >= 1 ? 1 : 0.3 }}>
                            <div style={{ fontSize: '2rem' }}>🐣</div>
                            <small>Started</small>
                        </div>
                        <div className="achievement-badge" style={{ opacity: level >= 5 ? 1 : 0.3 }}>
                            <div style={{ fontSize: '2rem' }}>⚔️</div>
                            <small>Warrior</small>
                        </div>
                        <div className="achievement-badge" style={{ opacity: level >= 10 ? 1 : 0.3 }}>
                            <div style={{ fontSize: '2rem' }}>👑</div>
                            <small>King</small>
                        </div>
                        <div className="achievement-badge" style={{ opacity: xp > 1000 ? 1 : 0.3 }}>
                            <div style={{ fontSize: '2rem' }}>🚀</div>
                            <small>1k Club</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
