# cache/hash_ring.py
import hashlib

class CacheNode:
    def __init__(self, node_id: str):
        self.node_id = node_id
        self.store = {}  # prefix → suggestions

class HashRing:
    def __init__(self, nodes: list[str], virtual_nodes: int = 100):
        self.virtual_nodes = virtual_nodes
        self.ring = {}          # hash_point → CacheNode
        self.sorted_keys = []   # sorted list of hash points
        self.nodes = {}         # node_id → CacheNode

        for node_id in nodes:
            self._add_node(node_id)

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def _add_node(self, node_id: str):
        node = CacheNode(node_id)
        self.nodes[node_id] = node
        for i in range(self.virtual_nodes):
            point = self._hash(f"{node_id}:{i}")
            self.ring[point] = node
            self.sorted_keys.append(point)
        self.sorted_keys.sort()

    def get_node(self, key: str) -> CacheNode:
        if not self.ring:
            return None
        hash_val = self._hash(key)
        for point in self.sorted_keys:
            if hash_val <= point:
                return self.ring[point]
        # wrap around — return first node
        return self.ring[self.sorted_keys[0]]

    def get(self, prefix: str):
        node = self.get_node(prefix)
        return node.store.get(prefix)         # None if miss

    def set(self, prefix: str, suggestions: list):
        node = self.get_node(prefix)
        node.store[prefix] = suggestions

    def debug(self, prefix: str) -> dict:
        node = self.get_node(prefix)
        hit = prefix in node.store
        return {
            "prefix": prefix,
            "node": node.node_id,
            "hit": hit,
            "cached_suggestions": node.store.get(prefix, [])
        }