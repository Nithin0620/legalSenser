import mongoose, { Document, Schema } from "mongoose";

interface IAiHistory extends Document {
    user: Schema.Types.ObjectId;
    document?: Schema.Types.ObjectId; // Optional - can work without document
    operationType: "simplify" | "summarize" | "analyze-risk" | "compare" | "chat";
    
    // Input data
    inputText?: string;
    inputDoc1?: string; // For compare
    inputDoc2?: string; // For compare
    question?: string; // For chat
    chatHistory?: any[]; // For chat context
    
    // Output data
    result: any; // Stores the AI response
    
    // Metadata
    title?: string; // Auto-generated or user-provided
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const aiHistorySchema = new mongoose.Schema<IAiHistory>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    document: {
        type: Schema.Types.ObjectId,
        ref: "Document",
        index: true
    },
    operationType: {
        type: String,
        enum: ["simplify", "summarize", "analyze-risk", "compare", "chat"],
        required: true
    },
    
    // Input fields
    inputText: {
        type: String,
    },
    inputDoc1: {
        type: String,
    },
    inputDoc2: {
        type: String,
    },
    question: {
        type: String,
    },
    chatHistory: [{
        role: String,
        content: String
    }],
    
    // Output
    result: {
        type: Schema.Types.Mixed,
        required: true
    },
    
    // Metadata
    title: {
        type: String,
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

// Indexes for efficient queries
aiHistorySchema.index({ user: 1, operationType: 1, createdAt: -1 });
aiHistorySchema.index({ user: 1, document: 1, operationType: 1 });
aiHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IAiHistory>("AiHistory", aiHistorySchema);
