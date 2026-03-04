import { Request, Response } from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import Document from "../models/document";
import User from "../models/user";
import Profile from "../models/profile";
import RecentActivity from "../models/recentActivity";

/**
 * Extract text from uploaded file
 */
const extractTextFromFile = async (filePath: string, mimeType: string): Promise<string> => {
    let extractedText = "";

    if (mimeType === "application/pdf") {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await (pdfParse as any)(dataBuffer);
        extractedText = data.text;
    } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value;
    } else if (mimeType.startsWith("image/")) {
        const { data } = await Tesseract.recognize(filePath, "eng");
        extractedText = data.text;
    } else {
        throw new Error("Unsupported file type");
    }

    return extractedText;
};

/**
 * Upload and save document (no AI processing here)
 */
export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        if (!(req as any).file) {
            return res.status(400).json({ 
                success: false,
                message: "No file uploaded" 
            });
        }

        const { title } = req.body;
        const file = (req as any).file;
        const filePath = file.path;
        const mimeType = file.mimetype;
        const fileSize = file.size;

        // Determine document type
        let documentType = "pdf";
        if (mimeType === "application/pdf") {
            documentType = "pdf";
        } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            documentType = "docx";
        } else if (mimeType.startsWith("image/")) {
            documentType = "image";
        } else {
            fs.unlinkSync(filePath);
            return res.status(400).json({ 
                success: false,
                message: "Unsupported document type. Please upload PDF, DOCX, or Image files." 
            });
        }

        // Extract text from file
        const extractedText = await extractTextFromFile(filePath, mimeType);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from document. The file might be empty or corrupted."
            });
        }

        // Save document to database
        const newDoc = await Document.create({
            user: userId,
            title: title || `Document ${new Date().toLocaleDateString()}`,
            originalText: extractedText,
            documentType,
            mimeType,
            fileSize,
            version: 1,
            isLatestVersion: true,
            uploadedAt: new Date(),
        });

        // Update user's recent activity
        const user = await User.findById(userId);
        if (user?.profile) {
            await Profile.findByIdAndUpdate(
                user.profile,
                { $push: { recentActivity: newDoc._id } }
            );
        }

        // Add to recent activity feed
        await RecentActivity.create({
            user: userId,
            activityType: "document_upload",
            document: newDoc._id,
            title: `Uploaded ${newDoc.title}`,
            description: `New ${documentType.toUpperCase()} document uploaded`
        });

        return res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            document: {
                _id: newDoc._id,
                title: newDoc.title,
                documentType: newDoc.documentType,
                version: newDoc.version,
                uploadedAt: newDoc.uploadedAt,
                textLength: extractedText.length
            }
        });
    } catch (e: any) {
        console.error("❌ Error in uploadDocument controller:", e);
        return res.status(500).json({
            success: false,
            message: "Error uploading document",
            error: e.message,
        });
    }
};

/**
 * Upload a new version of existing document
 */
export const uploadDocumentVersion = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        const { parentDocumentId } = req.body;

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        if (!(req as any).file) {
            return res.status(400).json({ 
                success: false,
                message: "No file uploaded" 
            });
        }

        // Find parent document
        const parentDoc = await Document.findOne({ _id: parentDocumentId, user: userId });
        if (!parentDoc) {
            return res.status(404).json({
                success: false,
                message: "Parent document not found"
            });
        }

        const { title } = req.body;
        const file = (req as any).file;
        const filePath = file.path;
        const mimeType = file.mimetype;
        const fileSize = file.size;

        let documentType = "pdf";
        if (mimeType === "application/pdf") {
            documentType = "pdf";
        } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            documentType = "docx";
        } else if (mimeType.startsWith("image/")) {
            documentType = "image";
        }

        // Extract text
        const extractedText = await extractTextFromFile(filePath, mimeType);
        fs.unlinkSync(filePath);

        // Mark old version as not latest
        await Document.updateOne(
            { _id: parentDocumentId },
            { isLatestVersion: false }
        );

        // Get the latest version number by finding the highest version in the document chain
        const latestVersion = await Document.findOne({
            $or: [
                { _id: parentDoc.parentDocument || parentDocumentId },
                { parentDocument: parentDoc.parentDocument || parentDocumentId }
            ],
            user: userId
        }).sort({ version: -1 });
        
        const newVersion = (latestVersion?.version || parentDoc.version) + 1;

        // Create new version
        const newDoc = await Document.create({
            user: userId,
            title: title || parentDoc.title,
            originalText: extractedText,
            documentType,
            mimeType,
            fileSize,
            version: newVersion,
            parentDocument: parentDoc.parentDocument || parentDocumentId,
            isLatestVersion: true,
            uploadedAt: new Date(),
        });

        // Add to recent activity feed
        await RecentActivity.create({
            user: userId,
            activityType: "document_version",
            document: newDoc._id,
            title: `New version of ${newDoc.title}`,
            description: `Uploaded version ${newVersion} of document`,
            metadata: { version: newVersion, parentDocument: parentDocumentId }
        });

        return res.status(201).json({
            success: true,
            message: "New document version uploaded successfully",
            document: {
                _id: newDoc._id,
                title: newDoc.title,
                version: newDoc.version,
                parentDocument: newDoc.parentDocument,
                uploadedAt: newDoc.uploadedAt
            }
        });
    } catch (e: any) {
        console.error("❌ Error in uploadDocumentVersion:", e);
        return res.status(500).json({
            success: false,
            message: "Error uploading document version",
            error: e.message,
        });
    }
};

