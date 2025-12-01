import mongoose, { Schema, Document } from "mongoose";

export interface IRecentActivity extends Document {
    user: mongoose.Types.ObjectId;
    activityType: "document_upload" | "document_version" | "ai_operation";
    operationType?: "simplify" | "summarize" | "analyze-risk" | "compare" | "chat";
    document?: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    metadata?: any;
    createdAt: Date;
}

const recentActivitySchema = new Schema<IRecentActivity>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        activityType: {
            type: String,
            enum: ["document_upload", "document_version", "ai_operation"],
            required: true
        },
        operationType: {
            type: String,
            enum: ["simplify", "summarize", "analyze-risk", "compare", "chat"]
        },
        document: {
            type: Schema.Types.ObjectId,
            ref: "Document"
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        metadata: {
            type: Schema.Types.Mixed
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient querying by user and time
recentActivitySchema.index({ user: 1, createdAt: -1 });
recentActivitySchema.index({ user: 1, activityType: 1, createdAt: -1 });

export default mongoose.model<IRecentActivity>("RecentActivity", recentActivitySchema);
