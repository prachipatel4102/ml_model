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
    AdvertisingBudget: float


@app.get("/")
def home():
    # Opening the Render URL now shows the website
    return FileResponse(BASE_DIR / "index.html")


@app.get("/health")
def test():
    return {"msg": "uvicorn is running"}


@app.post("/predict")
def datainsert(ds: datascience):
    sales = model.predict([[ds.AdvertisingBudget]])
    return {"predictedsales": round(float(sales[0][0]), 2)}