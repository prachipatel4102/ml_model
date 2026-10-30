#code -api
#fastapi- rest api ,uvicorn- server,basemodel- structure and validate,
# @ - annotation - set of instriction,"/"- routes

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import joblib

app = FastAPI()

# Allow the frontend to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent
model = joblib.load(BASE_DIR / "linearmodel.pkl")


class datascience(BaseModel):
    StudyHours: float


@app.get("/")
def home():
    # Opening the site URL shows the website (index.html)
    return FileResponse(BASE_DIR / "index.html", headers={"Cache-Control": "no-cache"})


@app.get("/health")
def test():
    return {"msg": "uvicorn is running"}


@app.post("/predict")
def datainsert(ds: datascience):
    marks = model.predict([[ds.StudyHours]])
    return {"predictedmarks": round(float(marks[0]), 2)}