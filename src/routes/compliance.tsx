import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, StatCard, HealthBadge, ConfidenceBar } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { ShieldCheck, ShieldAlert, FileWarning, BadgeCheck, Play, FileDown, CheckCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance Intelligence — IKIP" },
      { name: "description", content: "Automated compliance scoring against Factory Act, OISD, environmental and safety standards with gap detection." },
    ],
  }),
  component: Compliance,
});

function Compliance() {
  const { compliance, stats, runComplianceAudit } = useIndustrialState();
  const gaps = compliance.reduce((sum, c) => sum + c.gaps.length, 0);

  const [auditing, setAuditing] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

  const handleAudit = () => {
    setAuditing(true);
    setAuditSuccess(false);
    setTimeout(() => {
      runComplianceAudit();
      setAuditing(false);
      setAuditSuccess(true);
      setTimeout(() => setAuditSuccess(false), 3000);
    }, 2000);
  };

  const handleDownloadReport = () => {
    alert("Compliance evidence package generated! Downloading: compliance_evidence_report.pdf");
  };

  return (
    <AppShell>
      <PageHeader 
        title="Compliance Intelligence" 
        subtitle="Continuous compliance against Factory Act, OISD, environmental, safety standards and internal SOPs." 
        action={
          <div className="flex gap-2">
            <button 
              onClick={handleAudit}
              disabled={auditing}
              className={`inline-flex items-center gap-1.5 rounded-lg border py-2 px-3 text-xs font-semibold cursor-pointer transition-all ${auditing ? 'bg-warning/20 text-warning border-warning/30 animate-pulse' : 'bg-secondary text-foreground hover:bg-secondary/80 border-border'}`}
            >
              <Play className="h-3.5 w-3.5" /> {auditing ? "Scanning Repository..." : "Run Regulatory Gap Audit"}
            </button>
            <button 
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary py-2 px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/95 cursor-pointer"
            >
              <FileDown className="h-3.5 w-3.5" /> One-Click Audit Package
            </button>
          </div>
        }
      />

      {auditSuccess && (
        <div className="mb-4 flex items-center gap-2 text-xs text-success bg-success/15 border border-success/30 rounded-lg p-3 animate-in fade-in duration-200">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Gap audit scan completed. Compliance logs updated against current document repository.</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Overall Score" value={`${stats.complianceScore}%`} tone="warning" icon={<ShieldCheck className="h-5 w-5" />} />
        <StatCard label="Open Gaps" value={gaps} tone="danger" icon={<FileWarning className="h-5 w-5" />} />
        <StatCard label="Standards Tracked" value={compliance.length} icon={<BadgeCheck className="h-5 w-5" />} />
        <StatCard label="Audit Readiness" value={gaps === 0 ? "Green" : gaps < 3 ? "Amber" : "Red"} tone={gaps === 0 ? "success" : "warning"} icon={<ShieldAlert className="h-5 w-5" />} />
      </div>

      <div className="mt-4 space-y-3">
        {compliance.map((c) => (
          <Card key={c.standard} className="hover:border-primary/30 transition-colors duration-150">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{c.standard}</h3>
                  <HealthBadge health={c.status} label={c.status === "green" ? "Compliant" : c.status === "yellow" ? "At Risk" : "Non-Compliant"} />
                </div>
                <p className="text-sm text-muted-foreground">{c.area}</p>
              </div>
              <div className="w-48"><ConfidenceBar value={c.score} /></div>
            </div>
            {c.gaps.length > 0 && (
              <div className="mt-3 rounded-lg border border-danger/30 bg-danger/10 p-3">
                <div className="text-xs font-medium uppercase tracking-wider text-danger">Detected gaps</div>
                <ul className="mt-1.5 space-y-1">
                  {c.gaps.map((g) => (
                    <li key={g} className="flex gap-2 text-sm text-foreground/90 leading-tight">
                      <FileWarning className="h-4 w-4 shrink-0 text-danger" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
