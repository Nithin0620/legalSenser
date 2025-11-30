import { Request, Response } from "express";
import {
    callSimplifyAPI,
    callSummarizeAPI,
    callCompareAPI,
    callAnalyzeRiskAPI,
    callChatAPI
} from "../services/aiService";

/**
 * Controller for simplifying legal documents
 * Endpoint: POST /api/ai/simplify
 */
export const simplifyDocument = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }

        const result = await callSimplifyAPI(text);

        res.status(200).json({
            success: true,
            message: "Document simplified successfully",
            data: result
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
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }

        const result = await callSummarizeAPI(text);

        res.status(200).json({
            success: true,
            message: "Document summarized successfully",
            data: result
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
 */
export const compareDocuments = async (req: Request, res: Response) => {
    try {
        const { doc1, doc2 } = req.body;

        if (!doc1 || !doc2) {
            return res.status(400).json({
                success: false,
                message: "Both doc1 and doc2 are required"
            });
        }

        const result = await callCompareAPI(doc1, doc2);

        res.status(200).json({
            success: true,
            message: "Documents compared successfully",
            data: result
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
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Text is required"
            });
        }

        const result = await callAnalyzeRiskAPI(text);

        res.status(200).json({
            success: true,
            message: "Risk analysis completed successfully",
            data: result
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
 * Controller for chatting with document context
 * Endpoint: POST /api/ai/chat
 */
export const chatWithDocument = async (req: Request, res: Response) => {
    try {
        const { context, question, history } = req.body;

        if (!context || !question) {
            return res.status(400).json({
                success: false,
                message: "Context and question are required"
            });
        }

        const result = await callChatAPI(context, question, history || []);

        res.status(200).json({
            success: true,
            message: "Chat response generated successfully",
            data: result
        });
    } catch (error: any) {
        console.error("Error in chatWithDocument controller:", error.message);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get chat response"
        });
    }
};
