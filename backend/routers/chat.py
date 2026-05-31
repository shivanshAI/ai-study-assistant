from fastapi import APIRouter
from models.schemas import QuestionRequest
from services.vector_store import search_chunks
from services.llm import get_answer

router = APIRouter()

@router.post("/chat")
def ask_question(request: QuestionRequest):
    chunks = search_chunks(request.pdf_id, request.question)
    answer = get_answer(request.question, chunks)
    return {"answer": answer, "sources": chunks}