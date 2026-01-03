import { useState, useRef, useEffect } from 'react';
import { generateGoogleCalendarUrl } from '../utils/googleCalendar';
import '../styles/TodoItem.css';

export function TodoItem({ todo, onToggle, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleEditSubmit = (e) => {
        e.preventDefault();
        onEdit(todo.id, editText);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setEditText(todo.text);
            setIsEditing(false);
        }
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label className="checkbox-container">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                />
                <span className="checkmark"></span>
            </label>

            <div className="content">
                {isEditing ? (
                    <form onSubmit={handleEditSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={() => {
                                onEdit(todo.id, editText);
                                setIsEditing(false);
                            }}
                            onKeyDown={handleKeyDown}
                            className="edit-input"
                        />
                    </form>
                ) : (
                    <div className="text-container">
                        {todo.category && (
                            <span className={`category-badge ${todo.category.toLowerCase()}`}>
                                {todo.category}
                            </span>
                        )}
                        <span className="todo-text" onDoubleClick={() => setIsEditing(true)}>
                            {todo.text}
                        </span>
                        {todo.reminderTime && (
                            <span className="todo-time">
                                ⏰ {new Date(todo.reminderTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="actions">
                <a
                    href={generateGoogleCalendarUrl(todo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-button calendar-btn"
                    title="Add to Google Calendar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </a>
                <button
                    className="icon-button edit-btn"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit"
                    disabled={todo.completed}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button
                    className="icon-button delete-btn"
                    onClick={() => onDelete(todo.id)}
                    aria-label="Delete"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
