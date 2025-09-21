import { Request, Response } from "express";
import { getPresignedUploadUrl } from "../../services/minio.service.js";
import { ApiResponse } from "../../utils/response.helper.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const generatePresignedUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { fileName } = req.body;

    if (!fileName) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "File name is required."));
    }

    const objectName = `uploads/${Date.now()}-${fileName}`;
    const url = await getPresignedUploadUrl(objectName);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { presignedUrl: url, fileName: objectName },
          "Presigned URL generated successfully."
        )
      );
  }
);
