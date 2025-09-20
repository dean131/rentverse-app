// File Path: apps/frontend/src/services/predictionService.ts
import axios from "axios";
import { PredictionFeatures } from "@/lib/definitions";

// We create a new Axios instance for this service because it communicates
// with our Python API on a different port (8000) than our main backend (8080).
const predictionApiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

/**
 * Calls the Python prediction service to get a suggested property price.
 * @param {PredictionFeatures} features The property features for the prediction.
 * @returns {Promise<number>} A promise that resolves to the predicted price in MYR.
 */
export const getPricePrediction = async (
  features: PredictionFeatures
): Promise<number> => {
  try {
    const response = await predictionApiClient.post("/predict", features);
    return response.data.predicted_price_myr;
  } catch (error) {
    console.error("Error fetching price prediction:", error);
    // Gracefully handle cases where the prediction service might be down.
    throw new Error("Could not fetch price suggestion at this time.");
  }
};
