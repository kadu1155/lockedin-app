import { useState, useEffect } from 'react';
import api from '../api';

export function useTodos() {
    const [todos, setTodos] = useState([]);

    const fetchTodos = async () => {
        try {
            const res = await api.get('/todos');
            setTodos(res.data);
        } catch (err) {
            console.error("Failed to fetch todos", err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchTodos();
    }, []);

    const addTodo = async (text, reminderTime, category = 'Personal') => {
        try {
            const res = await api.post('/todos', { text, reminderTime, category });
            setTodos(prev => [...prev, res.data]);
        } catch (err) {
            console.error("Failed to add todo", err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}`);
            setTodos(prev => prev.filter(todo => todo.id !== id));
        } catch (err) {
            console.error("Failed to delete todo", err);
        }
    };

    const toggleTodo = async (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const res = await api.patch(`/todos/${id}`, { completed: !todo.completed });
            setTodos(prev => prev.map(t => t.id === id ? res.data : t));
        } catch (err) {
            console.error("Failed to toggle todo", err);
        }
    };

    const editTodo = async (id, newText) => {
        try {
            const res = await api.patch(`/todos/${id}`, { text: newText });
            setTodos(prev => prev.map(t => t.id === id ? res.data : t));
        } catch (err) {
            console.error("Failed to edit todo", err);
        }
    };

    return { todos, addTodo, deleteTodo, toggleTodo, editTodo };
}
