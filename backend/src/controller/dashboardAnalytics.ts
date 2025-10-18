import { Request, Response } from "express";
import Profile from "../models/profile";
import Document from "../models/document";

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
        const profile = await Profile.findById((req as any).user._id).populate("recentActivity");
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        res.json({ recentActivity: profile.recentActivity });
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


