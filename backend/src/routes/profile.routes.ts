import express from "express";
import { protectRoute } from "../middlewares/ProtectRoute";
import {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
} from "../controller/profile";

const router = express.Router();

router.get("/", protectRoute, getUserProfile);
router.put("/", protectRoute, updateUserProfile);
router.delete("/", protectRoute, deleteUserProfile);

export default router;
