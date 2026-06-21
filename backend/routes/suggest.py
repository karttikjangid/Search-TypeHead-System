from fastapi import APIRouter
from state import app_state

router = APIRouter()

@router.get("/suggest")
def suggest(q: str = ""):
    if len(q) == 0:
        return {"suggestions": []}

    cache = app_state["cache"]

    cached = cache.get(q)
    if cached is not None:
        return {"suggestions": cached}

    top_10 = app_state["trie"].search(q.lower())
    suggestions = [{"query": query, "count": count} for query, count in top_10]
    cache.set(q, suggestions)
    return {"suggestions": suggestions}
