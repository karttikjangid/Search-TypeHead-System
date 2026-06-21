import csv 
from data.trie import Trie

def load_trie(filepath:str) -> Trie:
    trie = Trie()
    with open(filepath , newline='', encoding ='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            query = row['query'].strip().lower()
            count = int(row['count'])
            trie.insert(query,count)
    return trie

