import express from "express";
import { protectRoute } from "../middlewares/ProtectRoute";
import {
    simplifyDocument,
    summarizeDocument,
    compareDocuments,
    analyzeRisk,
    chatWithDocument,
    getDocumentProcessingHistory,
    getProcessingById,
    deleteProcessing,
    getAllHistory,
    getHistoryByType,
    toggleFavorite,
    getFavorites
} from "../controller/handleAi";

const router = express.Router();

// AI processing endpoints (work with or without documents)
router.post("/simplify", protectRoute, simplifyDocument);
router.post("/summarize", protectRoute, summarizeDocument);
router.post("/compare", protectRoute, compareDocuments);
router.post("/analyze-risk", protectRoute, analyzeRisk);
router.post("/chat", protectRoute, chatWithDocument);

// History endpoints
router.get("/history", protectRoute, getAllHistory); // Get all user history
router.get("/history/favorites", protectRoute, getFavorites); // Get favorites
router.get("/history/type/:operationType", protectRoute, getHistoryByType); // Get by type
router.get("/history/document/:documentId", protectRoute, getDocumentProcessingHistory); // Get by document
router.get("/history/:id", protectRoute, getProcessingById); // Get specific history entry
router.put("/history/:id/favorite", protectRoute, toggleFavorite); // Toggle favorite
router.delete("/history/:id", protectRoute, deleteProcessing); // Delete history entry

// Legacy endpoints (for backward compatibility)
router.get("/processing/:id", protectRoute, getProcessingById);
router.delete("/processing/:id", protectRoute, deleteProcessing);

export default router;
