import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, ConfidenceBar, Badge } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { SearchCheck, FileDown, CheckCircle2, Play, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rca")({
  head: () => ({
    meta: [
      { title: "Root Cause Analysis — IKIP" },
      { name: "description", content: "AI Root Cause Analysis agent ranks probable causes with supporting evidence and auto-generates RCA reports." },
    ],
  }),
  component: Rca,
});

const likelihoodCls: Record<string, string> = {
  "Most likely": "border-danger/40 bg-danger/10",
  "Moderately likely": "border-warning/40 bg-warning/10",
  "Low likelihood": "border-border bg-secondary/40",
};

const inputs = ["Similar incidents", "Historical failures", "Maintenance logs", "Inspection reports", "SOP violations"];

function Rca() {
  const { rcaCauses, assets, generateRca } = useIndustrialState();
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || "P-101");
  const [failureEvent, setFailureEvent] = useState("bearing failure");
  const [analyzing, setAnalyzing] = useState(false);

  const handleRunRca = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => {
      generateRca(selectedAssetId, failureEvent);
      setAnalyzing(false);
    }, 2000);
  };

  const handleExportRca = () => {
    alert(`RCA Report generated for ${selectedAssetId} - ${failureEvent}. Downloading: rca_report_${selectedAssetId}.pdf`);
  };

  const currentAsset = assets.find(a => a.id === selectedAssetId);

  return (
    <AppShell>
      <PageHeader
        title="Root Cause Analysis Agent"
        subtitle={`Active Analysis Case: ${currentAsset?.name || "Pump P-101"} — ${failureEvent}`}
        action={
          <button 
            onClick={handleExportRca}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <FileDown className="h-4 w-4" /> Export Report (PDF)
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3 mb-4">
        {/* RCA Configurator Form */}
        <Card className="lg:col-span-1">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-primary" /> Run AI Investigation</h2>
          <form onSubmit={handleRunRca} className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Select Target Asset</label>
              <select 
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
              >
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Observed Failure Mode</label>
              <input 
                required
                value={failureEvent}
                onChange={(e) => setFailureEvent(e.target.value)}
                placeholder="e.g. bearing failure, high temperature leak..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
              />
            </div>

            <button 
              type="submit"
              disabled={analyzing}
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium cursor-pointer transition-all ${analyzing ? 'bg-warning/20 text-warning border border-warning/30 animate-pulse' : 'bg-primary text-primary-foreground hover:bg-primary/95'}`}
            >
              <Play className="h-4 w-4" /> {analyzing ? "Synthesizing Evidence..." : "Run AI Root Cause Agent"}
            </button>
          </form>
        </Card>

        {/* Evidence Dashboard */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <SearchCheck className="h-4 w-4 text-primary" /> Multi-Document Evidence Synthesized by Agent
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {inputs.map((i) => (
              <Badge key={i} className="bg-secondary/60"><CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-success" /> {i}</Badge>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            The agent automatically checks work orders, operator emails, OEM design guidelines, vibration logs, and LOTO compliance sheets for the selected asset to compute likelihood values below.
          </p>
        </Card>
      </div>

      <div className="space-y-3">
        {rcaCauses.map((c, i) => (
          <Card key={i} className={cn("border transition-all duration-150 hover:shadow-glow", likelihoodCls[c.likelihood])}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground/90">{c.cause}</h3>
                  <span className="text-xs text-muted-foreground">{c.likelihood}</span>
                </div>
              </div>
              <div className="w-40"><ConfidenceBar value={c.confidence} /></div>
            </div>
            <div className="mt-3 pl-10">
              <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Supporting evidence & citations</div>
              <ul className="mt-1.5 space-y-1">
                {c.evidence.map((e, j) => (
                  <li key={j} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-primary font-bold">›</span> {e}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
