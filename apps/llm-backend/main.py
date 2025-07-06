from fastapi import FastAPI


app = FastAPI()

@app.get("/")
def root():
    return {"response": "helo from python server using fastapi"}
