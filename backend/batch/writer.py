import threading
from db.store import flush_counts


class BatchWriter:
    BUFFER_LIMIT = 100

    def __init__(self):
        self.buffer = {}
        self.write_count = 0
        self.total_saved = 0
        self.lock = threading.Lock()

    def add(self, query: str):
        with self.lock:
            self.buffer[query] = self.buffer.get(query, 0) + 1
            self.write_count += 1
            if self.write_count >= self.BUFFER_LIMIT:
                self._flush_locked()

    def flush(self):
        with self.lock:
            self._flush_locked()

    def _flush_locked(self):
        if not self.buffer:
            return
        writes_saved = sum(self.buffer.values()) - len(self.buffer)
        self.total_saved += writes_saved
        flush_counts(self.buffer)
        self.buffer = {}
        self.write_count = 0

    def get_stats(self):
        with self.lock:
            return {
                "buffer_size": len(self.buffer),
                "write_count": self.write_count,
                "total_writes_saved": self.total_saved,
            }
