from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import cache_debug, search, suggest, trending, batch_stats
from data.loader import load_trie
import os
from cache.hash_ring import HashRing
BASE_DIR = os.path.dirname(__file__)
from db.store import init_db
from state import app_state
from batch.writer import BatchWriter


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    app_state["trie"] = load_trie(os.path.join(BASE_DIR, "..", "data", "search_queries_dataset.csv"))
    app_state["cache"] = HashRing(nodes=["node1", "node2", "node3"])
    app_state["batch"] = BatchWriter()
    app_state["trending"] = {}
    print("Trie loaded..")
    yield
    app_state["batch"].flush()
    app_state.clear()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(suggest.router)
app.include_router(search.router)
app.include_router(cache_debug.router)
app.include_router(trending.router)
app.include_router(batch_stats.router)
