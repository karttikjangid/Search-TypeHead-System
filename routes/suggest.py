from fastapi import APIRouter, Request
from state import app_state

router = APIRouter()

@router.get("/suggest")
def suggest(q: str = ""):
    trie = app_state["trie"]
    
    # TODO: use trie.search() to get suggestions for prefix q
    # return {"suggestions": ...} 
    # each suggestion should have "query" and "count" keys
    if len(q) == 0 :
        return {"suggestions" : []}
    top_10_suggestions = trie.search(q.lower())
    suggestions = [{"query" : query , "count":count} for query ,count in top_10_suggestions]
    return {"suggestions" : suggestions}
    