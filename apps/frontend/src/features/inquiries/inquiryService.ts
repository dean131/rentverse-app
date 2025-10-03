// Create a new file at: frontend/src/features/inquiries/inquiryService.ts

import apiClient from "@/lib/apiClient";

interface InquiryPayload {
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyId: number;
}

export const submitInquiry = async (payload: InquiryPayload): Promise<void> => {
  await apiClient.post("/inquiries", payload);
};
