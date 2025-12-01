import { Request, Response } from "express";
import {
    callSimplifyAPI,
    callSummarizeAPI,
    callCompareAPI,
    callAnalyzeRiskAPI,
    callChatAPI
} from "../services/aiService";
import Document from "../models/document";
import AiHistory from "../models/aiHistory";
import RecentActivity from "../models/recentActivity";

/**
 * Controller for simplifying legal documents
 * Endpoint: POST /api/ai/simplify
 */
export const simplifyDocument = async (req: Request, res: Response) => {
    try {
        const { documentId, text, title } = req.body;
        const userId = (req as any).user?.user?._id;

        if (!text && !documentId) {
            return res.status(400).json({
                success: false,
                message: "Text or documentId is required"
            });
        }

        let textToSimplify = text;

        // If documentId provided, get text from document
        if (documentId) {
            const document = await Document.findOne({ _id: documentId, user: userId });
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }
            textToSimplify = document.originalText;

            // Update document's lastProcessedAt
            await Document.updateOne(
                { _id: documentId },
                { lastProcessedAt: new Date() }
            );
        }

        const result = await callSimplifyAPI(textToSimplify);

        // Save to history (works with or without document)
        const historyEntry = await AiHistory.create({
            user: userId,
            document: documentId || undefined,
            operationType: "simplify",
            inputText: textToSimplify.substring(0, 500),
            result,
            title: title || `Simplified ${new Date().toLocaleDateString()}`
        });

        // Add to recent activity ONLY if generic (no documentId)
        if (!documentId) {
            await RecentActivity.create({
                user: userId,
                activityType: "ai_operation",
                operationType: "simplify",
                title: title || "Text Simplified",
                description: `Simplified text without document`
            });
        }

        res.status(200).json({
            success: true,
            message: "Document simplified successfully",
            data: result,
            historyId: historyEntry._id
        });
    } catch (error: any) {
        console.error("Error in simplifyDocument controller:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to simplify document"
        });
    }
};

/**
 * Controller for summarizing documents
 * Endpoint: POST /api/ai/summarize
 */
export const summarizeDocument = async (req: Request, res: Response) => {
    try {
        const { documentId, text, title } = req.body;
        const userId = (req as any).user?.user?._id;

        if (!text && !documentId) {
            return res.status(400).json({
                success: false,
                message: "Text or documentId is required"
            });
        }

        let textToSummarize = text;

        // If documentId provided, get text from document
        if (documentId) {
            const document = await Document.findOne({ _id: documentId, user: userId });
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }
            textToSummarize = document.originalText;

            await Document.updateOne(
                { _id: documentId },
                { lastProcessedAt: new Date() }
            );
        }

        const result = await callSummarizeAPI(textToSummarize);

        // Save to history (works with or without document)
        const historyEntry = await AiHistory.create({
            user: userId,
            document: documentId || undefined,
            operationType: "summarize",
            inputText: textToSummarize.substring(0, 500),
            result,
            title: title || `Summarized ${new Date().toLocaleDateString()}`
        });

        // Add to recent activity ONLY if generic (no documentId)
        if (!documentId) {
            await RecentActivity.create({
                user: userId,
                activityType: "ai_operation",
                operationType: "summarize",
                title: title || "Text Summarized",
                description: `Summarized text without document`
            });
        }

        res.status(200).json({
            success: true,
            message: "Document summarized successfully",
            data: result,
            historyId: historyEntry._id
        });
    } catch (error: any) {
        console.error("Error in summarizeDocument controller:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to summarize document"
        });
    }
};

/**
 * Controller for comparing two documents
 * Endpoint: POST /api/ai/compare
 * Works with text or document IDs
 */
export const compareDocuments = async (req: Request, res: Response) => {
    try {
        const { doc1, doc2, documentId1, documentId2, title } = req.body;
        const userId = (req as any).user?.user?._id;

        let text1 = doc1;
        let text2 = doc2;

        // Get text from documents if IDs provided
        if (documentId1) {
            const document = await Document.findOne({ _id: documentId1, user: userId });
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document 1 not found"
                });
            }
            text1 = document.originalText;
            await Document.updateOne({ _id: documentId1 }, { lastProcessedAt: new Date() });
        }

        if (documentId2) {
            const document = await Document.findOne({ _id: documentId2, user: userId });
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document 2 not found"
                });
            }
            text2 = document.originalText;
            await Document.updateOne({ _id: documentId2 }, { lastProcessedAt: new Date() });
        }

        if (!text1 || !text2) {
            return res.status(400).json({
                success: false,
                message: "Both documents or texts are required"
            });
        }

        const result = await callCompareAPI(text1, text2);

        // Save to history
        // Note: Compare doesn't link to a single document since it compares two
        const historyEntry = await AiHistory.create({
            user: userId,
            operationType: "compare",
            inputDoc1: text1.substring(0, 300),
            inputDoc2: text2.substring(0, 300),
            result,
            title: title || `Comparison ${new Date().toLocaleDateString()}`
        });

        // Add to recent activity (compare is always "generic" since it doesn't belong to one document)
        await RecentActivity.create({
            user: userId,
            activityType: "ai_operation",
            operationType: "compare",
            title: title || "Document Comparison",
            description: `Compared two documents`
        });

        res.status(200).json({
            success: true,
            message: "Documents compared successfully",
            data: result,
            historyId: historyEntry._id
        });
    } catch (error: any) {
        console.error("Error in compareDocuments controller:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to compare documents"
        });
    }
};

