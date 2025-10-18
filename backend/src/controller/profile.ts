import { Request, Response } from "express";
import User from "../models/user";
import Profile from "../models/profile"

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).populate("profile");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } 
    catch (e: any) {
        return res.status(500).json({
            message: "Error in getUserProfile controller",
            error: e.message,
        });
    }
};


export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).populate("profile");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedProfile = await Profile.findByIdAndUpdate(
            user.profile,
            { $set: req.body },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile,
        });
    } 
    catch (e: any) {
        return res.status(500).json({
            message: "Error in updateUserProfile controller",
            error: e.message,
        });
    }
};

export const deleteUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Profile.findByIdAndDelete(user.profile);
        await User.findByIdAndDelete(userId);
        
        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully",
        });
    } 
    catch (e: any) {
        return res.status(500).json({
            message: "Error in deleteUserProfile controller",
            error: e.message,
        });
    }
};