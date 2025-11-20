import { UTApi } from "uploadthing/server";

/**
 * UploadThing Service
 *
 * Centralized service for all UploadThing operations.
 * Provides utility functions, file operations, and standardized error handling.
 */

// Singleton UTApi instance
const utapi = new UTApi();

/**
 * Extract file key from UploadThing URL
 * URL format: https://utfs.io/f/{fileKey}
 *
 * @param url - The full UploadThing URL
 * @returns The file key or null if invalid
 */
export function extractFileKey(url: string): string | null {
  try {
    const urlParts = url.split("/f/");
    if (urlParts.length > 1) {
      return urlParts[1];
    }
    return null;
  } catch (error) {
    console.error("[UPLOADTHING_UTILITY_ERROR]", "Failed to extract file key", error);
    return null;
  }
}

/**
 * Validate file type
 *
 * @param file - The File object to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns true if valid, throws error if invalid
 */
export function validateFileType(file: File, allowedTypes: string[]): void {
  if (!file) {
    throw new Error("No file provided");
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
    );
  }
}

/**
 * Validate file size
 *
 * @param file - The File object to validate
 * @param maxSizeInMB - Maximum size in megabytes
 * @returns true if valid, throws error if invalid
 */
export function validateFileSize(file: File, maxSizeInMB: number): void {
  if (!file) {
    throw new Error("No file provided");
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error(
      `File size exceeds maximum allowed size of ${maxSizeInMB}MB`
    );
  }
}

/**
 * Upload file to UploadThing
 *
 * @param file - The file to upload
 * @param options - Upload options
 * @returns Upload result with URL and metadata
 */
export async function uploadFile(
  file: File,
  options: {
    allowedTypes?: string[];
    maxSizeInMB?: number;
    filename?: string;
  } = {}
) {
  const {
    allowedTypes = ["application/pdf"],
    maxSizeInMB = 2,
    filename,
  } = options;

  try {
    // Validate file
    validateFileType(file, allowedTypes);
    validateFileSize(file, maxSizeInMB);

    // Prepare file with custom filename if provided
    const fileToUpload = filename
      ? new File([file], filename, { type: file.type })
      : file;

    // Upload to UploadThing
    const uploadResult = await utapi.uploadFiles([fileToUpload]);
    const uploadedFile = uploadResult[0];

    // Validate upload result
    if (!uploadedFile || !uploadedFile.data) {
      console.error("[UPLOADTHING_UPLOAD_ERROR]", "Upload failed", uploadResult);
      throw new Error("Failed to upload file to storage");
    }

    return {
      success: true,
      data: {
        url: uploadedFile.data.url || uploadedFile.data.ufsUrl,
        name: uploadedFile.data.name,
        key: uploadedFile.data.key,
      },
    };
  } catch (error) {
    console.error("[UPLOADTHING_UPLOAD_ERROR]", error);
    throw error;
  }
}

/**
 * Delete file from UploadThing
 *
 * @param url - The UploadThing file URL
 * @returns Deletion result
 */
export async function deleteFile(url: string): Promise<{ success: boolean }> {
  try {
    if (!url) {
      throw new Error("No file URL provided");
    }

    // Extract file key from URL
    const fileKey = extractFileKey(url);

    if (!fileKey) {
      console.warn(
        "[UPLOADTHING_DELETE_WARN]",
        "Could not extract file key from URL",
        url
      );
      return { success: false };
    }

    // Delete file from UploadThing
    await utapi.deleteFiles(fileKey);

    return { success: true };
  } catch (error) {
    console.error("[UPLOADTHING_DELETE_ERROR]", "Failed to delete file", error);
    // Return success: false but don't throw (caller can decide whether to proceed)
    return { success: false };
  }
}

/**
 * Download file from UploadThing URL
 *
 * @param url - The UploadThing file URL
 * @returns File blob and metadata
 */
export async function downloadFile(url: string): Promise<{
  success: boolean;
  blob?: Blob;
  filename?: string;
  error?: string;
}> {
  try {
    if (!url) {
      return {
        success: false,
        error: "No file URL provided",
      };
    }

    // Download file from URL
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to download file: ${response.statusText}`,
      };
    }

    const blob = await response.blob();
    const filename = url.split("/").pop() || "file";

    return {
      success: true,
      blob,
      filename,
    };
  } catch (error) {
    console.error("[UPLOADTHING_DOWNLOAD_ERROR]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to download file",
    };
  }
}

/**
 * Replace existing file with new file (delete old, upload new)
 *
 * @param oldUrl - URL of existing file to delete
 * @param newFile - New file to upload
 * @param options - Upload options
 * @returns Upload result
 */
export async function replaceFile(
  oldUrl: string,
  newFile: File,
  options: {
    allowedTypes?: string[];
    maxSizeInMB?: number;
    filename?: string;
  } = {}
) {
  try {
    // Delete old file (don't throw if it fails)
    if (oldUrl) {
      await deleteFile(oldUrl);
    }

    // Upload new file
    const result = await uploadFile(newFile, options);

    return result;
  } catch (error) {
    console.error("[UPLOADTHING_REPLACE_ERROR]", error);
    throw error;
  }
}

/**
 * Generate unique filename
 *
 * @param prefix - Prefix for the filename
 * @param extension - File extension (with or without dot)
 * @returns Generated filename
 */
export function generateFilename(
  prefix: string = "file",
  extension: string = "pdf"
): string {
  const ext = extension.startsWith(".") ? extension : `.${extension}`;
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}${ext}`;
}

/**
 * UploadThing Service Instance
 * Exported for direct access if needed
 */
export const uploadThingService = {
  utapi,
  extractFileKey,
  validateFileType,
  validateFileSize,
  uploadFile,
  deleteFile,
  downloadFile,
  replaceFile,
  generateFilename,
};