/**
 * Get all documents (latest versions only by default)
 */
export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        const { includeVersions } = req.query;

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        const query: any = { user: userId };
        
        // By default, only show latest versions
        if (includeVersions !== "true") {
            query.isLatestVersion = true;
        }

        const documents = await Document.find(query)
            .sort({ createdAt: -1 })
            .select("-originalText"); // Don't send full text in list

        return res.status(200).json({
            success: true,
            count: documents.length,
            documents,
        });
    } catch (e: any) {
        console.error("❌ Error in getAllDocuments:", e);
        return res.status(500).json({
            success: false,
            message: "Error fetching documents",
            error: e.message,
        });
    }
};

/**
 * Get document by ID with full details
 */
export const getDocumentById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        const document = await Document.findOne({ _id: id, user: userId });
        
        if (!document) {
            return res.status(404).json({ 
                success: false,
                message: "Document not found" 
            });
        }

        return res.status(200).json({
            success: true,
            document,
        });
    } catch (e: any) {
        console.error("❌ Error in getDocumentById:", e);
        return res.status(500).json({
            success: false,
            message: "Error fetching document",
            error: e.message,
        });
    }
};

/**
 * Get all versions of a document
 */
export const getDocumentVersions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        // Find the document
        const document = await Document.findOne({ _id: id, user: userId });
        
        if (!document) {
            return res.status(404).json({ 
                success: false,
                message: "Document not found" 
            });
        }

        // Get all versions (including this one)
        const rootDocId = document.parentDocument || document._id;
        
        const versions = await Document.find({
            $or: [
                { _id: rootDocId },
                { parentDocument: rootDocId }
            ],
            user: userId
        })
        .sort({ version: -1 })
        .select("-originalText");

        return res.status(200).json({
            success: true,
            count: versions.length,
            versions,
        });
    } catch (e: any) {
        console.error("❌ Error in getDocumentVersions:", e);
        return res.status(500).json({
            success: false,
            message: "Error fetching document versions",
            error: e.message,
        });
    }
};

/**
 * Delete document
 */
export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        const document = await Document.findOneAndDelete({ _id: id, user: userId });
        
        if (!document) {
            return res.status(404).json({ 
                success: false,
                message: "Document not found" 
            });
        }

        // Also delete from user's profile
        const user = await User.findById(userId);
        if (user?.profile) {
            await Profile.findByIdAndUpdate(
                user.profile,
                { 
                    $pull: { 
                        recentActivity: id,
                        savedDocuments: id 
                    } 
                }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (e: any) {
        console.error("❌ Error in deleteDocument:", e);
        return res.status(500).json({
            success: false,
            message: "Error deleting document",
            error: e.message,
        });
    }
};

/**
 * Add to saved documents
 */
export const addToSavedDocs = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.user._id;
        const { docsID } = req.body;

        const user = await User.findById(userId);
        
        if (!user?.profile) {
            return res.status(404).json({ 
                success: false,
                message: "User profile not found" 
            });
        }

        const result = await Profile.findByIdAndUpdate(
            user.profile,
            { $addToSet: { savedDocuments: docsID } }, // Use $addToSet to avoid duplicates
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ 
                success: false,
                message: "Error adding to saved documents" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Added to saved documents successfully",
        });
    } catch (e: any) {
        console.error("❌ Error in addToSavedDocs:", e);
        return res.status(500).json({
            success: false,
            message: "Error adding to saved documents",
            error: e.message
        });
    }
};
