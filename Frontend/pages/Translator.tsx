import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Languages, Copy, ArrowRightLeft, Check, Volume2, Loader2 } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

const Translator = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/translate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          text: sourceText, 
          target: targetLang 
        }),
      });
      
      const data = await response.json();
      
      if (data.translated) {
        setTranslatedText(data.translated);
      } else {
        setTranslatedText("Translation failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedText("Translation Error: " + (error as Error).message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguage = (code: string) => languages.find(l => l.code === code);

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6">
              <Languages className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Translator
            </h1>
            <p className="text-lg text-muted-foreground">
              Translate text between 100+ languages instantly with contextual
              accuracy. Break language barriers effortlessly.
            </p>
          </div>

          {/* Language Selector */}
          <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* Source Language */}
              <div className="relative">
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-3 rounded-xl bg-card border border-border font-medium cursor-pointer hover:border-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                  {getLanguage(sourceLang)?.flag}
                </span>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwapLanguages}
                className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>

              {/* Target Language */}
              <div className="relative">
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-3 rounded-xl bg-card border border-border font-medium cursor-pointer hover:border-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                  {getLanguage(targetLang)?.flag}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Source Text */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLanguage(sourceLang)?.flag}</span>
                    <label className="font-medium">{getLanguage(sourceLang)?.name}</label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {sourceText.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  className="input-field min-h-[250px] resize-y"
                />

                <div className="flex items-center justify-between mt-4">
                  <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleTranslate}
                    disabled={!sourceText.trim() || isTranslating}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Languages className="w-5 h-5" />
                        Translate
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Translated Text */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm animate-slide-up stagger-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLanguage(targetLang)?.flag}</span>
                    <label className="font-medium">{getLanguage(targetLang)?.name}</label>
                  </div>
                  {translatedText && (
                    <span className="text-sm text-muted-foreground">
                      {translatedText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  )}
                </div>
                
                <div className="min-h-[250px] p-4 rounded-lg bg-secondary/50 border border-border">
                  {isTranslating ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
                        <p className="text-muted-foreground">Translating...</p>
                      </div>
                    </div>
                  ) : translatedText ? (
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{translatedText}</p>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      <p>Translation will appear here...</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  
                  {translatedText && (
                    <button
                      onClick={handleCopy}
                      className="btn-secondary flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-5 h-5 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          Copy Translation
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Translator;
