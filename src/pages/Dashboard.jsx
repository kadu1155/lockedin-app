import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { useReminders } from '../hooks/useReminders';
import { useGamification } from '../hooks/useGamification';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { MoodSelector } from '../components/MoodSelector';
import { SmartPlanner } from '../components/SmartPlanner';
import { ReminderModal } from '../components/ReminderModal';
import { FocusMode } from '../components/FocusMode';
import { UserProfile } from '../components/UserProfile';

export function Dashboard() {
    const { todos, addTodo, deleteTodo, toggleTodo, editTodo } = useTodos();
    const { activeReminder, dismissReminder } = useReminders(todos);
    const { xp, level, getProgress, addXp } = useGamification();
    const [mood, setMood] = useState('Neutral');
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
    const activeCount = todos.filter(t => !t.completed).length;

    const handleAddTodo = (text, reminderTime, category) => {
        addTodo(text, reminderTime, category);
        addXp(10);
    };

    const handleToggleTodo = (id) => {
        const todo = todos.find(t => t.id === id);
        if (todo && !todo.completed) {
            addXp(100);
        }
        toggleTodo(id);
    };

    return (
        <div className="dashboard-container">
            <header className="app-header">
                <div className="header-top">
                    <h2>Today's Mission 🎯</h2>
                    <button
                        className="focus-btn-trigger"
                        onClick={() => setIsFocusModeOpen(true)}
                        title="Enter Focus Mode"
                    >
                        🧘 Focus
                    </button>
                </div>
                <p className="status-text">
                    {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
                </p>
            </header>

            <UserProfile xp={xp} level={level} progress={getProgress()} />

            <MoodSelector currentMood={mood} onMoodChange={setMood} />

            <TodoForm onAdd={handleAddTodo} />

            <TodoList
                todos={todos}
                onToggle={handleToggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
            />

            <SmartPlanner tasks={todos} mood={mood} />

            <ReminderModal
                reminder={activeReminder}
                onDismiss={dismissReminder}
                onSnooze={() => dismissReminder()}
            />

            <FocusMode isOpen={isFocusModeOpen} onClose={() => setIsFocusModeOpen(false)} />
        </div>
    );
}
