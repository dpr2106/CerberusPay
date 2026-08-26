import sqlite3
import os
import json
import uuid
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cerberus_database.sqlite3")

def hash_password(password: str) -> str:
    salt = uuid.uuid4().hex
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt), 100000)
    return f"{salt}${key.hex()}"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. INTERNAL FRAUD OPERATORS / ANALYSTS TABLE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS operators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        operator_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'analyst',
        created_at TEXT NOT NULL
    )
    """)

    # 2. CUSTOMER PROFILES REPOSITORY (Used strictly for risk evaluation, user_id lookups & customer security emails)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        account_age_days INTEGER DEFAULT 180,
        status TEXT DEFAULT 'ACTIVE',
        created_at TEXT NOT NULL
    )
    """)

    # Seed Default Internal Lead Analyst if not exists
    cursor.execute("SELECT id FROM operators WHERE email = 'prashanthraodugyala34@gmail.com'")
    if not cursor.fetchone():
        analyst_pass_hash = hash_password("operator123")
        cursor.execute("""
        INSERT INTO operators (operator_id, name, email, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """, ('OPR_PRASHANTH_01', 'Prashanth Rao Dugyala', 'prashanthraodugyala34@gmail.com', analyst_pass_hash, 'lead_analyst', datetime.now().isoformat()))

    # Seed Standard Customer Records (Used for live transaction evaluations & customer alerts)
    seed_customers = [
        ("USR_8921", "Alex Mercer", "alex.mercer@example.com", 280),
        ("USR_1049", "Sarah Jenkins", "sarah.j@example.com", 450),
        ("USR_3410", "Vikram Patel", "vikram.patel@example.com", 95),
        ("USR_5192", "Elena Rostova", "elena.r@example.com", 320),
        ("USR_7820", "Marcus Vance", "marcus.v@example.com", 15),
        ("USR_9941", "Ananya Sharma", "ananya.s@example.com", 600)
    ]

    for uid, name, email, age in seed_customers:
        cursor.execute("SELECT id FROM customers WHERE user_id = ?", (uid,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO customers (user_id, name, email, account_age_days, status, created_at)
            VALUES (?, ?, ?, ?, 'ACTIVE', ?)
            """, (uid, name, email, age, (datetime.now() - timedelta(days=age)).isoformat()))

    conn.commit()
    conn.close()

# Operator Authentication helpers
def get_operator_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM operators WHERE LOWER(email) = LOWER(?)", (email.strip(),))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_operator_by_id(operator_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM operators WHERE operator_id = ?", (operator_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

# Customer repository helpers (Transaction user_id resolution)
def get_customer_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_customers() -> List[Dict[str, Any]]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def upsert_customer(user_id: str, name: str, email: str, account_age_days: int = 180) -> Dict[str, Any]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM customers WHERE user_id = ?", (user_id,))
    existing = cursor.fetchone()
    now = datetime.now().isoformat()
    if existing:
        cursor.execute("UPDATE customers SET name = ?, email = ? WHERE user_id = ?", (name, email.strip().lower(), user_id))
    else:
        cursor.execute("""
        INSERT INTO customers (user_id, name, email, account_age_days, status, created_at)
        VALUES (?, ?, ?, ?, 'ACTIVE', ?)
        """, (user_id, name, email.strip().lower(), account_age_days, now))
    conn.commit()
    conn.close()
    return {"user_id": user_id, "name": name, "email": email.strip().lower()}
