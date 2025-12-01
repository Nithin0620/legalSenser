import mongoose, { Document, Types, Schema } from "mongoose";

interface IDocument extends Document {
    user: Schema.Types.ObjectId;
    title: string;
    fileUrl?: string;
    originalText: string;
    documentType: string; // pdf, docx, image
    mimeType: string;
    fileSize?: number;
    
    // Versioning
    version: number;
    parentDocument?: Schema.Types.ObjectId; // Reference to original document
    isLatestVersion: boolean;
    
    // Metadata
    uploadedAt: Date;
    lastProcessedAt?: Date;
    
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new mongoose.Schema<IDocument>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
    },
    originalText: {
        type: String,
        required: true,
    },
    documentType: {
        type: String,
        required: true,
        enum: ["pdf", "docx", "image"]
    },
    mimeType: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
    },
    
    // Versioning fields
    version: {
        type: Number,
        default: 1,
    },
    parentDocument: {
        type: Schema.Types.ObjectId,
        ref: "Document",
    },
    isLatestVersion: {
        type: Boolean,
        default: true,
    },
    
    // Metadata
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    lastProcessedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Indexes for better query performance
documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ user: 1, isLatestVersion: 1 });
documentSchema.index({ parentDocument: 1, version: -1 });

export default mongoose.model<IDocument>("Document", documentSchema);
