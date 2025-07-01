from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Prompt(BaseModel):
    text: str

@app.post("/generate")
def generate(prompt: Prompt):
    return {"response": f"Echo: {prompt.text}"}
