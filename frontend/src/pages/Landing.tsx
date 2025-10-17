import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { FileText, MessageSquare, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Simplify Documents",
    description: "Transform complex legal documents into easy-to-understand summaries with AI.",
  },
  {
    icon: MessageSquare,
    title: "Chat with Policy",
    description: "Ask questions and get instant answers about your uploaded documents.",
  },
  {
    icon: Globe,
    title: "Translate to Local Language",
    description: "Understand policies in your native language with accurate translations.",
  },
  {
    icon: Shield,
    title: "Secure Cloud Storage",
    description: "Your documents are encrypted and stored securely in the cloud.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container relative py-24 md:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl animate-float" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            Making Laws Understandable for Everyone
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up">
            CivicAI uses advanced AI to simplify complex legal documents and policies,
            making them accessible to everyone.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>

        {/* Demo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <Card className="p-8 bg-card/50 backdrop-blur border-primary/20 shadow-xl shadow-primary/10">
            <div className="flex items-center justify-center gap-8">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </div>
              <div className="text-4xl">→</div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-primary/30 rounded" />
                <div className="h-4 bg-primary/30 rounded" />
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to understand complex legal documents
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg hover:shadow-primary/10 transition-all group hover:border-primary/50">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                CivicAI makes legal documents accessible to everyone through the power of AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">support@civicai.com</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <div className="flex gap-4">
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">LinkedIn</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary">GitHub</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 CivicAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
