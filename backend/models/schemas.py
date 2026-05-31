from pydantic import BaseModel

class QuestionRequest(BaseModel):
    question: str
    pdf_id: str

class SummaryRequest(BaseModel):
    pdf_id: str

class QuizRequest(BaseModel):
    pdf_id: str
    num_questions: int = 5

class FlashcardRequest(BaseModel):
    pdf_id: str
    num_cards: int = 10