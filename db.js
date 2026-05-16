const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

class Database {
    constructor() {
        this.dbType = process.env.DB_TYPE || 'sqlite';
        this.connection = null;
        this.pool = null; // Placeholder for PG/Mongo pool
    }

    async connect() {
        if (this.dbType === 'sqlite') {
            return new Promise((resolve, reject) => {
                const dbPath = path.resolve(__dirname, process.env.DB_NAME || 'database.sqlite');
                this.connection = new sqlite3.Database(dbPath, (err) => {
                    if (err) {
                        console.error('SQLite connection error:', err);
                        reject(err);
                    } else {
                        console.log(`Connected to SQLite database: ${dbPath}`);
                        // Enable WAL mode for better concurrency in SQLite
                        this.connection.run('PRAGMA journal_mode = WAL', (err) => {
                             if (err) console.error('Error setting WAL mode:', err);
                             resolve(this.connection);
                        });
                    }
                });
                
                // Connection "pooling" for SQLite: Serialized access
                this.connection.serialize();
            });
        } else if (this.dbType === 'postgres') {
            // Placeholder: In a real migration, we would use 'pg' pool here
            console.log('PostgreSQL detected (Structure Ready). Please install "pg" package.');
            // this.pool = new Pool({ ...config });
            throw new Error('PostgreSQL driver not installed. Please run "npm install pg".');
        } else if (this.dbType === 'mongodb') {
            console.log('MongoDB detected (Structure Ready). Please install "mongodb" package.');
            throw new Error('MongoDB driver not installed. Please run "npm install mongodb".');
        }
    }

    // Unified query method
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'sqlite') {
                this.connection.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            }
            // Add PostgreSQL/MongoDB logic here
        });
    }

    // Unified get single row method
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'sqlite') {
                this.connection.get(sql, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            }
        });
    }

    // Unified run/insert/update method
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'sqlite') {
                this.connection.run(sql, params, function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, changes: this.changes });
                });
            }
        });
    }

    // Unified get counts for dashboard stats
    async getCounts() {
        if (this.dbType === 'sqlite') {
            const teachers = await this.get("SELECT count(*) as c FROM teachers");
            const announces = await this.get("SELECT count(*) as c FROM parent_info");
            const pending = await this.get("SELECT count(*) as c FROM documents WHERE status = 'Bekliyor'");
            const totalDocs = await this.get("SELECT count(*) as c FROM documents");
            const approved = await this.get("SELECT count(*) as c FROM documents WHERE status = 'Onaylandı'");
            
            return {
                totalTeachers: teachers ? teachers.c : 0,
                totalAnnouncements: announces ? announces.c : 0,
                pendingDocuments: pending ? pending.c : 0,
                totalDocuments: totalDocs ? totalDocs.c : 0,
                approvedDocuments: approved ? approved.c : 0,
                totalStudents: 856 // mock or from students table if existed
            };
        }
    }

    // Database initialization (Table creation)
    async asyncQuery(sql) { return this.run(sql).catch(e => console.log('Notice:', e.message)); }

    async init() {
        const tables = [
            `CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT,
                type TEXT,
                name TEXT,
                recipients TEXT,
                date TEXT,
                status TEXT,
                content TEXT
            )`,
            // ... (other tables)
            `CREATE TABLE IF NOT EXISTS parent_info (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT,
                title TEXT,
                content TEXT,
                date TEXT,
                target_class TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT,
                username TEXT UNIQUE,
                password_hash TEXT,
                student_class TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT,
                student_id TEXT,
                student_name TEXT,
                status TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS teachers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                branch TEXT,
                phone TEXT,
                email TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS kvkk_consents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                role TEXT,
                ip TEXT,
                consented_at TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT,
                username TEXT,
                ip TEXT,
                detail TEXT,
                created_at TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS grades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id TEXT NOT NULL,
                student_name TEXT NOT NULL,
                subject TEXT NOT NULL,
                score REAL NOT NULL,
                term TEXT DEFAULT '1',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS permission_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                teacher_name TEXT NOT NULL,
                teacher_username TEXT NOT NULL,
                request_type TEXT NOT NULL,
                reason TEXT NOT NULL,
                start_date TEXT,
                end_date TEXT,
                status TEXT DEFAULT 'Bekliyor',
                reviewer_note TEXT DEFAULT '',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TEXT
            )`
        ];

        for (const sql of tables) {
            await this.run(sql);
        }
        console.log('Database tables initialized.');
    }
}

const dbInstance = new Database();
module.exports = dbInstance;
