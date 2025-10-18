import mongoose, { Document, Schema } from "mongoose";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

const client = twilio(accountSid, authToken);

interface IOtp extends Document {
    mobileNo: Number;
    otp: string;
    createdAt: Date;
}

const otpSchema = new mongoose.Schema<IOtp>({
    mobileNo: {
        type: Number,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60,
    },
});

otpSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            await client.messages.create({
                body: `Your OTP is: ${this.otp}`,
                to: `+91${this.mobileNo}`,
                from: "+917428662179",
            });
        } catch (err) {
            console.error("Error sending OTP:", err);
        }
    }
    next();
});

export default mongoose.model<IOtp>("Otp", otpSchema);
