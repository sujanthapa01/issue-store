from fastapi import FastAPI


app = FastAPI()

@app.post("/")
def root():
    return {"response": "helo from python server using fastapi"}
