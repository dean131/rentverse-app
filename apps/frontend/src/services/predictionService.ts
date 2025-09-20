// File Path: apps/frontend/src/services/predictionService.ts
import axios from "axios";
import { PredictionFeatures } from "@/lib/definitions";

// Create a new Axios instance specifically for the prediction service,
// as it runs on a different port than our core backend.
const predictionApiClient = axios.create({
  baseURL: "http://localhost:8000", // The default port for our FastAPI app
});

/**
 * Calls the Python prediction service to get a suggested rental price.
 * @param {PredictionFeatures} features The property features (bedrooms, bathrooms, etc.).
 * @returns {Promise<number>} A promise that resolves to the predicted price.
 */
export const getPricePrediction = async (
  features: PredictionFeatures
): Promise<number> => {
  try {
    const response = await predictionApiClient.post("/predict", features);
    return response.data.predicted_price_myr;
  } catch (error) {
    console.error("Error fetching price prediction:", error);
    // In a real app, you might want to handle this more gracefully
    // and not show a suggestion if the service is down.
    throw new Error("Could not fetch price suggestion.");
  }
};
