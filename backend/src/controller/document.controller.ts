import { Request, Response } from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import Document from "../models/document";
import User from "../models/user";
import Profile from "../models/profile";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user?.user?._id;

        if (!(req as any).file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { documentType, title } = req.body;
        const filePath = (req as any).file.path;
        const mimeType = (req as any).file.mimetype;

        let extractedText = "";

        if (documentType === "pdf" || mimeType === "application/pdf") {
            const data = await pdfParse(fs.readFileSync(filePath));
            extractedText = data.text;
        } else if (
            documentType === "docx" ||
            mimeType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
        } else if (documentType === "image" || mimeType.startsWith("image/")) {
            const { data } = await Tesseract.recognize(filePath, "eng");
            extractedText = data.text;
        } else {
            return res.status(400).json({ message: "Unsupported document type" });
        }

        fs.unlinkSync(filePath);

        const prompt = `
            You are an AI assistant analyzing a document.
            1. Simplify the following text in plain, easy language.
            2. Identify 3-5 important clauses or sections that may need user attention.
            3. For each clause, assign a risk level (Low, Medium, or High) and give a suggestion.
            4. also make a title that i can assign for this result    
                    
            Return a JSON object like this:
            {
                "simplifiedText": "...",
                "aiHighlights": [
                {"clause": "...", "riskLevel": "High", "suggestion": "..."},
                {"clause": "...", "riskLevel": "Low", "suggestion": "..."}
                ],
                "title": "...."
            }

            Document text:
            """${extractedText.slice(0, 4000)}"""  // limit for safety
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });


        let aiResponse = completion.choices[0]?.message?.content?.trim() || "{}";
        let parsedData: any;

        try {
            parsedData = JSON.parse(aiResponse);
        } catch {
            parsedData = { simplifiedText: "", aiHighlights: [] };
        }

        const newDoc = await Document.create({
            user,
            title: parsedData.title,
            originalText: extractedText,
            simplifiedText: parsedData.simplifiedText,
            aiHighlights: parsedData.aiHighlights,
            processedByAI: true,
            documentType,
        });

        const userObj = User.findById(user);
        const profileId = (userObj as any).profile;
        const profile = await Profile.updateOne(
            { _id: profileId},
            { $push: { "recentActivity": newDoc._id } }
        );

        return res.status(201).json({
            success: true,
            message: "Document processed and saved successfully",
            document: newDoc,
        });
    } catch (e: any) {
        console.error("❌ Error in extractText controller:", e);
        return res.status(500).json({
            message: "Error in extractText controller",
            error: e.message,
        });
    }
};


export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user?.user?._id;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const documents = await Document.find({ user }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: documents.length,
            documents,
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Error in getAllDocuments controller",
            error: e.message,
        });
    }
};



export const getDocumentById = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user?.user?._id;
        const { id } = req.params;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const document = await Document.findOne({ _id: id, user });
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        return res.status(200).json({
            success: true,
            document,
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Error in getDocumentById controller",
            error: e.message,
        });
    }
};


export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user?.user?._id;
        const { id } = req.params;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const document = await Document.findOneAndDelete({ _id: id, user });
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (e: any) {
        return res.status(500).json({
            message: "Error in deleteDocument controller",
            error: e.message,
        });
    }
};


export const addToSavedDocs = async(req:Request , res:Response)=>{
    try{
        const userID = (req as any).user.user._id;
        const {docsID} = req.body;

        const user = await User.findById(userID);
        const result  = await Profile.findByIdAndUpdate(
            {_id : user?.profile},
            { $push : {"savedDocuments" : docsID}}
        );

        if(!result){
            return res.status(404).json({message:"error occured in addtosaveddocs"});
        }

        return res.status(200).json({
            success:true,
            message:"added to Saved Docs successfully",
            data:result
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:"Error ocured in the addToSavedDocs controller",
        })
    }
}