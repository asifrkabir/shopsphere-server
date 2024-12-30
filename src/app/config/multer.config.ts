import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

// Helper function to sanitize the file name
const sanitizeFilename = (filename: string) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_"); // Replace problematic characters with underscores
};

// Function to remove the extension from the file name
const removeExtension = (filename: string) => {
  return filename.split(".").slice(0, -1).join(".");
};

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (_req, file) =>
      `${Math.random().toString(36).substring(2)}-${Date.now()}-${file.fieldname}-${sanitizeFilename(
        removeExtension(file.originalname)
      )}`, // Sanitize file name before generating public_id
  },
});

export const multerUpload = multer({ storage: storage });
