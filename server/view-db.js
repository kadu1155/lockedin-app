const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open the database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
        process.exit(1);
    }
});

console.log(`\n📂 connected to database: ${dbPath}\n`);

// Query Users
db.all("SELECT id, username, xp, level, createdAt FROM Users", [], (err, rows) => {
    if (err) throw err;
    console.log("👤 USERS TABLE:");
    console.table(rows);

    // Query Todos
    db.all("SELECT id, text, completed, category, UserId FROM Todos", [], (err, rows) => {
        if (err) throw err;
        console.log("\n📝 TODOS TABLE:");
        console.table(rows);

        db.close();
    });
});
