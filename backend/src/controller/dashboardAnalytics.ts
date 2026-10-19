import { Request, Response } from "express";
import User from "../models/user";
import Profile from "../models/profile";
import RecentActivity from "../models/recentActivity";

/**
 * Helper to safely extract user ID from protectRoute request
 */
const getUserId = (req: Request): string | null => {
    return (req as any).user?._id || (req as any).user?.user?._id || null;
};

export const getSavedDocuments = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!user.profile) {
            return res.json({ success: true, savedDocuments: [] });
        }

        const profile = await Profile.findById(user.profile).populate("savedDocuments");
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

        res.json({ success: true, savedDocuments: profile.savedDocuments || [] });
    } catch (error: any) {
        console.error("Error in getSavedDocuments:", error.message || error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const { limit = 20, skip = 0 } = req.query;

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        // Get recent activity from RecentActivity model
        const activities = await RecentActivity.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate("document", "title documentType version");

        const total = await RecentActivity.countDocuments({ user: userId });

        res.json({ 
            success: true,
            recentActivity: activities,
            pagination: {
                total,
                limit: Number(limit),
                skip: Number(skip),
                hasMore: total > Number(skip) + Number(limit)
            }
        });
    } catch (error: any) {
        console.error("Error in getRecentActivity:", error.message || error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getUsageStats = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!user.profile) {
            return res.json({
                savedDocuments: {},
                recentActivity: {},
            });
        }

        const profile = await Profile.findById(user.profile)
            .populate("savedDocuments")
            .populate("recentActivity");

        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

        const countByType = (docs: any[]) => {
            const stats: Record<string, number> = {};
            docs.forEach((doc) => {
                const type = doc?.documentType || "unknown";
                stats[type] = (stats[type] || 0) + 1;
            });
            return stats;
        };

        const savedStats = countByType(profile.savedDocuments || []);
        const recentStats = countByType(profile.recentActivity || []);

        res.json({
            savedDocuments: savedStats,
            recentActivity: recentStats,
        });
    } catch (error: any) {
        console.error("Error in getUsageStats:", error.message || error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
