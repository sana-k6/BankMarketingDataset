from fastapi import FastAPI
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = joblib.load("bank_logistic_model.pkl")


@app.get("/")
def home():
    return {
        "message": "Bank Marketing Prediction API"
    }


@app.post("/predict")
def predict(customer: dict):

    df = pd.DataFrame([customer]).replace("unknown", np.nan)

    prediction = model.predict(df)[0]

    probability = model.predict_proba(df)[0][1]

    if prediction == 1:
        result = "Customer likely to subscribe"
    else:
        result = "Customer unlikely to subscribe"


    return {
        "prediction": int(prediction),
        "probability": float(probability),
        "result": result
    }