import express from "express";
import { protectRoute } from "../middlewares/ProtectRoute";
import {
    getRecentActivity,
    getUsageStats,
    getSavedDocuments,
} from "../controller/dashboardAnalytics";

const router = express.Router();

router.get("/recent-activity", protectRoute, getRecentActivity);
router.get("/stats", protectRoute, getUsageStats);
router.get("/saved-documents", protectRoute, getSavedDocuments);

export default router;
