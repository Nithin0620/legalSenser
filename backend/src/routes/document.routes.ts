import express from "express";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { protectRoute } from "../middlewares/ProtectRoute";
import {
    uploadDocument,
    uploadDocumentVersion,
    getAllDocuments,
    getDocumentById,
    getDocumentVersions,
    deleteDocument,
    addToSavedDocs
} from "../controller/document.controller";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
    dest: "uploads/",
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const allowedMimes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
            "image/jpg"
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PDF, DOCX, and images are allowed."));
        }
    }
});

// Document upload and management
router.post("/upload", protectRoute, upload.single("file"), uploadDocument);
router.post("/upload-version", protectRoute, upload.single("file"), uploadDocumentVersion);
router.get("/all", protectRoute, getAllDocuments);
router.get("/:id", protectRoute, getDocumentById);
router.get("/:id/versions", protectRoute, getDocumentVersions);
router.delete("/:id", protectRoute, deleteDocument);

// Saved documents
router.post("/save", protectRoute, addToSavedDocs);

export default router;
