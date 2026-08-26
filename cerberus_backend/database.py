import sqlite3
import os
import json
from datetime import datetime
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cerberus_database.sqlite3")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Users table with verification status & OTP code
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        is_verified BOOLEAN DEFAULT 0,
        verification_code TEXT,
        verification_expires_at TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # Seed Chief Risk Officer if not exists
    cursor.execute("SELECT id FROM users WHERE email = 'security.operator@cerberuspay.internal'")
    if not cursor.fetchone():
        import hashlib, uuid
        salt = uuid.uuid4().hex
        key = hashlib.pbkdf2_hmac("sha256", "operator123".encode("utf-8"), bytes.fromhex(salt), 100000)
        opr_hash = f"{salt}${key.hex()}"
        cursor.execute("""
        INSERT INTO users (user_id, name, email, password_hash, role, is_verified, created_at)
        VALUES (?, ?, ?, ?, ?, 1, ?)
        """, ('OPR_CHIEF_ANALYST', 'Chief Risk Officer', 'security.operator@cerberuspay.internal', opr_hash, 'analyst', datetime.now().isoformat()))

    conn.commit()
    conn.close()

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def create_user(user_id: str, name: str, email: str, password_hash: str, verification_code: str, expires_at: str, role: str = 'customer') -> Dict[str, Any]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO users (user_id, name, email, password_hash, role, is_verified, verification_code, verification_expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
    """, (user_id, name, email.strip().lower(), password_hash, role, verification_code, expires_at, now))
    conn.commit()
    conn.close()
    return {
        "user_id": user_id,
        "name": name,
        "email": email.strip().lower(),
        "role": role,
        "is_verified": False,
        "created_at": now
    }

def update_user_verification(email: str, code: str) -> bool:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users 
    SET is_verified = 1, verification_code = NULL, verification_expires_at = NULL 
    WHERE LOWER(email) = LOWER(?) AND verification_code = ?
    """, (email.strip(), code.strip()))
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def update_verification_code(email: str, code: str, expires_at: str) -> bool:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE users 
    SET verification_code = ?, verification_expires_at = ? 
    WHERE LOWER(email) = LOWER(?)
    """, (code, expires_at, email.strip()))
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success
