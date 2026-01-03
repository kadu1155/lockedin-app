const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('./database');
const User = require('./models/User');
const Todo = require('./models/Todo');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'lockedin-secret-key-change-this'; // In prod use env var

// Middleware
app.use(cors({
    origin: '*', // Allow all origins (finest for now, or restrict to frontend URL later)
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Associations
User.hasMany(Todo);
Todo.belongsTo(User);

// --- Auth Routes ---

// Register
app.post('/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
        res.json({ token, user: { id: user.id, username: user.username, xp: user.xp, level: user.level } });
    } catch (err) {
        res.status(400).json({ error: 'Username likely taken' });
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
        res.json({ token, user: { id: user.id, username: user.username, xp: user.xp, level: user.level } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Middleware for Protection
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

// --- Todo Routes ---

// Get All
app.get('/todos', authenticate, async (req, res) => {
    const todos = await Todo.findAll({ where: { UserId: req.user.id } });
    res.json(todos);
});

// Create
app.post('/todos', authenticate, async (req, res) => {
    const { text, reminderTime, category } = req.body;
    const todo = await Todo.create({
        text,
        reminderTime,
        category,
        UserId: req.user.id
    });
    res.json(todo);
});

// Update (Toggle/Edit)
app.patch('/todos/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { completed, text } = req.body;

    await Todo.update(
        { completed, text },
        { where: { id, UserId: req.user.id } }
    );
    const updated = await Todo.findOne({ where: { id } });
    res.json(updated);
});

// Delete
app.delete('/todos/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    await Todo.destroy({ where: { id, UserId: req.user.id } });
    res.json({ success: true });
});

// --- Gamification Sync ---
app.post('/gamification/sync', authenticate, async (req, res) => {
    const { xp, level } = req.body;
    await User.update({ xp, level }, { where: { id: req.user.id } });
    res.json({ success: true });
});

// Start Server
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
