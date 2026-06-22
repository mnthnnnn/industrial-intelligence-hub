import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, Badge } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { Mic, FileText, MessageSquareQuote, BrainCircuit, Plus, X, Volume2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/experts")({
  head: () => ({
    meta: [
      { title: "Expert Knowledge Capture — IKIP" },
      { name: "description", content: "Preserve decades of tacit knowledge from senior engineers via voice notes, recommendations and field notes." },
    ],
  }),
  component: Experts,
});

const typeIcon = {
  "Voice Note": Mic,
  Recommendation: MessageSquareQuote,
  "Field Note": FileText,
} as const;

function Experts() {
  const { expertNotes, addExpertNote, assets } = useIndustrialState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Form states
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [noteType, setNoteType] = useState<"Voice Note" | "Recommendation" | "Field Note">("Recommendation");
  const [targetAsset, setTargetAsset] = useState(assets[0]?.id || "P-101");
  const [summary, setSummary] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !summary.trim()) return;
    addExpertNote(author, role, noteType, targetAsset, summary);
    
    // Reset Form
    setAuthor("");
    setRole("");
    setSummary("");
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setShowAddForm(false);
    }, 2000);
  };

  const handleSimulateVoiceCapture = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setAuthor("Expert System");
      setRole("Voice Transcription (Auto)");
      setNoteType("Voice Note");
      setSummary("Keep discharge pressure valve calibrated within 5% of setpoint on reciprocating units to avoid valve plate fractures.");
    }, 3000);
  };

  return (
    <AppShell>
      <PageHeader
        title="Expert Knowledge Capture"
        subtitle="Convert retiring experts' tacit knowledge into permanent, searchable expert memory."
        action={
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Capture Knowledge
          </button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {(["Voice Note", "Recommendation", "Field Note"] as const).map((t) => {
          const Icon = typeIcon[t];
          return (
            <Card key={t} className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/15 p-3 text-primary"><Icon className="h-5 w-5" /></div>
              <div>
                <div className="text-sm font-medium">{t}</div>
                <div className="text-xs text-muted-foreground">Auto-transcribed & structured</div>
              </div>
            </Card>
          );
        })}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-glow">
            <div className="flex justify-between items-start mb-4 border-b border-border pb-3">
              <h2 className="text-lg font-bold">Capture Retiring Expert Tacit Note</h2>
              <button onClick={() => setShowAddForm(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNote} className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Author Name</label>
                  <input 
                    required placeholder="e.g. S. Sen" value={author} onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Role / Experience</label>
                  <input 
                    required placeholder="e.g. Rotating Engineer (30 yrs)" value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Asset Tag</label>
                  <select 
                    value={targetAsset} onChange={(e) => setTargetAsset(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"
                  >
                    {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-muted-foreground mb-1">Note Type</label>
                  <select 
                    value={noteType} onChange={(e) => setNoteType(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"
                  >
                    <option value="Recommendation">💡 Recommendation</option>
                    <option value="Voice Note">🎤 Voice Note</option>
                    <option value="Field Note">📝 Field Note</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs text-muted-foreground">Expert Wisdom / Observation Summary</label>
                  <button 
                    type="button" 
                    onClick={handleSimulateVoiceCapture}
                    disabled={isRecording}
                    className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded border ${isRecording ? 'bg-danger/10 text-danger border-danger/30 animate-pulse' : 'bg-secondary text-primary border-border hover:bg-secondary/80'}`}
                  >
                    <Mic className="h-3 w-3" /> {isRecording ? "Recording..." : "Simulate Mic Speech"}
                  </button>
                </div>
                <textarea 
                  required 
                  rows={4}
                  placeholder="Capture specific tacit wisdom that manuals don't cover..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 cursor-pointer"
              >
                Store Tacit Knowledge Node
              </button>
            </form>

            {successMsg && (
              <div className="mt-3 flex items-center gap-2 text-xs text-success bg-success/15 border border-success/30 rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Expert capture indexed and added to local Knowledge Graph.</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {expertNotes.map((n) => {
          const Icon = typeIcon[n.type];
          return (
            <Card key={n.id} className="hover:border-primary/30 transition-colors duration-150">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                  {n.author.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-medium">{n.author}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{n.role}</span>
                    </div>
                    <Badge><Icon className="mr-1 h-3 w-3" /> {n.type}</Badge>
                  </div>
                  <blockquote className="mt-2 border-l-2 border-primary/40 pl-3 text-sm italic text-foreground/90">
                    "{n.summary}"
                  </blockquote>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <BrainCircuit className="h-3.5 w-3.5 text-primary" /> Linked to asset {n.asset} · captured {n.date}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
