import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import User from "../models/User";
import Profile from "../models/Profile";
import Otp from "../models/Otp";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { mobileNo } = req.body;

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        await Otp.create({ mobileNo, otp });

        console.log(`OTP for ${mobileNo} is ${otp}`);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const signupWithOtp = async (req: Request, res: Response) => {
    try {
        const { name, email, mobileNo, password, otpInput } = req.body;

        const otpRecord = await Otp.findOne({ mobileNo }).sort({ createdAt: -1 });
        if (!otpRecord || otpRecord.otp !== otpInput) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profile = await Profile.create({ name, email, mobileNo });

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobileNo,
            provider: "local",
            profile: profile._id,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "2d" });

        res.status(201).json({ user, token });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { uniq, passwordInput } = req.body;

        let user;
        user = User.findOne({ email: uniq });
        if (!user) {
            user = User.findOne({ mobileNo: uniq });
        }

        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }

        if (user.password !== passwordInput) {
            return res.status(400).json({
                message: "Incorrect password"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "2d" });

        res.status(201).json({ user, token });


    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "2d" });

        res.status(200).json({ user, token });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = (req :Request, res :Response) => {
  try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ success:true,message: "Logged out successfully" });
   }
   catch (error :any) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({success:false, message: "Internal Server Error" });
   }
};


export const checkAuth = async (req : Request, res : Response) => {
    try {
        if (!req.user.user._id) {
            return res.status(400).json({ message: "User id not found" });
        }

        const user = await User.findById(req.user.user._id).populate("profile").exec();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const payload = {
            user,
            token: req.user.token,
        };

        res.status(200).json({
            success: true,
            message: "Successfully checked",
            data: payload,
        });
    } catch (error : any) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};