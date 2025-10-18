import mongoose, { Document, Schema } from "mongoose";

interface IMessage {
    message: string;
    role: string;
}

interface IAIChat extends Document {
    user: Schema.Types.ObjectId;
    document: Schema.Types.ObjectId;
    messages: IMessage[];
}

const aiChatSchema = new mongoose.Schema<IAIChat>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    document: {
        type: Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    messages: [
        {
            message: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                required: true,
            },
        },
    ],
}, { timestamps: true });

export default mongoose.model<IAIChat>("AIChat", aiChatSchema);
