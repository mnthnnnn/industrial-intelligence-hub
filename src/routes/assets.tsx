import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, HealthBadge, ConfidenceBar, Badge } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { QrCode, Wrench, X, Calendar, Plus, CheckCircle2, History } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets & Health — IKIP" },
      { name: "description", content: "Live asset health scores, maintenance history and failure trends with red/yellow/green status." },
    ],
  }),
  component: Assets,
});

function Assets() {
  const { assets, workOrders, addWorkOrder } = useIndustrialState();
  
  const [selectedAsset, setSelectedAsset] = useState<typeof assets[0] | null>(null);
  const [qrAsset, setQrAsset] = useState<typeof assets[0] | null>(null);
  const [newWOTitle, setNewWOTitle] = useState("");
  const [newWOPriority, setNewWOPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  const handleScheduleWO = (e: React.FormEvent, assetId: string) => {
    e.preventDefault();
    if (!newWOTitle.trim()) return;
    addWorkOrder(assetId, newWOTitle, newWOPriority);
    setNewWOTitle("");
    setScheduledSuccess(true);
    setTimeout(() => {
      setScheduledSuccess(false);
    }, 3000);
  };

  return (
    <AppShell>
      <PageHeader
        title="Assets & Health"
        subtitle="Red / Yellow / Green health scoring computed from maintenance, failure and inspection signals."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => (
          <Card key={a.id} className="flex flex-col justify-between hover:border-primary/40 hover:shadow-glow transition-all duration-200">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-xs text-primary">{a.id}</div>
                  <div className="mt-0.5 font-semibold leading-tight">{a.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{a.type} · {a.location}</div>
                </div>
                <HealthBadge health={a.health} />
              </div>

              <div className="my-4">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Asset Health Score</span>
                  <span className="font-medium text-foreground">{a.healthScore}/100</span>
                </div>
                <ConfidenceBar value={a.healthScore} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="text-lg font-semibold">{a.openWorkOrders}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">Open WO</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="text-lg font-semibold">{a.failures}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">Failures</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-2">
                  <div className="text-xs font-semibold">{a.lastMaintenance.slice(5)}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">Last PM</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setQrAsset(a)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs hover:bg-secondary cursor-pointer"
              >
                <QrCode className="h-3.5 w-3.5" /> QR Tag
              </button>
              <button 
                onClick={() => setSelectedAsset(a)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs hover:bg-secondary cursor-pointer"
              >
                <Wrench className="h-3.5 w-3.5" /> History & PM
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Asset History & Schedule PM Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-glow flex flex-col max-h-[90vh]">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="font-mono text-xs text-primary">{selectedAsset.id}</span>
                <h2 className="text-xl font-bold leading-tight">{selectedAsset.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedAsset.type} · {selectedAsset.location}</p>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Telemetry info */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><History className="h-4 w-4 text-primary" /> Active Maintenance Log</h3>
                <div className="space-y-2">
                  {workOrders.filter(w => w.asset === selectedAsset.id).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No historical records or open work orders logged.</p>
                  ) : (
                    workOrders.filter(w => w.asset === selectedAsset.id).map(w => (
                      <div key={w.id} className="flex justify-between items-center rounded-lg border border-border bg-secondary/30 p-3 text-xs">
                        <div>
                          <div className="font-semibold text-foreground">{w.title}</div>
                          <div className="text-[10px] text-muted-foreground">WO ID: {w.id} · Scheduled {w.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={w.priority === "High" ? "bg-danger/15 text-danger border-danger/30" : ""}>{w.priority}</Badge>
                          <span className={w.status === "Closed" ? "text-success" : "text-warning"}>{w.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Schedule PM Form */}
              <div className="rounded-lg border border-border bg-secondary/15 p-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Schedule Preventive Maintenance</h3>
                <form onSubmit={(e) => handleScheduleWO(e, selectedAsset.id)} className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Activity Title / Action Checklist</label>
                    <input 
                      required
                      placeholder="e.g. Inspect drive coupling alignment or replace grease seal..."
                      value={newWOTitle}
                      onChange={(e) => setNewWOTitle(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-muted-foreground mb-1">Priority</label>
                      <select 
                        value={newWOPriority} 
                        onChange={(e) => setNewWOPriority(e.target.value as any)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring text-foreground"
                      >
                        <option value="High">🔴 High Priority</option>
                        <option value="Medium">🟡 Medium Priority</option>
                        <option value="Low">🟢 Low Priority</option>
                      </select>
                    </div>
                    <button 
                      type="submit" 
                      className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Schedule Action
                    </button>
                  </div>
                </form>

                {scheduledSuccess && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-success bg-success/15 border border-success/30 rounded-lg p-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Preventive Maintenance order successfully dispatched to site team.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-glow text-center">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">QR Code tag simulator</span>
              <button onClick={() => setQrAsset(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Generated QR Pattern */}
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl border-4 border-foreground bg-white p-3">
              <div className="grid h-full w-full grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded ${((i + qrAsset.id.charCodeAt(0)) % 3 === 0 || i === 0 || i === 15 || i === 3 || i === 12) ? 'bg-black' : 'bg-transparent'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="font-mono text-sm font-bold text-foreground">{qrAsset.id}</div>
              <div className="text-sm font-semibold text-muted-foreground">{qrAsset.name}</div>
              <p className="mt-1 text-xs text-muted-foreground">{qrAsset.location}</p>
            </div>

            <button 
              onClick={() => {
                alert(`QR Code for ${qrAsset.id} printed. Attach this tag to equipment.`);
                setQrAsset(null);
              }}
              className="mt-6 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              Print Tag (PDF)
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
