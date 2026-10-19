import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ArrowRight,
  Plus,
  ArrowLeft,
  Loader,
  Brain,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Sparkles,
  GitCompare,
  Minus,
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/AppLayout";

export default function Compare() {
  const { documents, fetchDocuments, compare, isLoading } = useDocumentStore();
  
  const [doc1Id, setDoc1Id] = useState<string>("");
  const [doc2Id, setDoc2Id] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCompare = async () => {
    if (!doc1Id || !doc2Id) {
      setError("Please select two documents to compare.");
      return;
    }
    setError(null);
    try {
      const result = await compare(doc1Id, doc2Id);
      setComparisonResult(result.data);
    } catch (err: any) {
      setError(err.message || "Failed to compare documents.");
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-border/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            Redline & Counterparty Comparison
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Contract Version Comparison</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Select two document versions to audit added clauses, omitted protections, and modified terms.
          </p>
        </div>

        {/* Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4">
          <Card className="md:col-span-5 bg-card border-border backdrop-blur-md p-5">
            <div className="mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Version A (Baseline)</span>
              <p className="text-xs text-muted-foreground">Original or earlier contract version</p>
            </div>
            <Select value={doc1Id} onValueChange={setDoc1Id}>
              <SelectTrigger className="bg-black border-border text-white h-11 text-xs sm:text-sm rounded-xl">
                <SelectValue placeholder="Select baseline contract..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-white">
                {documents.map(doc => (
                  <SelectItem key={doc._id} value={doc._id} disabled={doc._id === doc2Id} className="text-xs sm:text-sm">
                    {doc.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <div className="p-2.5 bg-black border border-border rounded-full text-amber-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <Card className="md:col-span-5 bg-card border-border backdrop-blur-md p-5">
            <div className="mb-3">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Version B (Counterparty / Revision)</span>
              <p className="text-xs text-muted-foreground">Revised or incoming redline draft</p>
            </div>
            <Select value={doc2Id} onValueChange={setDoc2Id}>
              <SelectTrigger className="bg-black border-border text-white h-11 text-xs sm:text-sm rounded-xl">
                <SelectValue placeholder="Select revision contract..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-white">
                {documents.map(doc => (
                  <SelectItem key={doc._id} value={doc._id} disabled={doc._id === doc1Id} className="text-xs sm:text-sm">
                    {doc.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg"
            disabled={!doc1Id || !doc2Id || isLoading}
            onClick={handleCompare}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black px-8 h-12 rounded-xl font-black text-sm shadow-lg shadow-amber-500/20 gap-2 transition-all hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin text-black" />
                Synthesizing Redline Diffs...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run AI Redline Comparison
              </>
            )}
          </Button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center gap-3 text-destructive text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Results Area */}
        <AnimatePresence>
          {comparisonResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-4"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Redline Findings & Impact Analysis</h2>
                  <p className="text-xs text-muted-foreground">Computed differences across contractual provisions</p>
                </div>
              </div>

              {/* Summary Card */}
              <Card className="bg-card border-border backdrop-blur-md overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-amber-500 to-yellow-500 w-full" />
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-base text-white font-bold">Executive Comparison Summary</CardTitle>
                  <CardDescription className="text-xs">Holistic evaluation of shifts in risk and obligations</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {comparisonResult.summary || comparisonResult.summaryPara}
                </CardContent>
              </Card>

              {/* Detailed Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Added Clauses */}
                <Card className="bg-card border-emerald-500/30 backdrop-blur-md">
                  <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 p-4">
                    <CardTitle className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      Added Clauses in Version B
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {(comparisonResult.added || comparisonResult.addedClauses)?.length > 0 ? (
                      (comparisonResult.added || comparisonResult.addedClauses).map((item: string, i: number) => (
                        <div key={i} className="p-3 bg-black border border-border rounded-xl text-slate-300 text-xs leading-relaxed">
                          {item}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-xs italic py-2">No new clauses introduced.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Removed Clauses */}
                <Card className="bg-card border-destructive/30 backdrop-blur-md">
                  <CardHeader className="bg-destructive/10 border-b border-destructive/20 p-4">
                    <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                      <Minus className="w-4 h-4 text-destructive" />
                      Omitted / Struck Clauses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {(comparisonResult.removed || comparisonResult.removedClauses)?.length > 0 ? (
                      (comparisonResult.removed || comparisonResult.removedClauses).map((item: string, i: number) => (
                        <div key={i} className="p-3 bg-black border border-border rounded-xl text-slate-300 text-xs leading-relaxed">
                          {item}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-xs italic py-2">No clauses omitted.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Modified Sections */}
              <Card className="bg-card border-border backdrop-blur-md overflow-hidden">
                <CardHeader className="bg-amber-500/10 border-b border-amber-500/20 p-4">
                  <CardTitle className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-amber-400" />
                    Modified Provisions & Legal Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {(comparisonResult.modified || comparisonResult.modifiedClauses)?.length > 0 ? (
                    (comparisonResult.modified || comparisonResult.modifiedClauses).map((item: any, i: number) => {
                      const clauseTitle = item.clause || `Clause Modification #${i + 1}`;
                      const changeText = item.change || (item.old && item.new ? `Replaced "${item.old}" with "${item.new}"` : typeof item === "string" ? item : JSON.stringify(item));
                      const impactText = item.impact || comparisonResult.impactAnalysis || "Alters terms or risk profile.";
                      return (
                        <div key={i} className="p-4 bg-black border border-border rounded-xl space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] font-bold">
                              Shift #{i + 1}
                            </Badge>
                            <h4 className="font-bold text-white text-xs sm:text-sm">{clauseTitle}</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-card rounded-lg border border-border">
                              <p className="font-bold text-muted-foreground uppercase text-[10px] mb-1">Difference</p>
                              <p className="text-slate-300 leading-relaxed">{changeText}</p>
                            </div>
                            <div className="p-3 bg-card rounded-lg border border-amber-500/20">
                              <p className="font-bold text-amber-400 uppercase text-[10px] mb-1">Legal Impact</p>
                              <p className="text-slate-200 leading-relaxed font-medium">{impactText}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground text-xs italic py-2">No clause modifications detected.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!comparisonResult && !isLoading && (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl p-6">
            <GitCompare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Ready for Comparison</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Choose two contracts above to generate instant side-by-side legal diffs and risk exposure shifts.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
