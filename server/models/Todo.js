const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Todo = sequelize.define('Todo', {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Personal'
    },
    reminderTime: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Todo;
