import { Request, Response } from "express";

import jwt from "jsonwebtoken";
import User from "../models/user"


export const protectRoute = async (req : Request, res:Response, next:any) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                code: "NO_TOKEN",
                message: "Unauthorised - No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                code: "INVALID_TOKEN",
                message: "Unauthorised - Invalid token",
            });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                code: "USER_NOT_FOUND",
                message: "User not found",
            });
        }

        req.user = { user, token };
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