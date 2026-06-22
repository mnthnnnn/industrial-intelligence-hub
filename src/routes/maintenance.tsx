import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, StatCard, HealthBadge, ConfidenceBar, Badge } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { failureTrend, failureByType } from "@/lib/mock-data";
import { Activity, TrendingDown, AlertOctagon, Gauge, Bell, Sliders, PlayCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance Intelligence — IKIP" },
      { name: "description", content: "AI-detected failure patterns, asset health scores, risk indicators and predictive maintenance recommendations." },
    ],
  }),
  component: Maintenance,
});

const tooltipStyle = { background: "oklch(0.21 0.022 250)", border: "1px solid oklch(0.3 0.02 250)", borderRadius: 10, color: "white", fontSize: 12 };

function Maintenance() {
  const { assets, workOrders } = useIndustrialState();
  const critical = assets.filter((a) => a.health === "red").length;

  // Custom Alert Threshold State
  const [vibLimit, setVibLimit] = useState(4.5); // mm/s
  const [tempLimit, setTempLimit] = useState(135); // °C
  const [drillRunning, setDrillRunning] = useState(false);

  // Asset telemetry values derived from health scores
  const getAssetVib = (healthScore: number) => {
    // Lower health score -> higher vibration
    return parseFloat((10 - (healthScore / 10) + 1.2).toFixed(2));
  };

  const getAssetTemp = (healthScore: number) => {
    // Lower health score -> higher temperature
    return Math.round(80 + (100 - healthScore) * 1.1);
  };

  // Find assets triggering thresholds
  const triggeredAlarms = assets.map(a => {
    const vib = getAssetVib(a.healthScore);
    const temp = getAssetTemp(a.healthScore);
    const triggers = [];
    if (vib > vibLimit) triggers.push(`Vibration (${vib} mm/s > ${vibLimit} limit)`);
    if (temp > tempLimit) triggers.push(`Temperature (${temp}°C > ${tempLimit} limit)`);
    return { asset: a, triggers };
  }).filter(t => t.triggers.length > 0);

  const runDrill = () => {
    setDrillRunning(true);
    // temporarily lower thresholds to force trigger alerts
    const oldVib = vibLimit;
    const oldTemp = tempLimit;
    setVibLimit(2.0);
    setTempLimit(90);

    setTimeout(() => {
      setVibLimit(oldVib);
      setTempLimit(oldTemp);
      setDrillRunning(false);
    }, 4000);
  };

  return (
    <AppShell>
      <PageHeader title="Maintenance Intelligence" subtitle="Failure patterns, risk indicators and predictive recommendations derived from work orders, failures and inspections." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Critical Assets" value={critical} tone="danger" icon={<AlertOctagon className="h-5 w-5" />} />
        <StatCard label="MTBF (avg)" value="142d" sub="+8% vs last qtr" tone="success" icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Unplanned Downtime" value="3.2%" sub="-0.6% MoM" tone="success" icon={<TrendingDown className="h-5 w-5" />} />
        <StatCard label="PM Compliance" value="87%" tone="warning" icon={<Gauge className="h-5 w-5" />} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold">Failure rate trend</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={failureTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 250)" />
              <XAxis dataKey="month" stroke="oklch(0.68 0.02 245)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.02 245)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="failures" stroke="oklch(0.62 0.22 25)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">Detected failure patterns</h2>
          <div className="space-y-2">
            {failureByType.map((f) => (
              <div key={f.type} className="flex items-center justify-between rounded-lg bg-secondary/40 p-2.5 text-sm">
                <span>{f.type}</span>
                <Badge>{f.count} events</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Dynamic Alarm Controller */}
        <Card className="flex flex-col justify-between">
          <div>
            <h2 className="mb-3 font-semibold flex items-center gap-1.5"><Sliders className="h-4 w-4 text-primary" /> Predictive Alert Thresholds</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Max Vibration Limit</span>
                  <span className="font-semibold text-foreground">{vibLimit} mm/s</span>
                </div>
                <input 
                  type="range" min="1.0" max="8.0" step="0.1"
                  value={vibLimit}
                  onChange={(e) => setVibLimit(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Max Temperature Limit</span>
                  <span className="font-semibold text-foreground">{tempLimit}°C</span>
                </div>
                <input 
                  type="range" min="60" max="160" step="5"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>
            </div>
          </div>

          <button 
            onClick={runDrill}
            disabled={drillRunning}
            className={`mt-4 w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold cursor-pointer transition-all ${drillRunning ? 'bg-warning/20 text-warning border border-warning/30 animate-pulse' : 'bg-primary text-primary-foreground hover:bg-primary/95'}`}
          >
            <PlayCircle className="h-4 w-4" /> {drillRunning ? "Running Failure Simulation..." : "Simulate Failure Pattern Drill"}
          </button>
        </Card>

        {/* Live Alarm Board */}
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-semibold flex items-center gap-1.5"><Bell className="h-4 w-4 text-primary" /> Live AI Predictive Alerts ({triggeredAlarms.length})</h2>
          <div className="space-y-2 max-h-[28vh] overflow-y-auto pr-1">
            {triggeredAlarms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center text-xs text-success bg-success/5 border border-success/20 rounded-lg">
                <Bell className="h-6 w-6 mb-2 opacity-50" />
                All assets telemetry levels are within safe operating envelopes.
              </div>
            ) : (
              triggeredAlarms.map((a, i) => (
                <div key={i} className="rounded-lg border border-danger/30 bg-danger/10 p-2.5 flex items-start gap-3 text-xs animate-in zoom-in-95 duration-150">
                  <AlertOctagon className="h-4 w-4 shrink-0 text-danger mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between font-semibold text-foreground">
                      <span>{a.asset.name} ({a.asset.id})</span>
                      <span className="text-[10px] text-danger uppercase">Alert Active</span>
                    </div>
                    <ul className="mt-1 space-y-0.5 text-muted-foreground list-disc pl-3">
                      {a.triggers.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold">Asset health scoreboard</h2>
          <div className="space-y-2">
            {[...assets].sort((a, b) => a.healthScore - b.healthScore).map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg bg-secondary/40 p-2.5">
                <div className="w-16 font-mono text-xs text-primary">{a.id}</div>
                <div className="flex-1"><ConfidenceBar value={a.healthScore} /></div>
                <HealthBadge health={a.health} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Predictive recommendations</h2>
          <div className="space-y-2">
            {assets.filter(a => a.healthScore < 75).map((a, i) => (
              <div key={i} className="rounded-lg border border-border bg-secondary/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">{a.id}</span>
                  <HealthBadge health={a.health} label={a.healthScore < 45 ? "Urgent" : "Plan"} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.healthScore < 45 
                    ? `Schedule bearing replacement immediately — vibration trend exceeds safety parameters.` 
                    : `Schedule check of auxiliary system components during next planned maintenance.`}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
