import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  User,
  Brain,
  FileText,
  Sparkles,
  Copy,
  Check,
  HelpCircle,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "What are the termination liabilities in this contract?",
  "Are there any uncapped indemnities or high risks?",
  "Summarize the confidentiality and IP ownership clauses.",
  "Which governing law and dispute jurisdiction apply?",
];

export default function Chat() {
  const { documentId } = useParams<{ documentId: string }>();
  const { documents, fetchDocuments, chatWithDocument, isLoading } = useDocumentStore();
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string>(documentId || "");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocuments();
    if (documentId) {
      setSelectedDocId(documentId);
    }
  }, [fetchDocuments, documentId]);

  useEffect(() => {
    if (selectedDocId) {
      const doc = documents.find(d => d._id === selectedDocId);
      setMessages([{
        id: "init",
        role: "assistant",
        content: `I am your Legal Copilot for "${doc?.title || 'this document'}". I have indexed its clauses and definitions. Ask me anything regarding liabilities, indemnities, obligations, or legal risks.`,
        timestamp: new Date()
      }]);
    } else {
      setMessages([{
        id: "init",
        role: "assistant",
        content: "Welcome to Legal Copilot. Select a contract from the dropdown above to begin context-aware QA, or ask a general legal interpretation question.",
        timestamp: new Date()
      }]);
    }
  }, [selectedDocId, documents]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const chatHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      }));

      const response = await chatWithDocument(text, selectedDocId, chatHistory);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.answer || response.data.content || "Analysis complete.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Unable to process the query against this document right now. Please check backend connection and retry.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const selectedDoc = documents.find(d => d._id === selectedDocId);

  return (
    <AppLayout noPadding fullWidth className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Context Selection Header */}
      <div className="px-6 py-3.5 border-b border-border/60 bg-black/60 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">Legal Copilot</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">Domain-tuned contractual QA engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Select value={selectedDocId} onValueChange={setSelectedDocId}>
            <SelectTrigger className="w-full sm:w-[280px] bg-black border-border text-white h-9 rounded-xl text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <SelectValue placeholder="Select contract to attach..." />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-white text-xs">
              {documents.map(doc => (
                <SelectItem key={doc._id} value={doc._id} className="text-xs">
                  {doc.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDoc && (
            <Badge variant="outline" className="hidden sm:inline-flex bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-bold py-1">
              Active Context
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[88%] md:max-w-[78%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.role === "user" 
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold" 
                    : "bg-card border border-amber-500/30 text-amber-400"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                </div>
                
                <div className={`space-y-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md relative group ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-tr-none" 
                      : "bg-card border border-border text-slate-200 rounded-tl-none backdrop-blur-sm"
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {msg.role === "assistant" && msg.id !== "init" && (
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="mt-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground hover:text-amber-400 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-amber-400" />
                            <span className="text-amber-400 font-bold">Copied to clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy answer</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1 font-mono">
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
              <div className="flex items-center gap-3 bg-card border border-border px-4 py-3 rounded-2xl rounded-tl-none">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-xs text-muted-foreground font-medium">
                  Reviewing contract clauses & precedents...
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Suggested Chips + Input Area */}
      <div className="px-4 md:px-8 pb-5 pt-2 bg-black/80 backdrop-blur-md border-t border-border flex-shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Prompt Suggestion Chips */}
          {messages.length <= 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 flex-shrink-0">
                <HelpCircle className="w-3 h-3 text-amber-400" /> Suggestions:
              </span>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-card hover:bg-black border border-border hover:border-amber-500/50 text-muted-foreground hover:text-amber-300 text-[11px] whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-center bg-card border border-border focus-within:border-amber-500/60 rounded-2xl p-1.5 shadow-lg transition-colors">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={selectedDoc ? `Ask Copilot about "${selectedDoc.title}"...` : "Select a document or ask general legal question..."}
              className="flex-1 bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-xs sm:text-sm px-3 placeholder:text-muted-foreground/50"
            />
            <Button
              size="sm"
              disabled={!input.trim() || isLoading}
              onClick={() => handleSend()}
              className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold shadow-md shadow-amber-500/20 transition-transform active:scale-95 disabled:grayscale"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground">
            LegalSenser provides AI legal analysis and does not constitute formal attorney-client counsel.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
