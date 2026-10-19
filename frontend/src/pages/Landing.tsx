import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import {
  Shield,
  FileText,
  Zap,
  GitCompare,
  MessageSquare,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Cpu,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Landing() {
  const [activeTab, setActiveTab] = useState<"risk" | "simplify" | "compare">("risk");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Shield,
      color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
      title: "Risk Radar & Compliance",
      description: "Automated clause-by-clause risk scoring that detects predatory indemnity, uncapped liability, and hidden termination penalties.",
    },
    {
      icon: Zap,
      color: "from-yellow-500/20 to-amber-600/20 text-yellow-400 border-yellow-500/30",
      title: "Plain-English Simplifier",
      description: "Instantly translates opaque legal jargon and dense paragraphs into everyday terms with key takeaway bullets.",
    },
    {
      icon: GitCompare,
      color: "from-amber-500/20 to-yellow-600/20 text-amber-300 border-amber-500/30",
      title: "Smart Contract Diffing",
      description: "Compare revisions side-by-side to highlight additions, omissions, and wording modifications with legal impact analysis.",
    },
    {
      icon: MessageSquare,
      color: "from-yellow-400/20 to-amber-500/20 text-yellow-300 border-yellow-400/30",
      title: "Contextual Legal Copilot",
      description: "Ask specific questions about dates, obligations, or non-compete covenants grounded directly in your uploaded documents.",
    },
  ];

  const metrics = [
    { value: "< 3s", label: "Analysis Speed per Document" },
    { value: "10x", label: "Faster Contract Turnaround" },
    { value: "0%", label: "Model Training on Customer Data" },
    { value: "100%", label: "Encrypted AES-256 Storage" },
  ];

  const faqs = [
    {
      q: "Does LegalSenser train AI models on my confidential contracts?",
      a: "Never. Your documents are processed in isolated sessions with zero retention for model training. All data is encrypted at rest using AES-256.",
    },
    {
      q: "What file formats does LegalSenser support?",
      a: "LegalSenser supports PDF, Microsoft Word (.docx), TXT, and high-resolution scanned contract images via integrated OCR.",
    },
    {
      q: "Can LegalSenser replace a licensed attorney?",
      a: "LegalSenser is an AI-powered legal assistant designed to accelerate comprehension, highlight risks, and surface buried clauses. It is recommended for preliminary review and workflow acceleration alongside qualified counsel.",
    },
    {
      q: "How does the contract comparison engine work?",
      a: "Our diff engine compares version A and B, detecting exact clause additions, deletions, and subtle phrasing adjustments, while categorizing the legal risk shift for each.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-amber-400/30 selection:text-amber-200 relative overflow-hidden">
      <Navbar />

      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[600px] right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[140px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 border border-amber-500/30 shadow-lg shadow-amber-500/10 mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Powered by Groq Llama 3 • Ultra-Fast Legal Intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tight max-w-5xl mx-auto leading-[1.1] mb-8"
        >
          Review Legal Contracts in{" "}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Seconds, Not Hours.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
        >
          LegalSenser automatically detects critical risk clauses, simplifies dense legal jargon into plain English, redlines contract revisions, and answers contextual questions in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black h-14 px-8 rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 text-lg gap-2"
            >
              Start Free Analysis
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button
              size="lg"
              variant="outline"
              className="bg-card/60 border-border hover:bg-card text-white h-14 px-8 rounded-xl text-lg font-semibold transition-all hover:border-amber-500/50"
            >
              Live Demo Workspace
            </Button>
          </Link>
        </motion.div>

        {/* Interactive Live Product Preview Widget */}
        <motion.div
          id="demo"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-5xl mx-auto rounded-3xl border border-amber-500/20 bg-card/80 backdrop-blur-xl p-2 shadow-2xl shadow-amber-500/5"
        >
          {/* Mock Window Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">Master_Services_Agreement_v3.pdf</span>
            </div>
            {/* Interactive demo tabs */}
            <div className="flex gap-1 bg-black p-1 rounded-lg border border-border/60">
              <button
                onClick={() => setActiveTab("risk")}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTab === "risk" ? "bg-amber-500 text-black shadow" : "text-muted-foreground hover:text-white"
                }`}
              >
                Risk Radar (3)
              </button>
              <button
                onClick={() => setActiveTab("simplify")}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTab === "simplify" ? "bg-amber-500 text-black shadow" : "text-muted-foreground hover:text-white"
                }`}
              >
                Plain English
              </button>
              <button
                onClick={() => setActiveTab("compare")}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTab === "compare" ? "bg-amber-500 text-black shadow" : "text-muted-foreground hover:text-white"
                }`}
              >
                Redline Changes
              </button>
            </div>
          </div>

          {/* Interactive Tab Body */}
          <div className="p-6 md:p-8 text-left grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[340px]">
            {/* Left: Original Contract Snippet */}
            <div className="p-5 rounded-2xl bg-black border border-border/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Original Clause 14.2</span>
                  <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 text-[10px] font-bold">
                    Uncapped Liability
                  </Badge>
                </div>
                <p className="font-mono text-xs text-slate-300 leading-relaxed">
                  "Provider shall defend, indemnify, and hold harmless Customer from and against any and all claims, damages, losses, and liabilities without limitation, including indirect, consequential, or punitive damages arising out of any breach of warranty or performance failure."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2 text-[11px] text-muted-foreground">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Extracted via Tesseract OCR Engine</span>
              </div>
            </div>

            {/* Right: AI Output according to active tab */}
            <div className="p-5 rounded-2xl bg-card border border-border flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === "risk" && (
                  <motion.div
                    key="risk"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Critical Exposure Flagged
                      </div>
                      <span className="text-xs font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full">
                        Risk Score: 92/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white">Issue:</strong> Clause imposes unlimited indemnity including consequential and punitive damages, exposing your organization to catastrophic liability.
                    </p>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                      <strong>AI Recommendation:</strong> Cap liability at 12 months fees paid and explicitly exclude consequential/punitive damages.
                    </div>
                  </motion.div>
                )}

                {activeTab === "simplify" && (
                  <motion.div
                    key="simplify"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <Zap className="w-4 h-4" />
                      Everyday Language Translation
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      "If something goes wrong or the software breaks, you are agreeing to pay for all of their losses with zero limit — even if the losses are indirect or disproportionate to what they paid you."
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• No dollar ceiling on damages</li>
                      <li>• Provider pays customer's legal defense fees</li>
                    </ul>
                  </motion.div>
                )}

                {activeTab === "compare" && (
                  <motion.div
                    key="compare"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                      <GitCompare className="w-4 h-4" />
                      Revision Delta Detected
                    </div>
                    <div className="text-xs space-y-2">
                      <div className="p-2 rounded bg-red-500/10 text-red-300 line-through">
                        - "...liability capped at aggregate fees paid over 12 months..."
                      </div>
                      <div className="p-2 rounded bg-amber-500/10 text-amber-300">
                        + "...liabilities without limitation, including indirect or punitive..."
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      <strong>Legal Impact:</strong> Supplier eliminated the liability cap in this version.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span>Confidence Score: 98.7%</span>
                <Link to="/signup" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                  Run on your documents →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Metrics Banner */}
      <section className="border-y border-border/60 bg-card/40 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text">
                {m.value}
              </p>
              <p className="text-xs md:text-sm font-semibold text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-400 mb-4 px-3 py-1 font-bold uppercase tracking-wider text-xs">
            Core Capabilities
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Everything You Need to Master Contracts
          </h2>
          <p className="text-muted-foreground text-lg">
            Built for startup founders, legal teams, and individuals who want clarity without paying thousands in hourly billables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Card
                key={i}
                className="bg-card/60 border-border/70 hover:border-amber-500/40 transition-all p-8 rounded-3xl relative overflow-hidden group backdrop-blur-sm"
              >
                <div className="flex items-start gap-5">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br border ${feat.color} shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{feat.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="max-w-7xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="rounded-3xl bg-card border border-border p-8 md:p-14 relative overflow-hidden">
          <div className="max-w-2xl">
            <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-400 mb-4 px-3 py-1 font-bold uppercase tracking-wider text-xs">
              Privacy First Guarantee
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Legal Data Remains Strictly Confidential
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed text-sm md:text-base">
              We know legal agreements contain highly sensitive intellectual property, compensation, and liability data. LegalSenser enforces zero data retention for AI training.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Zero model training on user files",
                "AES-256 at rest & TLS 1.3 in transit",
                "Instant document deletion on demand",
                "Scoped OAuth & email OTP security",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-400 mb-4 px-3 py-1 font-bold uppercase tracking-wider text-xs">
            Simple Pricing
          </Badge>
          <h2 className="text-4xl font-black text-white mb-4">Transparent Plans for Every Need</h2>
          <p className="text-muted-foreground">Start with our free tier, upgrade as your contract volume scales.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <Card className="bg-card/50 border-border p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Starter</h3>
              <p className="text-xs text-muted-foreground mb-6">For individuals & founders reviewing occasional contracts</p>
              <p className="text-4xl font-black text-white mb-6">$0 <span className="text-xs font-normal text-muted-foreground">/ forever</span></p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> 10 contracts per month</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Plain-English simplification</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Basic risk detection</li>
              </ul>
            </div>
            <Link to="/signup" className="mt-8">
              <Button variant="outline" className="w-full border-border hover:bg-card hover:border-amber-500/40 font-semibold">
                Get Started Free
              </Button>
            </Link>
          </Card>

          {/* Professional - Highlighted */}
          <Card className="bg-card border-2 border-amber-500 p-8 rounded-3xl flex flex-col justify-between relative shadow-2xl shadow-amber-500/15">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-[11px] font-black text-black uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Professional</h3>
              <p className="text-xs text-muted-foreground mb-6">For high-growth businesses and active procurement</p>
              <p className="text-4xl font-black text-white mb-6">$29 <span className="text-xs font-normal text-muted-foreground">/ month</span></p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Unlimited document analyses</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Redline contract comparison</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Contextual AI Copilot Q&A</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Priority Groq Llama 3 execution</li>
              </ul>
            </div>
            <Link to="/signup" className="mt-8">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black">
                Start 14-Day Trial
              </Button>
            </Link>
          </Card>

          {/* Enterprise */}
          <Card className="bg-card/50 border-border p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Enterprise</h3>
              <p className="text-xs text-muted-foreground mb-6">Custom workflows & dedicated legal fine-tuning</p>
              <p className="text-4xl font-black text-white mb-6">Custom</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Custom compliance playbooks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> Dedicated API access</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-400" /> SSO & role-based permissions</li>
              </ul>
            </div>
            <Link to="/signup" className="mt-8">
              <Button variant="outline" className="w-full border-border hover:bg-card hover:border-amber-500/40 font-semibold">
                Contact Sales
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-card border border-border cursor-pointer transition-colors hover:border-amber-500/30"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between font-bold text-white text-base">
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180 text-amber-400" : ""}`} />
              </div>
              {openFaq === i && (
                <p className="text-muted-foreground text-sm mt-3 pt-3 border-t border-border leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">LegalSenser</span>
            <span>•</span>
            <span>AI Legal Document Assistant</span>
          </div>
          <div>© {new Date().getFullYear()} LegalSenser Inc. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
