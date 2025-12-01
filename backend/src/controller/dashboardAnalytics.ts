import { Request, Response } from "express";
import Profile from "../models/profile";
import Document from "../models/document";
import RecentActivity from "../models/recentActivity";

export const getSavedDocuments = async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findById((req as any).user._id).populate("savedDocuments");
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        res.json({ savedDocuments: profile.savedDocuments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getUsageStats = async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findById((req as any).user._id)
            .populate("savedDocuments")
            .populate("recentActivity");

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        const countByType = (docs: any[]) => {
            const stats: Record<string, number> = {};
            docs.forEach((doc) => {
                const type = doc.documentType || "unknown";
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


