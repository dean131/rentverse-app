// File Path: apps/frontend/src/services/uploadService.ts
import apiClient from "@/lib/apiClient";
import axios from "axios";

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

export const getPresignedUrl = async (
  contentType: string
): Promise<PresignedUrlResponse> => {
  const response = await apiClient.post("/uploads/presigned-url", {
    contentType,
  });
  return response.data.data;
};

export const uploadFileToBucket = async (
  uploadUrl: string,
  file: File
): Promise<void> => {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
};
