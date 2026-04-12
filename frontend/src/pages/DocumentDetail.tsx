import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Shield,
  Zap,
  AlignLeft,
  MessageSquare,
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader,
  Brain,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDocument, selectedDocument, isLoading, simplify, summarize, analyzeRisk } = useDocumentStore();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [aiData, setAiData] = useState<any>({
    simplified: null,
    summary: null,
    risks: null,
  });
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getDocument(id);
    }
  }, [id, getDocument]);

  const handleAiAction = async (action: "simplify" | "summarize" | "analyzeRisk") => {
    if (!id) return;
    setIsProcessing(action);
    try {
      let result;
      if (action === "simplify") {
        result = await simplify(id);
        setAiData((prev: any) => ({ ...prev, simplified: result.data }));
        setActiveTab("simplify");
      } else if (action === "summarize") {
        result = await summarize(id);
        setAiData((prev: any) => ({ ...prev, summary: result.data }));
        setActiveTab("summary");
      } else if (action === "analyzeRisk") {
        result = await analyzeRisk(id);
        setAiData((prev: any) => ({ ...prev, risks: result.data }));
        setActiveTab("risks");
      }
    } catch (error) {
      console.error(`AI Action ${action} failed:`, error);
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading && !selectedDocument) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-slate-400 animate-pulse text-lg">Loading your document...</p>
        </div>
      </div>
    );
  }

  if (!selectedDocument) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Document Not Found</h2>
          <p className="text-slate-400 mb-6">We couldn't find the document you're looking for. It might have been deleted.</p>
          <Button onClick={() => navigate("/documents")} className="bg-blue-600 hover:bg-blue-700">
            Back to Documents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:ml-64 relative z-0">
      <Sidebar />
      
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ x: -2 }}
              onClick={() => navigate("/documents")}
              className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-white transition-all border border-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-2 py-0">
                  {selectedDocument.documentType?.toUpperCase()}
                </Badge>
                <span className="text-xs text-slate-500">v{selectedDocument.version}</span>
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                {selectedDocument.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
              <Download className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
              <Share2 className="w-5 h-5" />
            </Button>
            <div className="w-[1px] h-8 bg-white/10 mx-1" />
            <Link to={`/chat/${selectedDocument._id}`}>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 gap-2 font-medium">
                <MessageSquare className="w-4 h-4" />
                Chat with AI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Analysis Column */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-slate-900/50 border border-white/5 p-1 h-auto flex-wrap sm:flex-nowrap">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="simplify" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Simplify</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="summary" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white py-2">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" />
                    <span>Summary</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="risks" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white py-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Risks</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="original" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Original</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <div className="mt-8 min-h-[500px]">
                <AnimatePresence mode="wait">
                  {/* Overview TabContent Content handled by direct div for layout control */}
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-900 border-white/5">
                          <CardHeader className="pb-2">
                            <CardDescription className="text-slate-500">Document Type</CardDescription>
                            <CardTitle className="text-xl text-white capitalize">{selectedDocument.documentType}</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card className="bg-slate-900 border-white/5">
                          <CardHeader className="pb-2">
                            <CardDescription className="text-slate-500">Word Count</CardDescription>
                            <CardTitle className="text-xl text-white">{(selectedDocument as any).originalText?.split(/\s+/).length || 0}</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card className="bg-slate-900 border-white/5">
                          <CardHeader className="pb-2">
                            <CardDescription className="text-slate-500">Uploaded On</CardDescription>
                            <CardTitle className="text-xl text-white">{new Date(selectedDocument.uploadedAt).toLocaleDateString()}</CardTitle>
                          </CardHeader>
                        </Card>
                      </div>

                      <Card className="bg-slate-900/30 border-white/5 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            <Brain className="w-5 h-5 text-blue-400" />
                            AI Insights Overview
                          </CardTitle>
                          <CardDescription>Select an action below to generate insights</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Button 
                            onClick={() => handleAiAction("simplify")} 
                            disabled={isProcessing === "simplify"}
                            className="h-auto py-6 flex-col gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 transition-all font-semibold"
                          >
                            {isProcessing === "simplify" ? <Loader className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                            Simplify Text
                          </Button>
                          <Button 
                            onClick={() => handleAiAction("summarize")} 
                            disabled={isProcessing === "summarize"}
                            className="h-auto py-6 flex-col gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 transition-all font-semibold"
                          >
                            {isProcessing === "summarize" ? <Loader className="w-6 h-6 animate-spin" /> : <AlignLeft className="w-6 h-6" />}
                            Generate Summary
                          </Button>
                          <Button 
                            onClick={() => handleAiAction("analyzeRisk")} 
                            disabled={isProcessing === "analyzeRisk"}
                            className="h-auto py-6 flex-col gap-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 transition-all font-semibold"
                          >
                            {isProcessing === "analyzeRisk" ? <Loader className="w-6 h-6 animate-spin" /> : <Shield className="w-6 h-6" />}
                            Detect Risks
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === "simplify" && (
                    <motion.div
                      key="simplify"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {aiData.simplified ? (
                        <div className="space-y-6">
                          <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden">
                            <div className="bg-purple-600/20 p-4 border-b border-purple-500/20">
                              <h3 className="font-bold text-purple-300 flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Simplified Version
                              </h3>
                            </div>
                            <div className="p-6 text-slate-300 leading-relaxed space-y-6">
                              <p className="text-xl font-medium text-white mb-4">{aiData.simplified.title}</p>
                              <div className="whitespace-pre-wrap">{aiData.simplified.summary}</div>
                              <div className="space-y-3 mt-8">
                                <h4 className="text-white font-bold text-lg">Key Clauses (Simplified)</h4>
                                <ul className="space-y-4">
                                  {aiData.simplified.points?.map((point: string, i: number) => (
                                    <li key={i} className="flex gap-3 items-start group">
                                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 flex-shrink-0 group-hover:scale-150 transition-all" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <Zap className="w-16 h-16 text-slate-700 mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">No Simplified Version Yet</h3>
                          <p className="text-slate-400 mb-6 max-w-sm">Use the AI to translate complex legal jargon into plain, clear English.</p>
                          <Button onClick={() => handleAiAction("simplify")} className="bg-purple-600">
                            Simplify Now
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "summary" && (
                    <motion.div
                      key="summary"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {aiData.summary ? (
                        <Card className="bg-slate-900 border-white/5">
                          <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-white flex items-center gap-2">
                              <AlignLeft className="w-5 h-5 text-indigo-400" />
                              Document Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6">
                            <h3 className="text-2xl font-bold text-white mb-4">{aiData.summary.title}</h3>
                            <div className="prose prose-invert max-w-none text-slate-300">
                              {aiData.summary.summary}
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <AlignLeft className="w-16 h-16 text-slate-700 mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">No Summary Generated</h3>
                          <p className="text-slate-400 mb-6 max-w-sm">Get a high-level overview of everything hidden in this document.</p>
                          <Button onClick={() => handleAiAction("summarize")} className="bg-indigo-600">
                            Generate Summary
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "risks" && (
                    <motion.div
                      key="risks"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {aiData.risks ? (
                        <div className="space-y-6">
                          <div className="bg-slate-900 rounded-xl border border-white/5 overflow-hidden">
                            <div className="bg-orange-600/20 p-4 border-b border-orange-500/20 flex items-center justify-between">
                              <h3 className="font-bold text-orange-300 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Risk Analysis
                              </h3>
                              <Badge className="bg-orange-500 text-white border-none">
                                {aiData.risks.risks?.length || 0} Issues Detected
                              </Badge>
                            </div>
                            <div className="p-0">
                              {aiData.risks.risks?.map((risk: any, i: number) => (
                                <div key={i} className="p-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                  <div className="flex items-start justify-between gap-4 mb-3">
                                    <h4 className="font-bold text-white text-lg">{risk.clause || "Critical Clause"}</h4>
                                    <Badge className={cn(
                                      "capitalize border-none",
                                      risk.riskLevel === 'high' ? "bg-red-500/20 text-red-400" :
                                      risk.riskLevel === 'medium' ? "bg-orange-500/20 text-orange-400" :
                                      "bg-green-500/20 text-green-400"
                                    )}>
                                      {risk.riskLevel} Risk
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">The Issue</p>
                                      <p className="text-slate-300 text-sm leading-relaxed">{risk.explanation}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommendation</p>
                                      <p className="text-slate-300 text-sm leading-relaxed">{risk.recommendation}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                       ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <Shield className="w-16 h-16 text-slate-700 mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">No Risk Analysis Run</h3>
                          <p className="text-slate-400 mb-6 max-w-sm">Automatically scan for predatory clauses or unfavorable terms.</p>
                          <Button onClick={() => handleAiAction("analyzeRisk")} className="bg-orange-600">
                            Detect Risks
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "original" && (
                    <motion.div
                      key="original"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Card className="bg-slate-900 border-white/5 overflow-hidden">
                        <ScrollArea className="h-[600px] w-full p-6">
                          <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                            {(selectedDocument as any).originalText}
                          </div>
                        </ScrollArea>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </div>

          {/* Sidebar Info Column */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-slate-900 border-white/5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-4 border-b border-white/5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  Quick Summary
                </h3>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Document Type</span>
                  <span className="text-slate-200 capitalize">{selectedDocument.documentType}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">File Size</span>
                  <span className="text-slate-200">{(selectedDocument as any).fileSize ? ((selectedDocument as any).fileSize / 1024).toFixed(1) + ' KB' : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Text Extraction</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Success
                  </span>
                </div>
                <div className="w-full h-[1px] bg-white/5" />
                <p className="text-xs text-slate-500 italic">
                  This document was analyzed by LegalSenser AI on {new Date().toLocaleDateString()}. AI results may vary in accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-white/5 border overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg text-white">Compare Document</CardTitle>
                <CardDescription>Upload a newer version to see changes</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/compare">
                  <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white">
                    Compare Versions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-red-500/5 border-red-500/10 border p-4">
              <Button 
                variant="ghost" 
                className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Document
              </Button>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
