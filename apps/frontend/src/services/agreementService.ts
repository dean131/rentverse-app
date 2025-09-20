// File Path: apps/frontend/src/services/agreementService.ts
import apiClient from "@/lib/apiClient";
import { BookingRequest, TenancyAgreement } from "@/lib/definitions"; // Import the new type

/**
 * Submits a new booking request for a property.
 * @param {BookingRequest} data The booking details (propertyId, dates).
 * @returns {Promise<TenancyAgreement>} A promise that resolves with the created agreement data.
 */
// CORRECTED: Replaced 'any' with the specific 'TenancyAgreement' type
export const createAgreement = async (
  data: BookingRequest
): Promise<TenancyAgreement> => {
  const response = await apiClient.post("/agreements", data);
  return response.data.data;
};
