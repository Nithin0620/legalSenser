import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                code: "NO_TOKEN",
                message: "Unauthorised - No token provided",
            });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET not configured in environment");
            return res.status(500).json({
                success: false,
                code: "SERVER_CONFIG",
                message: "Server misconfiguration"
            });
        }

        const decoded = jwt.verify(token, secret);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                code: "INVALID_TOKEN",
                message: "Unauthorised - Invalid token",
            });
        }

        // jwt.sign uses payload { id: user._id } in auth controller
        const payload = decoded as jwt.JwtPayload | string;
        const userId = typeof payload === "object" && (payload as any).id ? (payload as any).id : (payload as any).userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: "INVALID_TOKEN_PAYLOAD",
                message: "Invalid token payload"
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                code: "USER_NOT_FOUND",
                message: "User not found",
            });
        }

        // attach to request (typed as any to avoid augmentation here)
        (req as any).user = { user, token };
        next();
    } catch (e:any) {

        if (e.name === "TokenExpiredError") {
            return res.status(200).json({
                success: false,
                code: "JWT_EXPIRED",
                message: "Token has expired",
            });
        }

        res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Something went wrong",
        });
    }
};