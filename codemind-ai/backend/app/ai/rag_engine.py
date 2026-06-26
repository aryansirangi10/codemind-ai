import re
import math
import requests
from typing import List, Dict, Any, Tuple
from app.core.config import settings

# Built-in Coding Guidelines and Standards Database for RAG
CODING_STANDARDS = [
    {
        "id": "owasp_sql_injection",
        "title": "OWASP: SQL Injection Prevention",
        "guideline": "Always use parameterized queries or prepared statements instead of directly concatenating user input into SQL query strings. Never execute raw format strings."
    },
    {
        "id": "owasp_xss",
        "title": "OWASP: Cross-Site Scripting (XSS) Prevention",
        "guideline": "Sanitize and encode all untrusted user data before rendering it in the HTML DOM. Use framework-provided templating systems that perform auto-escaping."
    },
    {
        "id": "pep8_naming",
        "title": "PEP 8: Naming Conventions",
        "guideline": "In Python, functions and variable names should follow snake_case. Classes should use CamelCase (PascalCase). Constants should use ALL_CAPS."
    },
    {
        "id": "clean_code_functions",
        "title": "Clean Code: Functions",
        "guideline": "Functions should do one thing, do it well, and do it only. Keep functions short (typically under 30-50 lines) and minimize function arguments (ideally 2 or fewer)."
    },
    {
        "id": "security_secrets",
        "title": "Credential and Secret Security",
        "guideline": "Never hardcode passwords, API keys, certificates, or secret tokens in source code. Load them dynamically from environment variables or a secure vault configuration."
    },
    {
        "id": "pep8_imports",
        "title": "PEP 8: Imports Structure",
        "guideline": "Imports should be grouped in the following order: standard library imports, related third-party imports, and local application-specific imports. Avoid wildcard imports (from module import *)."
    }
]

# Simple Local Vector Store Fallback (Bag of Words + TF-IDF)
def tokenize(text: str) -> List[str]:
    # Extract alphanumeric words and lowercase them
    return re.findall(r'\w+', text.lower())

class SimpleVectorStore:
    def __init__(self):
        self.documents = []  # List of dicts with text and metadata
        self.vocabulary = {}
        self.doc_vectors = []

    def fit_and_index(self, docs: List[Dict[str, Any]]):
        self.documents = docs
        self.vocabulary = {}
        self.doc_vectors = []
        
        # Build vocabulary
        all_tokens_list = []
        for doc in docs:
            tokens = tokenize(doc.get("text", ""))
            all_tokens_list.append(tokens)
            for token in tokens:
                if token not in self.vocabulary:
                    self.vocabulary[token] = len(self.vocabulary)
        
        # Build vector representations (Term Frequency)
        vocab_size = len(self.vocabulary)
        if vocab_size == 0:
            return
            
        for tokens in all_tokens_list:
            vector = [0.0] * vocab_size
            for token in tokens:
                vector[self.vocabulary[token]] += 1.0
            # Normalize vector
            norm = math.sqrt(sum(x*x for x in vector))
            if norm > 0:
                vector = [x / norm for x in vector]
            self.doc_vectors.append(vector)

    def query(self, query_text: str, top_k: int = 3) -> List[Tuple[Dict[str, Any], float]]:
        if not self.doc_vectors or not self.vocabulary:
            return []
            
        query_tokens = tokenize(query_text)
        vocab_size = len(self.vocabulary)
        
        # Build query vector
        query_vector = [0.0] * vocab_size
        for token in query_tokens:
            if token in self.vocabulary:
                query_vector[self.vocabulary[token]] += 1.0
                
        # Normalize query vector
        q_norm = math.sqrt(sum(x*x for x in query_vector))
        if q_norm == 0:
            # Fallback: return top documents
            return [(self.documents[i], 0.0) for i in range(min(top_k, len(self.documents)))]
            
        query_vector = [x / q_norm for x in query_vector]
        
        # Compute Cosine Similarities
        scores = []
        for idx, doc_vector in enumerate(self.doc_vectors):
            dot_product = sum(query_vector[i] * doc_vector[i] for i in range(vocab_size))
            scores.append((self.documents[idx], dot_product))
            
        # Sort and return top_k
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]

# Global instance for coding standards
standards_store = SimpleVectorStore()
standards_store.fit_and_index([
    {"text": f"{std['title']} {std['guideline']}", "metadata": std}
    for std in CODING_STANDARDS
])

def retrieve_relevant_standards(query_text: str, limit: int = 2) -> List[Dict[str, Any]]:
    """
    Retrieves the most relevant coding standards based on the input query text.
    """
    results = standards_store.query(query_text, top_k=limit)
    return [r[0]["metadata"] for r in results]

# Repository Indexer class for chat
class RepositoryIndexer:
    def __init__(self):
        self.store = SimpleVectorStore()
        
    def chunk_code(self, file_path: str, code_content: str, chunk_size: int = 500) -> List[Dict[str, Any]]:
        chunks = []
        lines = code_content.splitlines()
        
        # Simple line-based chunking
        # We group lines together
        current_chunk = []
        current_length = 0
        start_line = 1
        
        for idx, line in enumerate(lines):
            current_chunk.append(line)
            current_length += len(line)
            
            if current_length >= chunk_size or idx == len(lines) - 1:
                chunk_text = "\n".join(current_chunk)
                chunks.append({
                    "text": chunk_text,
                    "metadata": {
                        "file_path": file_path,
                        "start_line": start_line,
                        "end_line": idx + 1
                    }
                })
                current_chunk = []
                current_length = 0
                start_line = idx + 2
                
        return chunks

    def index_repository(self, files: Dict[str, str]):
        """
        files: Dictionary of file_path -> file_content
        """
        all_chunks = []
        for path, content in files.items():
            # Skip binary / git / asset files
            if any(path.endswith(ext) for ext in [".png", ".jpg", ".zip", ".ico", ".pdf", ".exe", ".bin"]):
                continue
            chunks = self.chunk_code(path, content)
            all_chunks.extend(chunks)
            
        self.store.fit_and_index(all_chunks)

    def search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        results = self.store.query(query, top_k=top_k)
        return [r[0] for r in results]

# Global Repository index cache for active projects
# Key: project_id (int) -> Value: RepositoryIndexer
repo_index_cache: Dict[int, RepositoryIndexer] = {}

def get_repo_indexer(project_id: int) -> RepositoryIndexer:
    if project_id not in repo_index_cache:
        repo_index_cache[project_id] = RepositoryIndexer()
    return repo_index_cache[project_id]
