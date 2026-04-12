import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  User,
  Brain,
  FileText,
  Search,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const { documentId } = useParams<{ documentId: string }>();
  const { documents, fetchDocuments, chatWithDocument, isLoading } = useDocumentStore();
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string>(documentId || "");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocuments();
    if (documentId) {
      setSelectedDocId(documentId);
      const doc = documents.find(d => d._id === documentId);
      setMessages([{
        id: "init",
        role: "assistant",
        content: `Hello! I've loaded "${doc?.title || 'your document'}". I can help you understand clauses, identify risks, or summarize sections. What would you like to know?`,
        timestamp: new Date()
      }]);
    } else {
        setMessages([{
        id: "init",
        role: "assistant",
        content: "Hello! Select a document from the list above and I'll help you analyze it. Or ask me general legal questions!",
        timestamp: new Date()
      }]);
    }
  }, [fetchDocuments]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }));

      const response = await chatWithDocument(currentInput, selectedDocId, chatHistory);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again or switch documents.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const selectedDoc = documents.find(d => d._id === selectedDocId);

  return (
    <div className="min-h-screen md:ml-64 h-screen flex flex-col relative z-0">
      <Sidebar />
      
      {/* Top Header */}
      <header className="p-4 md:p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none mb-1">AI Legal Assistant</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Powered by Groq Llama3</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedDocId} onValueChange={setSelectedDocId}>
            <SelectTrigger className="w-[280px] bg-slate-800/50 border-white/10 text-white h-11 rounded-xl">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-blue-400" />
                <SelectValue placeholder="Select a document to chat" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10 text-white">
              {documents.map(doc => (
                <SelectItem key={doc._id} value={doc._id}>
                  {doc.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDoc && (
            <Badge className="bg-blue-500/20 text-blue-400 border-none px-3 py-1">
              Active Context
            </Badge>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col max-w-5xl mx-auto w-full">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
        >
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`p-2 rounded-xl h-fit shadow-sm flex-shrink-0 ${
                  msg.role === "user" ? "bg-blue-600" : "bg-slate-800 border border-white/5"
                }`}>
                  {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Brain className="w-5 h-5 text-purple-400" />}
                </div>
                
                <div className={`space-y-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`px-5 py-3 rounded-2xl shadow-xl leading-relaxed text-sm ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none" 
                      : "bg-slate-900/80 border border-white/10 text-slate-200 backdrop-blur-sm"
                  }`}>
                    {msg.content}
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 items-center bg-slate-900/50 border border-white/10 px-6 py-3 rounded-2xl">
                 <div className="flex gap-1.5">
                   <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                   <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                   <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                 </div>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Analyzing Context...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity" />
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl flex items-center p-2 shadow-2xl">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={selectedDoc ? `Ask about "${selectedDoc.title}"...` : "Select a document to begin analysis..."}
                className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-lg px-4"
              />
              <Button
                size="icon"
                disabled={!input.trim() || isLoading}
                onClick={handleSend}
                className="h-11 w-11 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transition-transform active:scale-95 disabled:grayscale"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-4">
            AI can make mistakes. Verify critical legal information with a qualified professional.
          </p>
        </div>
      </main>
    </div>
  );
}
