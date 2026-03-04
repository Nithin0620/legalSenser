import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import User from "../models/user";
import Profile from "../models/profile";
import Otp from "../models/otp";
import { OAuth2Client } from "google-auth-library";
import { sendOTPEmail } from "../services/emailService";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true
        });

        // Save OTP to database
        await Otp.create({ email, otp });

        // Send OTP via email
        await sendOTPEmail(email, otp);

        console.log(`OTP for ${email} is ${otp}`);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email"
        });
    } catch (err: any) {
        console.error("Error in sendOtp:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to send OTP"
        });
    }
};

export const signupWithOtp = async (req: Request, res: Response) => {
    try {
        const { name, email, mobileNo, password, otpInput } = req.body;

        if (!name || !email || !password || !otpInput) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password, and OTP are required"
            });
        }

        // Find the most recent OTP for this email
        const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

        if (!otpRecord || otpRecord.otp !== otpInput) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile
        const profile = await Profile.create({ name, email, mobileNo });

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobileNo,
            provider: "local",
            profile: profile._id,
        });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "2d" });

        // Delete used OTP
        await Otp.deleteOne({ _id: otpRecord._id });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
            token
        });
    } catch (err: any) {
        console.error("Error in signupWithOtp:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to register user"
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { uniq, passwordInput } = req.body;

        let user;
        user = await User.findOne({ email: uniq });
        if (!user) {
            user = await User.findOne({ mobileNo: uniq });
        }

        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message: "Invalid login method. Please use Google Sign-In."
            });
        }

        const isPasswordValid = await bcrypt.compare(passwordInput, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "2d" });

        res.status(200).json({ user, token });

    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;
        console.log("Received idToken from frontend");

        if (!idToken) {
            return res.status(400).json({ message: "Google ID token is required" });
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) return res.status(401).json({ message: "Invalid Google token" });

        const { email, name, sub: googleId, picture: profilePic } = payload;

        let user = await User.findOne({ googleId });

        if (!user) {
            const profile = await Profile.create({ name, email });

            user = await User.create({
                name,
                email,
                googleId,
                profilePic,
                provider: "google",
                profile: profile._id,
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET!,
            { expiresIn: "2d" }
        );

        res.status(200).json({ user, token });

    }
    catch (err: any) {
        console.error("Google login error:", err.response?.data || err);
        res.status(500).json({ message: err.message });
    }
};

export const logout = (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }
    catch (error: any) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const checkAuth = async (req: Request, res: Response) => {
    try {
        if (!(req as any).user.user._id) {
            return res.status(400).json({ message: "User id not found" });
        }

        const user = await User.findById((req as any).user.user._id).populate("profile").exec();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const payload = {
            user,
            token: (req as any).user.token,
        };

        res.status(200).json({
            success: true,
            message: "Successfully checked",
            data: payload,
        });
    } catch (error: any) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};