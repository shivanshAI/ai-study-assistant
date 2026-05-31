import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.1-8b-instant"

def get_answer(question: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a study assistant. Answer questions using only the provided notes. If the answer is not in the notes, say so."},
            {"role": "user", "content": f"Context from notes:\n{context}\n\nQuestion: {question}"}
        ]
    )
    return response.choices[0].message.content

def get_summary(context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a study assistant. Summarize the provided notes clearly and concisely."},
            {"role": "user", "content": f"Summarize these notes:\n{context}"}
        ]
    )
    return response.choices[0].message.content

def get_quiz(context_chunks: list[str], num_questions: int) -> list[dict]:
    context = "\n\n".join(context_chunks)
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a study assistant. Generate MCQ quiz questions from the notes. Respond only in JSON format as a list of objects with keys: question, options (list of 4), answer."},
            {"role": "user", "content": f"Generate {num_questions} MCQ questions from these notes:\n{context}"}
        ]
    )
    text = response.choices[0].message.content
    text = re.sub(r"```json|```", "", text).strip()
    return json.loads(text)

def get_flashcards(context_chunks: list[str], num_cards: int) -> list[dict]:
    context = "\n\n".join(context_chunks)
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a study assistant. Generate flashcards from the notes. Respond only in JSON format as a list of objects with keys: front, back."},
            {"role": "user", "content": f"Generate {num_cards} flashcards from these notes:\n{context}"}
        ]
    )
    text = response.choices[0].message.content
    text = re.sub(r"```json|```", "", text).strip()
    return json.loads(text)