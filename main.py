#code -api
#fastapi- rest api ,uvicorn- server,basemodel- structure and validate,
# @ - annotation - set of instriction,"/"- routes

from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app=FastAPI()
model=joblib.load("linearmodel.pkl")

class datascience(BaseModel):
    StudyHours:float

@app.get("/")
def test():
    return{"msg":"uvicorn is running"}

@app.post("/predict")
def datainsert(ds:datascience):
    marks= model.predict([[ds.StudyHours]])
    return{"predictedmarks":round(float(marks[0]),2)}
