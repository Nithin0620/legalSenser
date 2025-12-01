import { create } from 'zustand';
import api from '../lib/api';

interface Document {
  _id: string;
  title: string;
  documentType: string;
  version: number;
  uploadedAt: string;
  lastProcessedAt?: string;
}

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  recentActivity: any[];

  // Document actions
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File, title?: string) => Promise<Document>;
  getDocument: (id: string) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  
  // AI actions
  simplify: (documentId?: string, text?: string, title?: string) => Promise<any>;
  summarize: (documentId?: string, text?: string, title?: string) => Promise<any>;
  analyzeRisk: (documentId?: string, text?: string, title?: string) => Promise<any>;
  compare: (doc1: string, doc2: string, title?: string) => Promise<any>;
  chatWithDocument: (question: string, documentId?: string, history?: any[], title?: string) => Promise<any>;
  
  // History actions
  fetchRecentActivity: () => Promise<void>;
  
  setError: (error: string | null) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  selectedDocument: null,
  isLoading: false,
  error: null,
  recentActivity: [],

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/documents/all');
      set({ documents: response.data.documents, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch documents',
      });
    }
  },

  uploadDocument: async (file: File, title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (title) formData.append('title', title);

      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const newDoc = response.data.document;
      set((state) => ({
        documents: [newDoc, ...state.documents],
        isLoading: false,
      }));
      return newDoc;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Upload failed',
      });
      throw err;
    }
  },

  getDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/documents/${id}`);
      const doc = response.data.document;
      set({ selectedDocument: doc, isLoading: false });
      return doc;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to fetch document',
      });
      throw err;
    }
  },

  deleteDocument: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/documents/${id}`);
      set((state) => ({
        documents: state.documents.filter((d) => d._id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Failed to delete document',
      });
    }
  },

  simplify: async (documentId?: string, text?: string, title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/ai/simplify', {
        documentId,
        text,
        title,
      });
      set({ isLoading: false });
      return response.data;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Simplify failed',
      });
      throw err;
    }
  },

  summarize: async (documentId?: string, text?: string, title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/ai/summarize', {
        documentId,
        text,
        title,
      });
      set({ isLoading: false });
      return response.data;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Summarize failed',
      });
      throw err;
    }
  },

  analyzeRisk: async (documentId?: string, text?: string, title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/ai/analyze-risk', {
        documentId,
        text,
        title,
      });
      set({ isLoading: false });
      return response.data;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Risk analysis failed',
      });
      throw err;
    }
  },

  compare: async (doc1: string, doc2: string, title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/ai/compare', {
        doc1,
        doc2,
        title,
      });
      set({ isLoading: false });
      return response.data;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Compare failed',
      });
      throw err;
    }
  },

  chatWithDocument: async (question: string, documentId?: string, history?: any[], title?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/ai/chat', {
        question,
        documentId,
        history,
        title,
      });
      set({ isLoading: false });
      return response.data;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Chat failed',
      });
      throw err;
    }
  },

  fetchRecentActivity: async () => {
    try {
      const response = await api.get('/dashboard/recent-activity');
      set({ recentActivity: response.data.recentActivity });
    } catch (err) {
      // Silently fail for activity fetch
    }
  },

  setError: (error: string | null) => set({ error }),
}));
