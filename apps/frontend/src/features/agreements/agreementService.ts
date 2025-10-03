// File Path: apps/frontend/src/services/agreementService.ts
import apiClient from "@/lib/apiClient";
import {
  BookingRequest,
  TenancyAgreement,
  AgreementDetails,
} from "@/lib/definitions";

/**
 * Submits a new booking request for a property.
 */
export const createAgreement = async (
  data: BookingRequest
): Promise<TenancyAgreement> => {
  const response = await apiClient.post("/agreements", data);
  return response.data.data;
};

/**
 * Fetches all agreements for the currently logged-in user.
 */
export const getMyAgreements = async (): Promise<AgreementDetails[]> => {
  const response = await apiClient.get("/agreements/my-agreements");
  return response.data.data;
};

/**
 * Sends a request for a property owner to approve an agreement.
 */
export const approveAgreement = async (
  agreementId: number
): Promise<TenancyAgreement> => {
  const response = await apiClient.patch(`/agreements/${agreementId}/approve`);
  return response.data.data;
};

/**
 * Fetches a unique, one-time URL for a user to sign an agreement.
 */
export const getSigningUrl = async (agreementId: number): Promise<string> => {
  const response = await apiClient.get(
    `/agreements/${agreementId}/signing-url`
  );
  return response.data.data.url;
};

export const downloadAgreementPdf = async (
  agreementId: number
): Promise<Blob> => {
  const response = await apiClient.get(`/agreements/${agreementId}/download`, {
    responseType: "blob",
  });
  return response.data;
};
