import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { RefreshCw, Copy, Check, Info, Loader2 } from "lucide-react";

const Paraphraser = () => {
  const [text, setText] = useState("");
  const [paraphrasedText, setParaphrasedText] = useState("");
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleParaphrase = async () => {
    if (!text.trim()) return;
    
    setIsParaphrasing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://${window.location.hostname}:5000/predict/paraphrase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) throw new Error("Paraphrasing failed");
      
      const data = await response.json();
      setParaphrasedText(data.paraphrased);
    } catch (error) {
      console.error("Error:", error);
      alert("Error connecting to paraphrasing service.");
    } finally {
      setIsParaphrasing(false);
    }
  };

  const handleCopy = () => {
    if (!paraphrasedText) return;
    navigator.clipboard.writeText(paraphrasedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 mb-6">
              <RefreshCw className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              AI Paraphrasing Tool
            </h1>
            <p className="text-lg text-muted-foreground">
              Rewrite your sentences and paragraphs while maintaining the original meaning.
              Perfect for improving clarity and avoiding plagiarism.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Input Side */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Original Text</span>
                <span className="text-xs text-muted-foreground">
                  {text.length} characters
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to paraphrase..."
                className="input-field min-h-[300px] resize-none"
              />
              <button
                onClick={handleParaphrase}
                disabled={!text.trim() || isParaphrasing}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                {isParaphrasing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Paraphrasing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Paraphrase Now
                  </>
                )}
              </button>
            </div>

            {/* Output Side */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm relative">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Paraphrased Text</span>
                <button
                  onClick={handleCopy}
                  disabled={!paraphrasedText}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <div className="input-field min-h-[300px] bg-secondary/30 overflow-y-auto whitespace-pre-wrap">
                {paraphrasedText || (
                  <span className="text-muted-foreground italic">
                    Your paraphrased content will appear here...
                  </span>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Our AI uses back-translation to rewrite your text while preserving its core meaning and improving readability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Paraphraser;
