import { useState, useEffect, useRef } from 'react';

export function useReminders(todos) {
    const [activeReminder, setActiveReminder] = useState(null);
    const alertedIds = useRef(new Set());

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();

            todos.forEach(todo => {
                if (!todo.reminderTime || todo.completed) return;

                const reminderTime = new Date(todo.reminderTime);

                // Alert if time is reached (within last minute) and not yet alerted
                if (now >= reminderTime &&
                    now.getTime() - reminderTime.getTime() < 60000 &&
                    !alertedIds.current.has(todo.id + todo.reminderTime)) { // Use combo key to allow snoozing/rescheduling

                    setActiveReminder(todo);
                    alertedIds.current.add(todo.id + todo.reminderTime);

                    // Browser Notification
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('To-Do Reminder', {
                            body: todo.text,
                            icon: '/vite.svg' // Fallback icon
                        });
                    }
                }
            });
        };

        const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [todos]);

    const dismissReminder = () => {
        setActiveReminder(null);
    };

    return { activeReminder, dismissReminder };
}
