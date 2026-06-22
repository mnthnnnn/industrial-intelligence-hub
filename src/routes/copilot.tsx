import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, Badge, ConfidenceBar } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { Bot, Send, FileText, Mic, Sparkles, User, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/copilot")({
  head: () => ({
    meta: [
      { title: "Industrial Copilot — IKIP" },
      { name: "description", content: "Source-backed conversational AI for operations, maintenance, safety, engineering and compliance questions." },
    ],
  }),
  component: Copilot,
});

interface Msg {
  role: "user" | "assistant";
  text: string;
  data?: {
    confidence: number;
    sources: { doc: string; excerpt: string }[];
    related: string[];
  };
}

function Copilot() {
  const { searchKB, copilotKB } = useIndustrialState();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Handle URL query parameters if present (like search queries sent from AppShell header)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("q");
      if (query) {
        ask(query);
        // Clear search parameters from URL without page reload
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const ask = (q: string) => {
    if (!q.trim()) return;
    const searchResult = searchKB(q);
    
    setMessages((m) => [
      ...m, 
      { role: "user", text: q }, 
      { 
        role: "assistant", 
        text: searchResult.answer, 
        data: {
          confidence: searchResult.confidence,
          sources: searchResult.sources,
          related: searchResult.related
        } 
      }
    ]);
    setInput("");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input requires a browser that supports the Web Speech API (e.g. Chrome or Edge).");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-3xl flex-col">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold leading-tight">Industrial Copilot</h1>
            <p className="text-xs text-muted-foreground">Source-backed · never answers without evidence</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-border bg-card p-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Sparkles className="h-8 w-8 text-primary" />
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Ask operational, maintenance, safety, engineering or compliance questions. Every answer comes with sources, confidence and citations.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md">
                {copilotKB.slice(0, 3).map((k) => (
                  <button key={k.q} onClick={() => ask(k.q)} className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs hover:bg-secondary cursor-pointer">
                    {k.q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-3 animate-in slide-in-from-bottom-2 duration-200"}>
              {m.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div className={m.role === "user" ? "max-w-[85%] rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground" : "max-w-[90%] space-y-3"}>
                {m.role === "user" ? (
                  <div className="flex items-center gap-2"><span>{m.text}</span><User className="h-3.5 w-3.5 opacity-70" /></div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed text-foreground/95 bg-secondary/20 rounded-xl p-3.5 border border-border">{m.text}</p>
                    {m.data && (
                      <>
                        {m.data.confidence > 0 ? (
                          <div>
                            <div className="mb-1 flex items-center justify-between text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                              <span>Source Grounding Confidence</span>
                            </div>
                            <ConfidenceBar value={m.data.confidence} />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-danger font-medium bg-danger/10 border border-danger/25 p-2 rounded-lg">
                            <AlertCircle className="h-4 w-4" />
                            Insufficient evidence found. Hallucinations prevented.
                          </div>
                        )}

                        {m.data.sources.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Grounded Citations</div>
                            {m.data.sources.map((s, j) => (
                              <div key={j} className="rounded-lg border border-border bg-secondary/40 p-2.5">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                                  <FileText className="h-3.5 w-3.5" /> [{j + 1}] {s.doc}
                                </div>
                                <p className="mt-1 text-xs italic text-muted-foreground leading-relaxed">"{s.excerpt}"</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {m.data.related.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {m.data.related.map((r) => <Badge key={r} className="bg-primary/10 border-primary/25 text-primary">{r}</Badge>)}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); ask(input); }}
          className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-glow"
        >
          <button 
            type="button" 
            onClick={handleVoiceInput}
            className={`rounded-lg p-2 transition-all cursor-pointer ${isListening ? 'bg-danger/20 text-danger animate-pulse' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            title="Voice input (Web Speech)"
          >
            <Mic className="h-4 w-4" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask the Industrial Copilot…"}
            disabled={isListening}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground px-1"
          />
          <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
