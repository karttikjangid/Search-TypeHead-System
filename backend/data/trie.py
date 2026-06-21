class TrieNode:
    def __init__(self):
        self.children = {}
        self.suggestions = []  # top 10 (query, count) sorted by count, maintained at every node

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, query: str, count: int):
        node = self.root
        for char in query:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            # Keep only top 10, sorted descending by count
            node.suggestions.append((query , count))
            node.suggestions.sort(key = lambda x: x[1] , reverse= True)
            node.suggestions = node.suggestions[:10]
            

    def search(self, prefix: str) -> list:
        node = self.root
        for char in prefix:
            # TODO 2: If char not in children, return []
            if char not in node.children:
                return []
            node = node.children[char]

        # TODO 3: Return the suggestions at this node 
        return node.suggestions