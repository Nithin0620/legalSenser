import mongoose, { Document, Schema } from "mongoose";

interface IOtp extends Document {
    email: string;
    otp: string;
    createdAt: Date;
}

const otpSchema = new mongoose.Schema<IOtp>({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 10 * 60, // OTP expires in 10 minutes
    },
});

// Add index for faster queries
otpSchema.index({ email: 1, createdAt: -1 });

export default mongoose.model<IOtp>("Otp", otpSchema);
