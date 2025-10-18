import mongoose, { Document, Schema } from "mongoose"

export interface IAIGuide extends Document {
    document: Schema.Types.ObjectId;
    section: string;
    suggestion: string;
    explanation?: string;
    riskLevel?: "Low" | "Medium" | "High";
    createdAt: Date;
}

const aiGuideSchema = new mongoose.Schema<IAIGuide>({
    document: {
        type: Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    suggestion: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
    },
    riskLevel: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low",
    },

}, {
    timestamps: true,
})


module.exports = mongoose.model<IAIGuide>("AIGuide", aiGuideSchema);