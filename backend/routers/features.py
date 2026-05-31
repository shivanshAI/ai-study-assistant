from fastapi import APIRouter
from models.schemas import SummaryRequest, QuizRequest, FlashcardRequest
from services.vector_store import search_chunks
from services.llm import get_summary, get_quiz, get_flashcards

router = APIRouter()

@router.post("/summary")
def summarize(request: SummaryRequest):
    chunks = search_chunks(request.pdf_id, "main topics and key concepts", k=10)
    summary = get_summary(chunks)
    return {"summary": summary}

@router.post("/quiz")
def generate_quiz(request: QuizRequest):
    chunks = search_chunks(request.pdf_id, "key concepts and definitions", k=10)
    quiz = get_quiz(chunks, request.num_questions)
    return {"quiz": quiz}

@router.post("/flashcards")
def generate_flashcards(request: FlashcardRequest):
    chunks = search_chunks(request.pdf_id, "key concepts and definitions", k=10)
    flashcards = get_flashcards(chunks, request.num_cards)
    return {"flashcards": flashcards}