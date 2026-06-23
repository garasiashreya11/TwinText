import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
  Search,
  FileSearch,
  Bot,
  Sparkles,
  Languages,
  Type,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Zap,
} from "lucide-react";

const tools = [
  {
    icon: FileSearch,
    name: "Plagiarism Checker",
    description: "Detect copied content and ensure originality.",
    path: "/plagiarism-checker",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Bot,
    name: "AI Content Detector",
    description: "Identify AI-generated text with high accuracy using cutting-edge detection.",
    path: "/ai-detector",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Type,
    name: "Grammar Checker",
    description: "Perfect your writing with real-time grammar, spelling, and style suggestions.",
    path: "/grammar-checker",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Sparkles,
    name: "Paraphrasing Tool",
    description: "Rewrite content in multiple styles while maintaining the original meaning.",
    path: "/paraphraser",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Languages,
    name: "Translator",
    description: "Translate text seamlessly between 100+ languages with contextual accuracy.",
    path: "/translator",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-500/10",
  },
];

const stats = [
  { icon: TrendingUp, label: "Words Processed", value: "1.2M+" },
  { icon: Clock, label: "Time Saved", value: "500+ hrs" },
  { icon: Star, label: "User Rating", value: "4.9/5" },
  { icon: Zap, label: "Accuracy", value: "99.9%" },
];

const Dashboard = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        
        <div className="relative container-custom section-padding">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              All-in-One Writing Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Write <span className="gradient-text">Better Content</span> in Less Time
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Powerful AI tools to check plagiarism, detect AI content, fix grammar,
              paraphrase text, and translate to any language.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/plagiarism-checker" className="btn-primary inline-flex items-center gap-2">
                Start Writing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#tools" className="btn-secondary">
                Explore Tools
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Writing Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create perfect content, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="tool-card group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${tool.bgColor} mb-4`}>
                  <tool.icon className={`w-7 h-7 bg-gradient-to-r ${tool.color} bg-clip-text text-transparent`} style={{ filter: 'none' }} />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {tool.description}
                </p>
                
                <div className="flex items-center text-primary font-medium">
                  Try Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />
            <div className="absolute inset-0 bg-hero-pattern opacity-30" />
            
            <div className="relative px-8 py-16 md:py-20 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Elevate Your Writing?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                Join thousands of writers who trust TwinText to create better content.
              </p>
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary font-semibold hover:bg-white/90 transition-colors">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
