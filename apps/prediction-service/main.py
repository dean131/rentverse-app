# File Path: apps/prediction-service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np # Import numpy
import os

app = FastAPI(title="Rentverse Price Prediction API")

# --- Model Loading ---
MODEL_PATH = 'property_price_model.joblib'
COLUMNS_PATH = 'model_columns.joblib'
model = None
model_columns = []

@app.on_event("startup")
def load_model_and_columns():
    """Load the model and the training columns when the API starts."""
    global model, model_columns
    if os.path.exists(MODEL_PATH) and os.path.exists(COLUMNS_PATH):
        model = joblib.load(MODEL_PATH)
        model_columns = joblib.load(COLUMNS_PATH)
        print("Machine learning model and training columns loaded successfully.")
    else:
        print(f"Warning: Model or columns file not found.")

# --- API Request and Response Models ---
class PropertyFeatures(BaseModel):
    bedrooms: int
    bathrooms: int
    area_sqft: float
    location: str

class PredictionResponse(BaseModel):
    predicted_price_myr: float

# --- API Endpoint ---
@app.post("/predict", response_model=PredictionResponse)
async def predict_price(features: PropertyFeatures):
    if model is None or not model_columns:
        raise HTTPException(status_code=503, detail="Model is not loaded.")

    try:
        input_df = pd.DataFrame([features.dict()])
        input_dummies = pd.get_dummies(input_df['location'], prefix='loc', dtype=int)
        input_processed = pd.concat([input_df.drop(['location'], axis=1), input_dummies], axis=1)
        final_df = input_processed.reindex(columns=model_columns, fill_value=0)
        
        # --- NEW: Handle Log Transformation ---
        # 1. Predict the log-transformed price
        log_prediction = model.predict(final_df)[0]
        
        # 2. Convert the prediction back to the original price scale
        prediction = np.expm1(log_prediction)
        
        return {"predicted_price_myr": round(prediction, 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing input: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Rentverse Prediction Service API"}

