import mongoose, { Document, Schema } from "mongoose";


interface IUser extends Document {
    name: string;
    email: string;
    mobileNo?: number;
    password?: string;
    token?: string;
    profilePic?: string;
    profile: Schema.Types.ObjectId;
    googleId?: string;
    provider: "local" | "google";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNo: {
        type: Number,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    profilePic: {
        type: String,
        default: "",
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "profile",
        required: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
},
    { timestamps: true }
);


module.exports = mongoose.model<IUser>("User", userSchema);