/**
 * Controller for analyzing document risks
 * Endpoint: POST /api/ai/analyze-risk
 */
export const analyzeRisk = async (req: Request, res: Response) => {
    try {
        const { documentId, text, title } = req.body;
        const userId = (req as any).user?.user?._id;

        if (!text && !documentId) {
            return res.status(400).json({
                success: false,
                message: "Text or documentId is required"
            });
        }

        let textToAnalyze = text;

        // If documentId provided, get text from document
        if (documentId) {
            const document = await Document.findOne({ _id: documentId, user: userId });
            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }
            textToAnalyze = document.originalText;

            await Document.updateOne(
                { _id: documentId },
                { lastProcessedAt: new Date() }
            );
        }

        const result = await callAnalyzeRiskAPI(textToAnalyze);

        // Save to history (works with or without document)
        const historyEntry = await AiHistory.create({
            user: userId,
            document: documentId || undefined,
            operationType: "analyze-risk",
            inputText: textToAnalyze.substring(0, 500),
            result,
            title: title || `Risk Analysis ${new Date().toLocaleDateString()}`
        });

        // Add to recent activity ONLY if generic (no documentId)
        if (!documentId) {
            await RecentActivity.create({
                user: userId,
                activityType: "ai_operation",
                operationType: "analyze-risk",
                title: title || "Risk Analysis",
                description: `Analyzed text risks without document`
            });
        }

        res.status(200).json({
            success: true,
            message: "Risk analysis completed successfully",
            data: result,
            historyId: historyEntry._id
        });
    } catch (error: any) {
        console.error("Error in analyzeRisk controller:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to analyze risk"
        });
    }
};

/**
/**
 * Controller for chatting with document context
 * Endpoint: POST /api/ai/chat
 */
export const chatWithDocument = async (req: Request, res: Response) => {
    try {
        const { documentId, question, history, title, text } = req.body;
        const userId = (req as any).user?.user?._id;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        let context = text || "";

        // Find the document if documentId provided
        if (documentId) {
            const document = await Document.findOne({ 
                _id: documentId, 
                user: userId 
            });

            if (!document) {
                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }

            context = document.originalText;

            // Update document's lastProcessedAt
            await Document.updateOne(
                { _id: documentId },
                { lastProcessedAt: new Date() }
            );
        }

        // Call AI service with document context (or empty string for general chat)
        const result = await callChatAPI(context, question, history || []);

        // Save chat to history
        const historyEntry = await AiHistory.create({
            user: userId,
            document: documentId || undefined,
            operationType: "chat",
            question,
            chatHistory: history || [],
            result,
            title: title || `Chat ${new Date().toLocaleDateString()}`
        });

        // Add to recent activity ONLY if generic (no documentId)
        if (!documentId) {
            await RecentActivity.create({
                user: userId,
                activityType: "ai_operation",
                operationType: "chat",
                title: title || "AI Chat",
                description: question.substring(0, 100)
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat response generated successfully",
            data: result,
            historyId: historyEntry._id
        });
    } catch (error: any) {
        console.error("Error in chatWithDocument controller:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get chat response"
        });
    }
};
/**
 * Get all AI processing history for a document
 * Endpoint: GET /api/ai/history/:documentId
 */
