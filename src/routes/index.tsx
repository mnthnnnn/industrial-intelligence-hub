import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, StatCard, HealthBadge, Badge, ConfidenceBar } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { failureTrend, failureByType } from "@/lib/mock-data";
import { Boxes, AlertTriangle, ShieldCheck, ClipboardList, Flame, Bot, ArrowRight, Sparkles, Settings } from "lucide-react";
import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Center — IKIP" },
      { name: "description", content: "Real-time industrial intelligence: assets, risks, compliance, and AI recommendations in one operational brain." },
    ],
  }),
  component: Home,
});

const tooltipStyle = {
  background: "oklch(0.21 0.022 250)",
  border: "1px solid oklch(0.3 0.02 250)",
  borderRadius: 10,
  color: "white",
  fontSize: 12,
};

function Home() {
  const { assets, workOrders, lessons, stats, kpis, toggleKpi } = useIndustrialState();
  const [showConfig, setShowConfig] = useState(false);

  return (
    <AppShell>
      <div className="mb-6 overflow-hidden rounded-2xl border border-border grid-bg p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-primary">
          <Sparkles className="h-4 w-4" /> Unified Asset & Operations Brain
        </div>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight lg:text-4xl">
          One <span className="text-gradient">intelligent brain</span> for every manual, work order, inspection and incident.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {stats.documents} documents ingested · {stats.entities.toLocaleString()} entities extracted ·{" "}
          {stats.relationships.toLocaleString()} knowledge relationships mapped.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/copilot" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Bot className="h-4 w-4" /> Ask the Copilot
          </Link>
          <Link to="/graph" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-card">
            Explore Knowledge Graph <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Executive Metrics</h2>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Configure KPIs"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        {showConfig && (
          <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-2 animate-in fade-in duration-200">
            <span className="text-xs text-muted-foreground self-center mr-1">Show/Hide:</span>
            {kpis.map(k => (
              <button
                key={k.id}
                onClick={() => toggleKpi(k.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${k.active ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary/40 text-muted-foreground border-border'}`}
              >
                {k.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-4">
        {kpis.filter(k => k.active).map(k => {
          if (k.id === "assets") return <StatCard key={k.id} label="Total Assets" value={stats.totalAssets} icon={<Boxes className="h-5 w-5" />} />;
          if (k.id === "risks") return <StatCard key={k.id} label="Active Risks" value={stats.activeRisks} sub={`${assets.filter(a=>a.health==='red').length} critical`} tone="danger" icon={<AlertTriangle className="h-5 w-5" />} />;
          if (k.id === "compliance") return <StatCard key={k.id} label="Compliance" value={`${stats.complianceScore}%`} sub="Audit-ready" tone="warning" icon={<ShieldCheck className="h-5 w-5" />} />;
          if (k.id === "workOrders") return <StatCard key={k.id} label="Open Work Orders" value={stats.openWorkOrders} icon={<ClipboardList className="h-5 w-5" />} />;
          if (k.id === "incidents") return <StatCard key={k.id} label="Incidents (YTD)" value={stats.incidents} tone="danger" icon={<Flame className="h-5 w-5" />} />;
          return null;
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Failure vs. Planned Maintenance</h2>
            <Badge>Last 6 months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={failureTrend}>
              <defs>
                <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.15 232)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.68 0.15 232)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 250)" />
              <XAxis dataKey="month" stroke="oklch(0.68 0.02 245)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.02 245)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="planned" stroke="oklch(0.68 0.15 232)" fill="url(#p)" strokeWidth={2} />
              <Area type="monotone" dataKey="failures" stroke="oklch(0.62 0.22 25)" fill="url(#f)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Failures by Type</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={failureByType} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 250)" horizontal={false} />
              <XAxis type="number" stroke="oklch(0.68 0.02 245)" fontSize={12} />
              <YAxis type="category" dataKey="type" stroke="oklch(0.68 0.02 245)" fontSize={12} width={70} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.27 0.025 250)" }} />
              <Bar dataKey="count" fill="oklch(0.72 0.15 75)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Assets needing attention</h2>
            <Link to="/assets" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {assets.filter((a) => a.health !== "green").slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-3">
                <div>
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.location} · {a.openWorkOrders} open WO</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden w-28 sm:block"><ConfidenceBar value={a.healthScore} /></div>
                  <HealthBadge health={a.health} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">AI Recommendations</h2>
          </div>
          <div className="space-y-3">
            {lessons.slice(0, 3).map((l) => (
              <div key={l.pattern} className="rounded-lg border border-border bg-secondary/40 p-3">
                <div className="text-xs font-medium text-warning">⚠ Pattern × {l.occurrences}</div>
                <p className="mt-1 text-xs text-muted-foreground">{l.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Open Work Orders</h2>
          <Link to="/maintenance" className="text-xs text-primary hover:underline">Maintenance Intel</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2">ID</th><th className="pb-2">Asset</th><th className="pb-2">Task</th><th className="pb-2">Priority</th><th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((w) => (
                <tr key={w.id} className="border-b border-border/50">
                  <td className="py-2 font-mono text-xs text-muted-foreground">{w.id}</td>
                  <td className="py-2">{w.asset}</td>
                  <td className="py-2">{w.title}</td>
                  <td className="py-2">
                    <Badge className={w.priority === "High" ? "bg-danger/15 text-danger border-danger/30" : ""}>{w.priority}</Badge>
                  </td>
                  <td className="py-2 text-muted-foreground">{w.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
