# File Path: apps/prediction-service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI(title="Rentverse Price Prediction API")

# --- CORS Configuration ---
origins_string = os.getenv("CORS_ALLOWED_ORIGINS")
if origins_string:
    origins = [origin.strip() for origin in origins_string.split(",")]
else:
    origins = []
    print(
        "Warning: CORS_ALLOWED_ORIGINS environment variable not found. CORS is disabled for non-listed origins."
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model Loading ---
MODEL_PATH = "property_price_model.joblib"
COLUMNS_PATH = "model_columns.joblib"
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
    area_sqft: float
    bedrooms: int
    bathrooms: int
    location: str
    listing_type: str
    property_type: str


class PredictionResponse(BaseModel):
    predicted_price_myr: float


# --- API Endpoint ---
@app.post("/predict", response_model=PredictionResponse)
async def predict_price(features: PropertyFeatures):
    if model is None or not model_columns:
        raise HTTPException(status_code=503, detail="Model is not loaded.")

    try:
        input_df = pd.DataFrame([features.dict()])
        input_encoded = pd.get_dummies(input_df)
        final_df = input_encoded.reindex(columns=model_columns, fill_value=0)

        log_prediction = model.predict(final_df)[0]
        prediction = np.expm1(log_prediction)

        return {"predicted_price_myr": round(prediction, 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing input: {e}")


@app.get("/")
def read_root():
    return {"message": "Welcome to the Rentverse Prediction Service API"}