export const getDocumentProcessingHistory = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params;
        const { type } = req.query; // Optional filter by processing type
        const userId = (req as any).user?.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Verify document belongs to user
        const document = await Document.findOne({ _id: documentId, user: userId });
        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        const query: any = { document: documentId, user: userId };
        if (type) {
            query.operationType = type;
        }

        const history = await AiHistory.find(query)
            .sort({ createdAt: -1 });

        // Group by processing type
        const grouped: any = {
            simplify: [],
            summarize: [],
            "analyze-risk": [],
            compare: [],
            chat: []
        };

        history.forEach(item => {
            const preview = typeof item.result === 'string' 
                ? item.result.substring(0, 100) + '...'
                : JSON.stringify(item.result).substring(0, 100) + '...';

            grouped[item.operationType].push({
                _id: item._id,
                title: item.title,
                createdAt: item.createdAt,
                isFavorite: item.isFavorite,
                question: item.question,
                resultPreview: preview
            });
        });

        res.status(200).json({
            success: true,
            document: {
                _id: document._id,
                title: document.title
            },
            summary: {
                total: history.length,
                simplify: grouped.simplify.length,
                summarize: grouped.summarize.length,
                analyzeRisk: grouped["analyze-risk"].length,
                compare: grouped.compare.length,
                chat: grouped.chat.length
            },
            history: grouped
        });
    } catch (error: any) {
        console.error("Error in getDocumentProcessingHistory:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get processing history"
        });
    }
};

/**
 * Get specific AI processing result by ID
 * Endpoint: GET /api/ai/processing/:id
 */
export const getProcessingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const processing = await AiHistory.findOne({ _id: id, user: userId })
            .populate("document", "title version");

        if (!processing) {
            return res.status(404).json({
                success: false,
                message: "Processing result not found"
            });
        }

        res.status(200).json({
            success: true,
            data: processing
        });
    } catch (error: any) {
        console.error("Error in getProcessingById:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get processing result"
        });
    }
};

/**
 * Delete specific AI processing result
 * Endpoint: DELETE /api/ai/processing/:id
 */
export const deleteProcessing = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const processing = await AiHistory.findOneAndDelete({ _id: id, user: userId });

        if (!processing) {
            return res.status(404).json({
                success: false,
                message: "Processing result not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Processing result deleted successfully"
        });
    } catch (error: any) {
        console.error("Error in deleteProcessing:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete processing result"
        });
    }
};

/**
 * Get all AI history for the user (across all documents and standalone operations)
 * Endpoint: GET /api/ai/history
 */
export const getAllHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        const { type, limit = 50, skip = 0 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const query: any = { user: userId };
        if (type) {
            query.operationType = type;
        }

        const history = await AiHistory.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate("document", "title version");

        const total = await AiHistory.countDocuments(query);

        res.status(200).json({
            success: true,
            data: history,
            pagination: {
                total,
                limit: Number(limit),
                skip: Number(skip),
                hasMore: total > Number(skip) + Number(limit)
            }
        });
    } catch (error: any) {
        console.error("Error in getAllHistory:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get history"
        });
    }
};

/**
 * Get AI history by operation type
 * Endpoint: GET /api/ai/history/type/:operationType
 */
export const getHistoryByType = async (req: Request, res: Response) => {
    try {
        const { operationType } = req.params;
        const userId = (req as any).user?.user?._id;
        const { limit = 50, skip = 0 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const validTypes = ["simplify", "summarize", "analyze-risk", "compare", "chat"];
        if (!validTypes.includes(operationType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid operation type"
            });
        }

        const history = await AiHistory.find({ 
            user: userId, 
            operationType 
        })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate("document", "title version");

        const total = await AiHistory.countDocuments({ user: userId, operationType });

        res.status(200).json({
            success: true,
            operationType,
            data: history,
            pagination: {
                total,
                limit: Number(limit),
                skip: Number(skip),
                hasMore: total > Number(skip) + Number(limit)
            }
        });
    } catch (error: any) {
        console.error("Error in getHistoryByType:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get history by type"
        });
    }
};

/**
 * Toggle favorite status for a history entry
 * Endpoint: PUT /api/ai/history/:id/favorite
 */
export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.user?._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const history = await AiHistory.findOne({ _id: id, user: userId });

        if (!history) {
            return res.status(404).json({
                success: false,
                message: "History entry not found"
            });
        }

        history.isFavorite = !history.isFavorite;
        await history.save();

        res.status(200).json({
            success: true,
            message: "Favorite status updated",
            isFavorite: history.isFavorite
        });
    } catch (error: any) {
        console.error("Error in toggleFavorite:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to toggle favorite"
        });
    }
};

/**
 * Get all favorite history entries
 * Endpoint: GET /api/ai/history/favorites
 */
export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.user?._id;
        const { limit = 50, skip = 0 } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const favorites = await AiHistory.find({ 
            user: userId, 
            isFavorite: true 
        })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate("document", "title version");

        const total = await AiHistory.countDocuments({ user: userId, isFavorite: true });

        res.status(200).json({
            success: true,
            data: favorites,
            pagination: {
                total,
                limit: Number(limit),
                skip: Number(skip),
                hasMore: total > Number(skip) + Number(limit)
            }
        });
    } catch (error: any) {
        console.error("Error in getFavorites:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get favorites"
        });
    }
};
