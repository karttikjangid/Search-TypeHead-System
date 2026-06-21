import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient
from main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_suggest_returns_suggestions(client):
    r = client.get("/suggest?q=ap")
    assert r.status_code == 200
    data = r.json()
    assert "suggestions" in data
    assert len(data["suggestions"]) <= 10
    for item in data["suggestions"]:
        assert "query" in item
        assert "count" in item


def test_suggest_empty_prefix(client):
    r = client.get("/suggest?q=")
    assert r.status_code == 200
    assert r.json()["suggestions"] == []


def test_search_returns_searched(client):
    r = client.post("/search", json={"query": "apple"})
    assert r.status_code == 200
    assert r.json() == {"message": "Searched"}


def test_suggest_cache_hit(client):
    client.get("/suggest?q=ap")
    client.get("/suggest?q=ap")
    r = client.get("/cache/debug?prefix=ap")
    assert r.status_code == 200
    assert r.json()["hit"] is True


def test_cache_debug_keys(client):
    client.get("/suggest?q=ap")
    r = client.get("/cache/debug?prefix=ap")
    assert r.status_code == 200
    data = r.json()
    for key in ("prefix", "node", "hit", "cached_suggestions"):
        assert key in data


def test_trending_returns_list(client):
    r = client.get("/trending")
    assert r.status_code == 200
    data = r.json()
    assert "trending" in data
    assert isinstance(data["trending"], list)


def test_trending_includes_searched_query(client):
    for _ in range(5):
        client.post("/search", json={"query": "iphone16test"})
    r = client.get("/trending")
    queries = [item["query"] for item in r.json()["trending"]]
    assert "iphone16test" in queries


def test_batch_stats_keys(client):
    r = client.get("/batch/stats")
    assert r.status_code == 200
    data = r.json()
    for key in ("buffer_size", "write_count", "total_writes_saved"):
        assert key in data


def test_batch_stats_writes_saved_after_100_searches(client):
    for i in range(100):
        client.post("/search", json={"query": f"uniquequery{i:04d}"})
    r = client.get("/batch/stats")
    assert r.json()["total_writes_saved"] > 0
