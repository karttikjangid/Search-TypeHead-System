from contextlib import asynccontextmanager
from fastapi  import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import cache_debug, search, suggest
from data.loader import load_trie
import os
import threading
import time

BASE_DIR = os.path.dirname(__file__)
from db.store import init_db, get_all_counts, flush_counts
from state import app_state


def start_flush_thread(interval_seconds: int = 30):
    def flush_loop():
        while True:
            time.sleep(interval_seconds)
            if app_state.get("counts"):
                flush_counts(app_state["counts"])
                print(f"Flushed {len(app_state['counts'])} counts to DB")
    
    thread = threading.Thread(target=flush_loop, daemon=True)
    thread.start()


@asynccontextmanager
async def lifespan(app:FastAPI):
    #Runs once on startup
    init_db()
    app_state["trie"] = load_trie(os.path.join(BASE_DIR, "..", "data", "search_queries_dataset.csv"))
    app_state["counts"] = get_all_counts()
    print("Trie loaded..")
    yield
    flush_counts(app_state["counts"])  # final flush 
    app_state.clear()

app = FastAPI(lifespan=lifespan)


# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes will be registered here 
app.include_router(suggest.router)
app.include_router(search.router)
app.include_router(cache_debug.router)

