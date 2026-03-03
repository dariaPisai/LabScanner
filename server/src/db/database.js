const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'labscanner.db');

let db;

function getDb() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        createTables();
    }
    return db;
}

function createTables() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lab_results (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      source TEXT,
      date TEXT NOT NULL,
      flag_count INTEGER DEFAULT 0,
      total_tests INTEGER DEFAULT 0,
      overall_status TEXT DEFAULT 'normal',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lab_values (
      id TEXT PRIMARY KEY,
      result_id TEXT NOT NULL,
      name TEXT NOT NULL,
      value TEXT NOT NULL,
      unit TEXT NOT NULL,
      ref_range TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'normal',
      FOREIGN KEY (result_id) REFERENCES lab_results(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS risk_scores (
      id TEXT PRIMARY KEY,
      result_id TEXT NOT NULL,
      disease TEXT NOT NULL,
      risk REAL NOT NULL,
      level TEXT NOT NULL,
      FOREIGN KEY (result_id) REFERENCES lab_results(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recommendations (
      id TEXT PRIMARY KEY,
      result_id TEXT NOT NULL,
      type TEXT NOT NULL,
      icon TEXT,
      specialty TEXT,
      title TEXT,
      reason TEXT,
      description TEXT,
      urgency TEXT,
      FOREIGN KEY (result_id) REFERENCES lab_results(id) ON DELETE CASCADE
    );
  `);
}

module.exports = { getDb };
