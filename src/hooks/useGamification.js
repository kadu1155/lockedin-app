import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export function useGamification() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ xp: 0, level: 1 });

    useEffect(() => {
        if (user) {
            setStats({ xp: user.xp || 0, level: user.level || 1 });
        }
    }, [user]);

    const syncStats = async (newXp, newLevel) => {
        try {
            await api.post('/gamification/sync', { xp: newXp, level: newLevel });
        } catch (err) {
            console.error("Failed to sync stats", err);
        }
    };

    const addXp = (amount) => {
        setStats(prev => {
            const newXp = prev.xp + amount;
            const newLevel = Math.floor(newXp / 500) + 1;

            // Sync with server if changed
            syncStats(newXp, newLevel);

            return {
                xp: newXp,
                level: newLevel
            };
        });
    };

    const getNextLevelXp = () => {
        return stats.level * 500;
    };

    const getProgress = () => {
        const currentLevelBase = (stats.level - 1) * 500;
        const xpInLevel = stats.xp - currentLevelBase;
        return (xpInLevel / 500) * 100;
    };

    return {
        xp: stats.xp,
        level: stats.level,
        addXp,
        getNextLevelXp,
        getProgress
    };
}
