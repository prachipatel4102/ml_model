from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained logistic regression model
model = joblib.load("logisticmodel.pkl")

class datascience(BaseModel):
    StudyHours: float

@app.get("/")
def test():
    return {"msg": "uvicorn is running"}

@app.post("/predict")
def datainsert(ds: datascience):
    # Use DataFrame with feature name to avoid scikit-learn warnings
    features = pd.DataFrame([[ds.StudyHours]], columns=["StudyHours"])
    pred = model.predict(features)
    result = "Pass" if int(pred[0]) == 1 else "Fail"

    return {
        "StudyHours": ds.StudyHours,
        "result": result
    }
