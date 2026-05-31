import chromadb
from sentence_transformers import SentenceTransformer

client = chromadb.PersistentClient(path="./.chroma")
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_collection(pdf_id: str):
    return client.get_or_create_collection(name=pdf_id)

def store_chunks(pdf_id: str, chunks: list[str]):
    collection = get_collection(pdf_id)
    embeddings = model.encode(chunks).tolist()
    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[f"{pdf_id}_chunk_{i}" for i in range(len(chunks))]
    )

def search_chunks(pdf_id: str, query: str, k: int = 4) -> list[str]:
    collection = get_collection(pdf_id)
    query_embedding = model.encode([query]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=k)
    return results["documents"][0]