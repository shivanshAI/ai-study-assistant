import os
import uuid
from fastapi import APIRouter, UploadFile, File
from services.pdf_parser import extract_text_from_pdf
from services.chunker import split_text
from services.vector_store import store_chunks

router = APIRouter()

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    pdf_id = str(uuid.uuid4())[:8]
    file_path = f"{UPLOAD_DIR}/{pdf_id}.pdf"

    with open(file_path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(file_path)
    chunks = split_text(text)
    store_chunks(pdf_id, chunks)

    return {"pdf_id": pdf_id, "filename": file.filename, "chunks": len(chunks)}