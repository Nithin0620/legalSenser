import axios from "axios";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

interface SimplifyRequest {
    text: string;
}

interface SummarizeRequest {
    text: string;
}

interface CompareRequest {
    doc1: string;
    doc2: string;
}

interface RiskRequest {
    text: string;
}

interface ChatRequest {
    context: string;
    question: string;
    history?: any[];
}

export const callSimplifyAPI = async (text: string) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/simplify`, {
            text
        });
        return response.data;
    } catch (error: any) {
        console.error("Error calling simplify API:", error.message);
        throw new Error(error.response?.data?.error || "Failed to simplify document");
    }
};

export const callSummarizeAPI = async (text: string) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/summarize`, {
            text
        });
        return response.data;
    } catch (error: any) {
        console.error("Error calling summarize API:", error.message);
        throw new Error(error.response?.data?.error || "Failed to summarize document");
    }
};

export const callCompareAPI = async (doc1: string, doc2: string) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/compare`, {
            doc1,
            doc2
        });
        return response.data;
    } catch (error: any) {
        console.error("Error calling compare API:", error.message);
        throw new Error(error.response?.data?.error || "Failed to compare documents");
    }
};

export const callAnalyzeRiskAPI = async (text: string) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/analyze-risk`, {
            text
        });
        return response.data;
    } catch (error: any) {
        console.error("Error calling analyze-risk API:", error.message);
        throw new Error(error.response?.data?.error || "Failed to analyze risk");
    }
};

export const callChatAPI = async (context: string, question: string, history: any[] = []) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/chat`, {
            context,
            question,
            history
        });
        return response.data;
    } catch (error: any) {
        console.error("Error calling chat API:", error.message);
        throw new Error(error.response?.data?.error || "Failed to get chat response");
    }
};
