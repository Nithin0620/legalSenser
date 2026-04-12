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
} from "lucide-react";
import { useDocumentStore } from "@/store/documentStore";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
      // The store compare action takes document content, but we need to fetch them or pass IDs if backend handles it
      // Let's assume the store compare takes text for now, but I'll update it to take IDs if that's what backend expects
      const result = await compare(doc1Id, doc2Id);
      setComparisonResult(result.data);
    } catch (err: any) {
      setError(err.message || "Failed to compare documents.");
    }
  };

  const getDocTitle = (id: string) => documents.find(d => d._id === id)?.title || "Selected Document";

  return (
    <div className="min-h-screen md:ml-64 relative z-0">
      <Sidebar />
      
      <div className="p-6 md:p-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Compare Documents</h1>
            <p className="text-slate-400">Select two documents to analyze changes, removals, and additions.</p>
          </motion.div>

          {/* Selection Area */}
          <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4 mb-12">
            <Card className="md:col-span-5 bg-slate-900 border-white/5 backdrop-blur-sm">
              <CardHeader className="pb-3 text-center">
                <CardTitle className="text-blue-400">Document A</CardTitle>
                <CardDescription>Original or older version</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={doc1Id} onValueChange={setDoc1Id}>
                  <SelectTrigger className="bg-slate-800 border-white/10 text-white h-12">
                    <SelectValue placeholder="Select a document" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                    {documents.map(doc => (
                      <SelectItem key={doc._id} value={doc._id} disabled={doc._id === doc2Id}>
                        {doc.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="md:col-span-1 flex justify-center">
              <div className="p-3 bg-slate-800 rounded-full border border-white/10">
                <ArrowRight className="w-6 h-6 text-slate-500" />
              </div>
            </div>

            <Card className="md:col-span-5 bg-slate-900 border-white/5 backdrop-blur-sm">
              <CardHeader className="pb-3 text-center">
                <CardTitle className="text-purple-400">Document B</CardTitle>
                <CardDescription>Revised or newer version</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={doc2Id} onValueChange={setDoc2Id}>
                  <SelectTrigger className="bg-slate-800 border-white/10 text-white h-12">
                    <SelectValue placeholder="Select a document" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                    {documents.map(doc => (
                      <SelectItem key={doc._id} value={doc._id} disabled={doc._id === doc1Id}>
                        {doc.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mb-12">
            <Button 
              size="lg"
              disabled={!doc1Id || !doc2Id || isLoading}
              onClick={handleCompare}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 h-14 rounded-full font-bold shadow-xl shadow-blue-500/20 gap-3"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing Differences...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Compare with Legal AI
                </>
              )}
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 mb-8"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          {/* Results Area */}
          <AnimatePresence>
            {comparisonResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Comparison Results</h2>
                </div>

                {/* Summary Card */}
                <Card className="bg-slate-900 border-white/5 backdrop-blur-sm overflow-hidden">
                   <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 w-full" />
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Comparison Executive Summary</CardTitle>
                    <CardDescription>High-level overview of key changes between Version A and B</CardDescription>
                  </CardHeader>
                  <CardContent className="text-slate-300 leading-relaxed text-lg">
                    {comparisonResult.summary}
                  </CardContent>
                </Card>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Added Clauses */}
                  <Card className="bg-slate-900/50 border-green-500/20 backdrop-blur-sm">
                    <CardHeader className="bg-green-500/5 border-b border-green-500/10">
                      <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Added Clauses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {comparisonResult.added?.length > 0 ? comparisonResult.added.map((item: string, i: number) => (
                          <div key={i} className="p-4 bg-green-500/5 border border-green-500/10 rounded-lg text-slate-300 text-sm">
                            {item}
                          </div>
                        )) : (
                          <p className="text-slate-500 text-sm italic">No significant additions detected.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Removed Clauses */}
                  <Card className="bg-slate-900/50 border-red-500/20 backdrop-blur-sm">
                    <CardHeader className="bg-red-500/5 border-b border-red-500/10">
                      <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5 transform -rotate-45" />
                        Removed Clauses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {comparisonResult.removed?.length > 0 ? comparisonResult.removed.map((item: string, i: number) => (
                          <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg text-slate-300 text-sm">
                            {item}
                          </div>
                        )) : (
                          <p className="text-slate-500 text-sm italic">No significant removals detected.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Modified Sections */}
                <Card className="bg-slate-900/50 border-blue-500/20 backdrop-blur-sm">
                  <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
                    <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                      <FileSearch className="w-5 h-5" />
                      Key Modifications & Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {comparisonResult.modified?.length > 0 ? comparisonResult.modified.map((item: any, i: number) => (
                        <div key={i} className="p-6 bg-slate-800/50 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-blue-500 text-white">Modification {i+1}</Badge>
                            <h4 className="font-bold text-white text-lg">{item.clause || "Clause Update"}</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-900 rounded-lg border border-white/5">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Change Description</p>
                              <p className="text-slate-300 text-sm">{item.change}</p>
                            </div>
                            <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                              <p className="text-xs font-bold text-blue-400 uppercase mb-2">Legal Impact</p>
                              <p className="text-slate-200 text-sm font-medium">{item.impact}</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-slate-500 text-sm italic">No significant modifications detected.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

              </motion.div>
            )}
          </AnimatePresence>

          {!comparisonResult && !isLoading && (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <FileSearch className="w-12 h-12 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Select Documents to Start</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Compare older contracts with new versions to instantly identify modified risks and changes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
