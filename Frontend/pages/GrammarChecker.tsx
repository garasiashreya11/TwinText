import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Type, Check, AlertCircle, X, Loader2, Lightbulb } from "lucide-react";

interface GrammarMatch {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule: { id: string; description: string; issueType: string; category: { id: string; name: string } };
}

interface GrammarError extends GrammarMatch {
  id: string; // Use rule.id + offset as unique ID
  type: "grammar" | "spelling" | "style" | "punctuation";
  original: string;
  suggestion: string;
  explanation: string;
}

const GrammarChecker = () => {
  const [text, setText] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    setErrors([]);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/grammar", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text }),
      });
      
      const data = await response.json();
      
      if (data.matches) {
        const mappedErrors: GrammarError[] = data.matches.map((m: GrammarMatch, index: number) => {
          const typeMap: Record<string, GrammarError["type"]> = {
            misspelling: "spelling",
            grammar: "grammar",
            style: "style",
            typographical: "punctuation",
          };
          
          return {
            ...m,
            id: `${m.rule.id}-${m.offset}`,
            type: typeMap[m.rule.issueType] || "grammar",
            original: text.substring(m.offset, m.offset + m.length),
            suggestion: m.replacements[0]?.value || "",
            explanation: m.message,
          };
        });
        setErrors(mappedErrors);
      }
    } catch (error) {
      console.error("Grammar check failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        setText(data.text);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleClear = () => {
    setText("");
    setErrors([]);
    setSelectedError(null);
  };

  const handleApplySuggestion = (error: GrammarError) => {
    setText(text.replace(error.original, error.suggestion));
    setErrors(errors.filter(e => e.id !== error.id));
    setSelectedError(null);
  };

  const handleDismiss = (error: GrammarError) => {
    setErrors(errors.filter(e => e.id !== error.id));
    setSelectedError(null);
  };

  const getErrorColor = (type: string) => {
    switch (type) {
      case "grammar": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "spelling": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "style": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "punctuation": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 mb-6">
              <Type className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Grammar Checker
            </h1>
            <p className="text-lg text-muted-foreground">
              Perfect your writing with real-time grammar, spelling, and style
              suggestions. Write with confidence every time.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Editor */}
              <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <label className="font-medium">Your Text</label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {text.split(/\s+/).filter(Boolean).length} words
                    </span>
                    {errors.length > 0 && (
                      <span className="text-sm text-red-500">
                        {errors.length} issue{errors.length !== 1 ? 's' : ''} found
                      </span>
                    )}
                  </div>
                </div>
                
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start typing or paste your text here..."
                  className="input-field min-h-[400px] resize-y text-lg leading-relaxed"
                />

                  <div className="flex gap-3 mt-4">
                    <input
                      type="file"
                      id="pdf-upload"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileUpload}
                    />
                    <button
                      onClick={() => document.getElementById("pdf-upload")?.click()}
                      disabled={isUploading}
                      className="btn-secondary flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5" />
                          Upload PDF
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCheck}
                      disabled={!text.trim() || isChecking}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                    {isChecking ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Check Grammar
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleClear}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Clear
                  </button>
                </div>
              </div>

              {/* Suggestions Panel */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm animate-slide-in-right h-fit">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Suggestions
                </h3>

                {errors.length === 0 && !isChecking && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="font-medium mb-1">Looking Good!</p>
                    <p className="text-sm text-muted-foreground">
                      {text ? "No issues found in your text." : "Enter some text to check for errors."}
                    </p>
                  </div>
                )}

                {isChecking && (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Analyzing your text...</p>
                  </div>
                )}

                {errors.length > 0 && (
                  <div className="space-y-3">
                    {errors.map((error) => (
                      <div
                        key={error.id}
                        onClick={() => setSelectedError(error)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedError?.id === error.id
                            ? getErrorColor(error.type)
                            : 'bg-secondary/50 border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getErrorColor(error.type)}`}>
                            {error.type}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDismiss(error);
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="mb-2">
                          <span className="line-through text-red-500">{error.original}</span>
                          <span className="mx-2">→</span>
                          <span className="text-green-500 font-medium">{error.suggestion}</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">
                          {error.explanation}
                        </p>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplySuggestion(error);
                          }}
                          className="w-full py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                        >
                          Apply Suggestion
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GrammarChecker;
