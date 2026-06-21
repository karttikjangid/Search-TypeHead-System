"""
Standalone performance report. Requires the backend to be running on port 8000.
Run: python report.py
"""

import json
import random
import string
import time
import urllib.request
import urllib.error

BASE = "http://localhost:8000"


def get(path):
    with urllib.request.urlopen(BASE + path, timeout=10) as r:
        return json.loads(r.read())


def post(path, body):
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        BASE + path,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())


def measure_p95_latency(n=200):
    letters = string.ascii_lowercase
    times = []
    for _ in range(n):
        prefix = random.choice(letters) + random.choice(letters)
        t0 = time.perf_counter()
        try:
            get(f"/suggest?q={prefix}")
        except Exception:
            pass
        times.append((time.perf_counter() - t0) * 1000)
    times.sort()
    return times[int(0.95 * len(times))]


def measure_cache_hit_rate(prefix="ap", repetitions=10):
    for _ in range(repetitions):
        get(f"/suggest?q={prefix}")
    hits = 0
    for _ in range(repetitions):
        data = get(f"/cache/debug?prefix={prefix}")
        if data.get("hit"):
            hits += 1
    return hits / repetitions


def measure_batch_reduction():
    stats = get("/batch/stats")
    saved = stats.get("total_writes_saved", 0)
    write_count = stats.get("write_count", 0)
    total = saved + write_count
    if total == 0:
        for i in range(120):
            post("/search", {"query": f"reportquery{i:04d}"})
        stats = get("/batch/stats")
        saved = stats.get("total_writes_saved", 0)
        write_count = stats.get("write_count", 0)
        total = saved + write_count
    reduction = (saved / total * 100) if total else 0
    return saved, total, reduction


def build_report(p95_ms, hit_rate, saves, total, reduction):
    lines = [
        "┌─────────────────────────────────────┐",
        "│        PERFORMANCE REPORT           │",
        "├─────────────────────────────────────┤",
        f"│ p95 latency (suggest): {p95_ms:>6.1f}ms     │",
        f"│ Cache hit rate:        {hit_rate * 100:>6.1f}%       │",
        f"│ Writes saved:          {reduction:>6.1f}%       │",
        f"│   ({saves} saved out of {total} total)       │",
        "└─────────────────────────────────────┘",
    ]
    return "\n".join(lines)


def main():
    print("Running performance measurements…")

    print("  [1/3] Measuring p95 suggest latency (200 requests)…")
    p95 = measure_p95_latency()

    print("  [2/3] Measuring cache hit rate…")
    hit_rate = measure_cache_hit_rate()

    print("  [3/3] Reading batch write stats…")
    saves, total, reduction = measure_batch_reduction()

    report = build_report(p95, hit_rate, saves, total, reduction)
    print("\n" + report)

    out_path = "performance_report.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(report + "\n")
    print(f"\nSaved to {out_path}")


if __name__ == "__main__":
    main()
