import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import '../styles/Layout.css';

export function Layout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="layout-shell">
            {/* Mobile Header */}
            <div className="mobile-header">
                <div className="logo-text">LockedIn 🔒</div>
                <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">🔒</div>
                    <h1 className="brand-name">LockedIn</h1>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Profile
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <span className="user-name">{user?.username || 'Guest'}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Log Out
                    </button>
                    <div className="theme-wrapper">
                        <ThemeToggle />
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}
        </div>
    );
}
