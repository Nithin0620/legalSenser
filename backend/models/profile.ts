import mongoose, { Document,Schema } from "mongoose"



export interface IProfile extends Document {
  name: string;
  email: string;
  password: string;
  mobileNo?: string;
  occupation?: string;
  organization?: string;
  role?: string;
  industry?: string;
  jurisdiction?: string;
  languagePreference?: string;
  documentTypePreferences?: string[];
  legalExpertiseLevel?: "Beginner" | "Intermediate" | "Expert";
  tonePreference?: "Formal" | "Neutral" | "Friendly";
  highlightPreference?: boolean;
  autoGuidance?: boolean;
  savedDocuments?: Schema.Types.ObjectId[];
  bookmarkedGuides?: string[];
  recentActivity?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new mongoose.Schema<IProfile>({
    name: { type: String },
    email: { type: String, unique: true },
    mobileNo: { type: String },
    occupation: { type: String },
    organization: { type: String },
    role: { type: String },
    industry: { type: String },
    jurisdiction: { type: String },
    languagePreference: { type: String, default: "English" },
    legalExpertiseLevel: {
        type: String,
        enum: ["Beginner", "Intermediate", "Expert"],
        default: "Beginner",
    },
    tonePreference: {
        type: String,
        enum: ["Formal", "Neutral", "Friendly"],
        default: "Neutral",
    },
    highlightPreference: { type: Boolean, default: true },
    autoGuidance: { type: Boolean, default: true },
    savedDocuments: [
        { 
            type: Schema.Types.ObjectId, 
            ref: "Document" 
        }
    ],
    bookmarkedGuides: [{ type: String }],
    recentActivity:[
        { 
            type: Schema.Types.ObjectId, 
            ref: "Document" 
        }
    ],
},
{ 
    timestamps: true 
}
);


module.exports = mongoose.model<IProfile>("Profile",profileSchema);