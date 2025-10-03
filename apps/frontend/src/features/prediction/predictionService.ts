// File Path: frontend/src/features/prediction/predictionService.ts

import axios from "axios";
import { PredictionFeatures } from "@/lib/definitions";

const predictionApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PREDICT_URL || "http://127.0.0.1:8000",
});

interface PredictionResponse {
  price: number;
  confidence: number;
}

/**
 * Calls the Python prediction service to get a suggested property price and confidence score.
 * @param {PredictionFeatures} features The property features for the prediction.
 * @returns {Promise<PredictionResponse>} A promise that resolves to an object with the predicted price and confidence score.
 */
export const getPricePrediction = async (
  features: PredictionFeatures
): Promise<PredictionResponse> => {
  try {
    const response = await predictionApiClient.post("/predict", features);

    const confidence = response.data.confidence_score;

    // Check if confidence_score is a valid number, otherwise provide a default.
    const sanitizedConfidence =
      typeof confidence === "number" && !isNaN(confidence) ? confidence : 0.75; // Default to 0.75 (75%) if missing or invalid

    return {
      price: response.data.predicted_price_myr,
      confidence: sanitizedConfidence,
    };
  } catch (error) {
    console.error("Error fetching price prediction:", error);
    throw new Error("Could not fetch price suggestion at this time.");
  }
};
