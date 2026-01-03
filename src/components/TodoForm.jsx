import { useState } from 'react';
import '../styles/TodoForm.css';

export function TodoForm({ onAdd }) {
    const [input, setInput] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [category, setCategory] = useState('Personal');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onAdd(input, reminderTime ? new Date(reminderTime).toISOString() : null, category);
            setInput('');
            setReminderTime('');
            setCategory('Personal');
        }
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a new task..."
                    className="todo-input"
                    autoFocus
                />

                <div className="form-footer">
                    <div className="reminder-input-container">
                        <input
                            type="datetime-local"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="reminder-input"
                            title="Set reminder"
                        />
                        {reminderTime && (
                            <span className="time-preview">
                                {new Date(reminderTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        )}
                    </div>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="category-select"
                        title="Select Category"
                    >
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Health">Health</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <button type="submit" className="add-button" disabled={!input.trim()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </form>
    );
}
