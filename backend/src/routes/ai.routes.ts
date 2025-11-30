import express from "express";
import { protectRoute } from "../middlewares/ProtectRoute";
import {
    simplifyDocument,
    summarizeDocument,
    compareDocuments,
    analyzeRisk,
    chatWithDocument
} from "../controller/handleAi";

const router = express.Router();

// All AI routes are protected - user must be authenticated
router.post("/simplify", protectRoute, simplifyDocument);
router.post("/summarize", protectRoute, summarizeDocument);
router.post("/compare", protectRoute, compareDocuments);
router.post("/analyze-risk", protectRoute, analyzeRisk);
router.post("/chat", protectRoute, chatWithDocument);

export default router;
