import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) return;

        let res;
        if (isLogin) {
            res = await login(username, password);
        } else {
            res = await register(username, password);
        }

        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text-container">
                        <h1 className="hero-title">Unlock Your Potential with <span className="brand-highlight">LockedIn</span></h1>
                        <p className="hero-subtitle">The ultimate productivity dashboard. Secure, synced, and full-stack.</p>
                        <div className="feature-pills">
                            <span>🔐 Secure Auth</span>
                            <span>🎮 RPG Gamification</span>
                            <span>🧘 Focus Mode</span>
                        </div>
                    </div>

                    <div className="login-card-container">
                        <div className="login-card">
                            <div className="login-header">
                                <div className="login-logo">🔒</div>
                                <h2>{isLogin ? 'Welcome Back' : 'Join the Squad'}</h2>
                                <p>Enter the flow state.</p>
                            </div>

                            {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="input-group-login">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Username"
                                        className="login-input"
                                        autoFocus
                                    />
                                </div>
                                <div className="input-group-login">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="login-input"
                                    />
                                </div>
                                <button type="submit" className="login-btn" disabled={!username || !password}>
                                    {isLogin ? 'Login 🚀' : 'Sign Up ✨'}
                                </button>
                            </form>

                            <div className="login-footer">
                                <p style={{ cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
                                    {isLogin ? "New here? Create account" : "Already have an account? Login"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-container">
                    <h2>Why LockedIn?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎮</div>
                            <h3>Level Up Your Life</h3>
                            <p>Turn mundane tasks into an RPG. Earn XP, gain levels, and become the Productivity King.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🧠</div>
                            <h3>Deep Focus</h3>
                            <p>Built-in Pomodoro timer with white noise generator to help you enter the zone instantly.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3>AI Powered</h3>
                            <p>Smart planning algorithms analyze your mood and schedule to optimize your day.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} Kadambari. All rights reserved.</p>
            </footer>
        </div>
    );
}
