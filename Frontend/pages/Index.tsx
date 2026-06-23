import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
  Feather,
  FileSearch,
  Bot,
  Sparkles,
  Languages,
  Type,
  ArrowRight,
  Star,
  Play,
} from "lucide-react";

const tools = [
  {
    icon: FileSearch,
    name: "Plagiarism Checker",
    description: "Detect copied content and ensure originality",
    path: "/plagiarism-checker",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Bot,
    name: "AI Content Detector",
    description: "Identify AI-generated text with high accuracy",
    path: "/ai-detector",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Type,
    name: "Grammar Checker",
    description: "Perfect your writing with smart suggestions",
    path: "/grammar-checker",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    name: "Paraphrasing Tool",
    description: "Rewrite content in multiple styles",
    path: "/paraphraser",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Languages,
    name: "Translator",
    description: "Translate to 100+ languages instantly",
    path: "/translator",
    color: "from-amber-500 to-yellow-500",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/10 blur-2xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative container-custom py-20 md:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Star className="w-4 h-4 fill-current" />

            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
              Your All-in-One
              <br />
              <span className="gradient-text">TwinText</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up stagger-1">
              Professional check plagiarism, detect AI content, fix grammar,
              paraphrase text, and translate to language.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
              <Link to="/signup" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>

            </div>
            
            {/* Trust Badges */}
           
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Writing Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create perfect content, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="tool-card group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 bg-gradient-to-br ${tool.color}`}>
                  <tool.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {tool.description}
                </p>
                
                <div className="flex items-center text-primary font-medium">
                  Try Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Index;
