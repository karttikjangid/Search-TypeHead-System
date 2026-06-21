import os
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "search_queries_dataset.db")

def get_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS queries (
            query TEXT PRIMARY KEY,
            count INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

def upsert_count(query:str , count :int):
    conn = get_connection()
    conn.execute("""
        INSERT INTO queries (query, count)
        VALUES (?, ?)
        ON CONFLICT(query) DO UPDATE SET count = count + ?
    """, (query, count, count))
    conn.commit()
    conn.close()

def get_all_counts() -> dict:
    conn = get_connection()
    rows = conn.execute("SELECT query, count FROM queries").fetchall()
    conn.close()
    return {row[0]: row[1] for row in rows}


def flush_counts(counts: dict):
    conn = get_connection()
    for query, count in counts.items():
        conn.execute("""
            INSERT INTO queries (query, count)
            VALUES (?, ?)
            ON CONFLICT(query) DO UPDATE SET count = count + ?
        """, (query, count, count))
    conn.commit()
    conn.close()

