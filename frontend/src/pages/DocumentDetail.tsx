import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Sparkles,
  GitCompare,
  Check,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AppLayout } from "@/components/AppLayout";

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      getDocument(id);
    }
  }, [id]);

  const handleAiAction = useCallback(async (action: "simplify" | "summarize" | "analyzeRisk") => {
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
  }, [id, simplify, summarize, analyzeRisk]);

  const handleDownload = () => {
    if (!selectedDocument) return;
    const content = (selectedDocument as any).originalText || "";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedDocument.title || "document"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this document permanently?")) {
      await (useDocumentStore.getState().deleteDocument)(id);
      navigate("/documents");
    }
  };

  if (isLoading && !selectedDocument) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader className="w-10 h-10 text-amber-400 animate-spin" />
          <p className="text-muted-foreground font-medium text-sm">Loading contract intelligence...</p>
        </div>
      </AppLayout>
    );
  }

  if (!selectedDocument) {
    return (
      <AppLayout>
        <div className="text-center max-w-md mx-auto py-24">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Contract Not Found</h2>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn't locate this document. It may have been archived or deleted.
          </p>
          <Button onClick={() => navigate("/documents")} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-xl">
            Return to Library
          </Button>
        </div>
      </AppLayout>
    );
  }

  const wordCount = (selectedDocument as any).originalText?.split(/\s+/).length || 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Document Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/documents")}
              className="p-2 bg-card hover:bg-black rounded-xl text-muted-foreground hover:text-white transition-colors border border-border flex-shrink-0"
              title="Back to library"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                  {selectedDocument.documentType || "Contract"}
                </Badge>
                <span className="text-xs text-muted-foreground">v{selectedDocument.version || 1}.0</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{wordCount.toLocaleString()} words</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight truncate">
                {selectedDocument.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-9 px-3 border-border hover:border-amber-500/50 text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-9 px-3 border-border hover:border-amber-500/50 text-xs gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </Button>
            <Link to={`/chat/${selectedDocument._id}`}>
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black rounded-xl h-9 px-4 text-xs font-black shadow-md shadow-amber-500/20 gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Copilot</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Tabs & Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Analysis Column */}
          <div className="lg:col-span-8 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-black border border-border p-1 rounded-xl h-auto flex flex-wrap gap-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black rounded-lg text-xs font-bold py-2 px-3 gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="risks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black rounded-lg text-xs font-bold py-2 px-3 gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Risk Radar</span>
                </TabsTrigger>
                <TabsTrigger value="simplify" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black rounded-lg text-xs font-bold py-2 px-3 gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Plain English</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-black rounded-lg text-xs font-bold py-2 px-3 gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Summary</span>
                </TabsTrigger>
                <TabsTrigger value="original" className="data-[state=active]:bg-card data-[state=active]:text-white rounded-lg text-xs font-bold py-2 px-3 gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Original Document</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="bg-card border-border p-4">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Classification</CardDescription>
                        <CardTitle className="text-lg font-bold text-white capitalize mt-1">{selectedDocument.documentType || "Contract"}</CardTitle>
                      </Card>
                      <Card className="bg-card border-border p-4">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Word Count</CardDescription>
                        <CardTitle className="text-lg font-bold text-white mt-1">{wordCount.toLocaleString()}</CardTitle>
                      </Card>
                      <Card className="bg-card border-border p-4">
                        <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Uploaded</CardDescription>
                        <CardTitle className="text-lg font-bold text-white mt-1">{new Date(selectedDocument.uploadedAt).toLocaleDateString()}</CardTitle>
                      </Card>
                    </div>

                    <Card className="bg-card border-border backdrop-blur-sm p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-amber-400" />
                        <h3 className="text-base font-bold text-white">AI Analysis Quick Launch</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mb-6">
                        Trigger deep legal analysis modules powered by LegalSenser's domain models.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button
                          onClick={() => handleAiAction("analyzeRisk")}
                          disabled={isProcessing === "analyzeRisk"}
                          className="h-auto py-5 flex-col gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-xl transition-all"
                        >
                          {isProcessing === "analyzeRisk" ? <Loader className="w-5 h-5 animate-spin text-amber-400" /> : <Shield className="w-5 h-5" />}
                          Audit Risk Radar
                        </Button>
                        <Button
                          onClick={() => handleAiAction("simplify")}
                          disabled={isProcessing === "simplify"}
                          className="h-auto py-5 flex-col gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-bold text-xs rounded-xl transition-all"
                        >
                          {isProcessing === "simplify" ? <Loader className="w-5 h-5 animate-spin text-yellow-400" /> : <Zap className="w-5 h-5" />}
                          Simplify Legalese
                        </Button>
                        <Button
                          onClick={() => handleAiAction("summarize")}
                          disabled={isProcessing === "summarize"}
                          className="h-auto py-5 flex-col gap-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-200 font-bold text-xs rounded-xl transition-all"
                        >
                          {isProcessing === "summarize" ? <Loader className="w-5 h-5 animate-spin text-amber-300" /> : <Sparkles className="w-5 h-5" />}
                          Executive Summary
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Risk Radar Tab */}
                {activeTab === "risks" && (
                  <div>
                    {aiData.risks ? (
                      <div className="space-y-4">
                        <div className="bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
                          <div className="bg-amber-500/10 p-4 border-b border-amber-500/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-amber-400" />
                              <span className="text-sm font-bold text-white">Risk Radar Audit</span>
                              {aiData.risks.overallRisk && (
                                <Badge className={cn(
                                  "border-none text-xs font-bold",
                                  aiData.risks.overallRisk.toLowerCase() === "high" || aiData.risks.overallRisk.toLowerCase() === "critical"
                                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                )}>
                                  {aiData.risks.overallRisk} Severity ({aiData.risks.riskScore ?? 0}/100)
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 font-bold">
                              {(aiData.risks.risks || aiData.risks.clauseRisks || []).length} Clause Findings
                            </Badge>
                          </div>

                          <div className="divide-y divide-border/60">
                            {(aiData.risks.risks || aiData.risks.clauseRisks || []).map((risk: any, i: number) => {
                              const explanation = risk.explanation || risk.reasoning || "Risk detected in this clause";
                              const recommendation = risk.recommendation || (aiData.risks.recommendations?.[i]?.action) || "Review this clause carefully with legal counsel.";
                              const level = (risk.riskLevel || "medium").toLowerCase();
                              return (
                                <div key={i} className="p-5 hover:bg-black/40 transition-colors">
                                  <div className="flex items-start justify-between gap-4 mb-3">
                                    <h4 className="font-bold text-white text-sm">{risk.clause || `Clause Analysis #${i + 1}`}</h4>
                                    <Badge className={cn(
                                      "capitalize border-none text-[11px] font-bold px-2 py-0.5",
                                      level === 'high' || level === 'critical' ? "bg-red-500/20 text-red-400" :
                                      level === 'medium' ? "bg-amber-500/20 text-amber-400" :
                                      "bg-emerald-500/20 text-emerald-400"
                                    )}>
                                      {risk.riskLevel || "Medium"} Risk
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div className="p-3 rounded-xl bg-black border border-border">
                                      <p className="font-bold text-muted-foreground uppercase tracking-wider text-[10px] mb-1">Issue Identified</p>
                                      <p className="text-slate-300 leading-relaxed">{explanation}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-black border border-amber-500/30">
                                      <p className="font-bold text-amber-400 uppercase tracking-wider text-[10px] mb-1">Recommended Counter-Measure</p>
                                      <p className="text-slate-300 leading-relaxed">{recommendation}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl p-6">
                        <Shield className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-base font-bold text-white mb-1">No Risk Radar Run Yet</h3>
                        <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                          Automatically scan for predatory indemnities, unlimited liability, or IP transfer clauses.
                        </p>
                        <Button onClick={() => handleAiAction("analyzeRisk")} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black text-xs h-9 px-4 rounded-xl font-bold">
                          Run Risk Radar Now
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Plain English Tab */}
                {activeTab === "simplify" && (
                  <div>
                    {aiData.simplified ? (
                      <div className="bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="bg-amber-500/10 p-4 border-b border-amber-500/20 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                            <Zap className="w-4 h-4" />
                            <span>Plain-English Translation</span>
                          </div>
                          <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400 font-bold">
                            Legalese Eliminated
                          </Badge>
                        </div>
                        <div className="p-6 text-slate-300 space-y-5 text-sm leading-relaxed">
                          <p className="text-white font-bold text-base">
                            {aiData.simplified.title || selectedDocument.title}
                          </p>
                          <div className="whitespace-pre-wrap bg-black p-4 rounded-xl border border-border text-xs sm:text-sm">
                            {aiData.simplified.summary || aiData.simplified.simplifiedText}
                          </div>
                          {((aiData.simplified.points || aiData.simplified.simplifiedPoints)?.length > 0) && (
                            <div className="space-y-2.5 pt-2">
                              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Key Clauses Simplified</h4>
                              <div className="space-y-2">
                                {(aiData.simplified.points || aiData.simplified.simplifiedPoints).map((point: string, i: number) => (
                                  <div key={i} className="flex gap-2.5 items-start p-2.5 rounded-lg bg-black border border-border text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                                    <span className="text-slate-300">{point}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl p-6">
                        <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-base font-bold text-white mb-1">No Plain English Version Yet</h3>
                        <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                          Transform Latin legalese and convoluted phrasing into clear, readable language.
                        </p>
                        <Button onClick={() => handleAiAction("simplify")} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black text-xs h-9 px-4 rounded-xl font-bold">
                          Translate to Plain English
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary Tab */}
                {activeTab === "summary" && (
                  <div>
                    {aiData.summary ? (
                      <Card className="bg-card border-border backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-amber-500/10 border-b border-amber-500/20 p-4">
                          <CardTitle className="text-amber-300 text-sm font-bold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            Executive Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-black p-4 rounded-xl border border-border">
                            {aiData.summary.summary}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl p-6">
                        <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-base font-bold text-white mb-1">No Summary Generated Yet</h3>
                        <p className="text-xs text-muted-foreground mb-4 max-w-sm mx-auto">
                          Extract obligations, milestones, expiration dates, and key considerations in one glance.
                        </p>
                        <Button onClick={() => handleAiAction("summarize")} className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-black text-xs h-9 px-4 rounded-xl font-bold">
                          Generate Executive Summary
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Original Text Tab */}
                {activeTab === "original" && (
                  <Card className="bg-card border-border backdrop-blur-sm overflow-hidden">
                    <div className="p-3.5 bg-black border-b border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>Raw Contract Content</span>
                      <span className="font-mono text-amber-400">{wordCount} words</span>
                    </div>
                    <ScrollArea className="h-[550px] w-full p-6">
                      <div className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-mono select-text">
                        {(selectedDocument as any).originalText || "No text content available."}
                      </div>
                    </ScrollArea>
                  </Card>
                )}
              </div>
            </Tabs>
          </div>

          {/* Right Rail Info Column */}
          <div className="lg:col-span-4 space-y-5">
            {/* Metadata Card */}
            <Card className="bg-card border-border backdrop-blur-sm p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Info className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Contract Details</h3>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Document Type</span>
                  <span className="text-white capitalize font-semibold">{selectedDocument.documentType || "Contract"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Version</span>
                  <span className="text-white font-mono">v{selectedDocument.version || 1}.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Indexed On</span>
                  <span className="text-white">{new Date(selectedDocument.uploadedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Parser Status</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Indexed
                  </span>
                </div>
              </div>
            </Card>

            {/* Compare Versions Card */}
            <Card className="bg-card border border-border backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <GitCompare className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Compare Redlines</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Compare this contract with another version or counterparty redline.
              </p>
              <Link to="/compare">
                <Button variant="outline" size="sm" className="w-full text-xs border-border hover:border-amber-500/50 hover:bg-amber-500/10 text-white rounded-xl font-bold">
                  Open Comparison Tool
                </Button>
              </Link>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-destructive/5 border-destructive/20 p-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleDelete}
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-xs gap-2 rounded-xl font-bold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Contract from Repository
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
