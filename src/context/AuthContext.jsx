import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved token and restore session
        const token = localStorage.getItem('lockedin-token');
        const savedUser = localStorage.getItem('lockedin-user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            const { token, user } = res.data;

            localStorage.setItem('lockedin-token', token);
            localStorage.setItem('lockedin-user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (username, password) => {
        try {
            const res = await api.post('/auth/register', { username, password });
            const { token, user } = res.data;

            localStorage.setItem('lockedin-token', token);
            localStorage.setItem('lockedin-user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lockedin-token');
        localStorage.removeItem('lockedin-user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
