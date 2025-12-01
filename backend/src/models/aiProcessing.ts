import mongoose, { Document, Schema } from "mongoose";

interface IAiProcessing extends Document {
    user: Schema.Types.ObjectId;
    document: Schema.Types.ObjectId;
    processingType: "simplify" | "summarize" | "analyze-risk" | "compare" | "chat";
    
    // Input data
    inputText?: string;
    question?: string; // For chat
    compareDoc?: string; // For compare (second document)
    
    // Output/Result
    result: any; // Flexible to store different result formats
    
    // Metadata
    createdAt: Date;
    updatedAt: Date;
}

const aiProcessingSchema = new mongoose.Schema<IAiProcessing>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    document: {
        type: Schema.Types.ObjectId,
        ref: "Document",
        required: true,
        index: true
    },
    processingType: {
        type: String,
        enum: ["simplify", "summarize", "analyze-risk", "compare", "chat"],
        required: true,
        index: true
    },
    inputText: {
        type: String,
    },
    question: {
        type: String,
    },
    compareDoc: {
        type: String,
    },
    result: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
});

// Compound indexes for better query performance
aiProcessingSchema.index({ user: 1, document: 1, processingType: 1, createdAt: -1 });
aiProcessingSchema.index({ document: 1, processingType: 1 });

export default mongoose.model<IAiProcessing>("AiProcessing", aiProcessingSchema);
