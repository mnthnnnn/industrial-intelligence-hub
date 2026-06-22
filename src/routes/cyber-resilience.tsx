import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, StatCard, Badge, ConfidenceBar } from "@/components/ui/kit";
import { useState } from "react";
import {
  ShieldAlert,
  Server,
  Activity,
  GitPullRequest,
  Play,
  RotateCcw,
  AlertTriangle,
  UserCheck,
  ShieldAlert as ShieldIcon,
  CheckCircle,
  FileCheck,
} from "lucide-react";

export const Route = createFileRoute("/cyber-resilience")({
  head: () => ({
    meta: [
      { title: "Cyber Resilience — CNI Hub" },
      { name: "description", content: "AI platform for autonomous behavioral anomaly detection and threat containment for critical national infrastructure." },
    ],
  }),
  component: CyberResilience,
});

const mockCVEList = [
  { id: "CVE-2026-0129", asset: "CBSE Web Gateway Portal", cvss: 9.8, status: "CRITICAL", exploitability: "High (Public Exploit Available)" },
  { id: "CVE-2025-5491", asset: "AIIMS Billing Database Server", cvss: 8.4, status: "HIGH", exploitability: "Medium (Requires Internal access)" },
  { id: "CVE-2026-1182", asset: "National Power Grid SCADA Hub", cvss: 9.6, status: "CRITICAL", exploitability: "High (APT targeting observed)" },
  { id: "CVE-2025-3921", asset: "NIC Email Exchange Gateway", cvss: 7.2, status: "MEDIUM", exploitability: "Low (Patch deployed in Phase 1)" },
];

const mockMitreMapping = [
  { step: "Initial Access", technique: "T1190: Exploit Public-Facing Application", status: "DETECTED", source: "Log Audit" },
  { step: "Execution", technique: "T1059.001: PowerShell Command Execution", status: "DETECTED", source: "Endpoint telemetry" },
  { step: "Lateral Movement", technique: "T1021.002: SMB/Windows Admin Shares", status: "FLAGGED", source: "Directory anomalies" },
  { step: "Impact (Predicted)", technique: "T1486: Data Encrypted for Impact", status: "PREDICTED", source: "Threat actor profile" },
];

function CyberResilience() {
  const [anomalyScore, setAnomalyScore] = useState(38);
  const [activeIncident, setActiveIncident] = useState<string | null>(null);
  const [soarLog, setSoarLog] = useState<Array<string>>([]);
  const [soarActionState, setSoarActionState] = useState<"idle" | "running" | "completed">("idle");
  const [remediationQueue, setRemediationQueue] = useState(mockCVEList);

  const triggerSimulation = (attackType: string) => {
    setActiveIncident(attackType);
    setSoarLog([]);
    setSoarActionState("idle");

    if (attackType === "CBSE") {
      setAnomalyScore(92);
    } else if (attackType === "AIIMS") {
      setAnomalyScore(86);
    } else {
      setAnomalyScore(38);
      setActiveIncident(null);
    }
  };

  const handleRunPlaybook = () => {
    if (!activeIncident) return;
    setSoarActionState("running");
    setSoarLog(["Initiating SOAR Incident Response Playbook..."]);

    setTimeout(() => {
      setSoarLog((prev) => [...prev, "Step 1/4: Scanning affected subnets for lateral propagation..."]);
    }, 600);

    setTimeout(() => {
      setSoarLog((prev) => [...prev, "Step 2/4: Isolating compromised virtual machine (VM-1082) from main router..."]);
    }, 1200);

    setTimeout(() => {
      setSoarLog((prev) => [...prev, "Step 3/4: Revoking credentials for compromised administrator account 'nic-srv-admin'..."]);
    }, 1800);

    setTimeout(() => {
      setSoarLog((prev) => [...prev, "Step 4/4: Blocking malicious IPs (103.45.21.99) at the PaloAlto firewall perimeter."]);
      setSoarActionState("completed");
    }, 2400);
  };

  return (
    <AppShell>
      <div className="mb-6 overflow-hidden rounded-2xl border border-border grid-bg p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-primary">
          <ShieldAlert className="h-4 w-4" /> AI-Driven Cyber Resilience Engine
        </div>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight lg:text-4xl">
          Autonomous anomaly detection and <span className="text-gradient">threat containment</span>.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Baseline CNI network behaviors, map weak signals to MITRE ATT&CK vectors, prioritize government infrastructure CVEs, and coordinate automated SOAR playbooks.
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => triggerSimulation("CBSE")}
            className="px-4 py-2 bg-danger text-white text-xs font-semibold rounded-lg hover:bg-danger/90 cursor-pointer"
          >
            Trigger CBSE Board Exam attack simulation
          </button>
          <button
            onClick={() => triggerSimulation("AIIMS")}
            className="px-4 py-2 bg-warning text-black text-xs font-semibold rounded-lg hover:bg-warning/90 cursor-pointer"
          >
            Trigger AIIMS Delhi Ransomware drill
          </button>
          {activeIncident && (
            <button
              onClick={() => triggerSimulation("reset")}
              className="px-4 py-2 border border-border text-xs rounded-lg hover:bg-secondary text-foreground cursor-pointer"
            >
              Reset Simulation
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Component 1: Behavioral Anomaly Tracker */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold text-sm">Behavioral Anomaly Scanner</h2>
                <p className="text-[10px] text-muted-foreground">Unsupervised telemetry drift analysis</p>
              </div>
            </div>
            <Badge className={anomalyScore > 70 ? "bg-danger/15 text-danger border-danger/30" : "bg-success/15 text-success border-success/30"}>
              {anomalyScore > 70 ? "ANOMALOUS ACTIVITY" : "HEALTHY BASELINE"}
            </Badge>
          </div>

          <div className="flex-1 space-y-4">
            <div className="rounded-lg bg-secondary/35 border border-border p-4 text-center">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Entity Anomaly Score</span>
              <div className="text-4xl font-bold text-foreground mb-2">{anomalyScore}/100</div>
              <div className="max-w-xs mx-auto"><ConfidenceBar value={anomalyScore} /></div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span className="text-muted-foreground">Active Connections:</span>
                <span className="font-semibold text-foreground">{activeIncident ? "4,821 / min (LDAP burst)" : "1,142 / min (Standard)"}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span className="text-muted-foreground">SMB Share Access Rate:</span>
                <span className="font-semibold text-foreground">{activeIncident ? "392 transfers / sec (High)" : "3 transfers / sec (Low)"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">DNS Tunneling Indicators:</span>
                <span className="font-semibold text-foreground">{activeIncident ? "CRITICAL (TXT query loop)" : "NONE DETECTED"}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Component 2: APT Campaign Attribution & Prediction */}
        <Card className="flex flex-col">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <GitPullRequest className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-sm">MITRE ATT&CK Threat Mapping</h2>
              <p className="text-[10px] text-muted-foreground">CERT-In TTP matching & next-stage projection</p>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            {activeIncident ? (
              <div className="space-y-2 text-xs">
                {mockMitreMapping.map((step, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 border border-border/50 bg-secondary/20 rounded-lg">
                    <div>
                      <span className="text-[9px] uppercase text-muted-foreground block">{step.step}</span>
                      <span className="font-semibold text-foreground">{step.technique}</span>
                    </div>
                    <Badge className={step.status === "DETECTED" ? "bg-danger/10 text-danger border-danger/20" : step.status === "FLAGGED" ? "bg-warning/15 text-warning border-warning/30" : "bg-primary/10 text-primary border-primary/20"}>
                      {step.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-muted-foreground">
                No active threats detected. Baselines are stable.
              </div>
            )}
          </div>
        </Card>

        {/* Component 3: Autonomous Incident Response Orchestrator (SOAR) */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold text-sm">Autonomous Incident Response Orchestrator (SOAR)</h2>
                <p className="text-[10px] text-muted-foreground">Pre-approved containment playbooks</p>
              </div>
            </div>
            {activeIncident && soarActionState !== "completed" && (
              <button
                onClick={handleRunPlaybook}
                disabled={soarActionState === "running"}
                className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="h-3 w-3" /> Execute Containment Playbook
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-black/35 border border-border p-4 min-h-[160px] font-mono text-xs text-muted-foreground space-y-1.5">
              {soarLog.length > 0 ? (
                soarLog.map((log, idx) => (
                  <div key={idx} className={log.includes("Step") ? "text-primary" : log.includes("firewall") ? "text-success font-semibold" : "text-foreground"}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-center py-10">SOAR Orchestration Logs ready for input...</div>
              )}
            </div>

            <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-secondary/20 p-4">
              <div>
                <span className="text-xs font-bold block mb-1 text-foreground">Playbook Blueprint: Isolate Subnet C-4</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Automated scripts isolate VMs, wipe cookies, block external ports, and generate backup registry snapshots. Action triggers automatically when Anomaly Score {`>`} 80.
                </p>
              </div>

              {soarActionState === "completed" && (
                <div className="mt-3 bg-success/15 border border-success/30 text-success text-xs font-medium p-2.5 rounded-lg flex items-center gap-2 animate-in zoom-in-95 duration-200">
                  <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                  <div>
                    <div>Threat Contained successfully.</div>
                    <div className="text-[9px] text-muted-foreground">Audit report logged at nic-cyber-incident-log-2026.json.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Component 4: Vulnerability Prioritization */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
            <UserCheck className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-sm">Government Infrastructure Vulnerability Prioritization</h2>
              <p className="text-[10px] text-muted-foreground">Real-time asset mapping against live CVE feeds</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold uppercase text-[10px]">
                  <th className="pb-2">CVE ID</th>
                  <th className="pb-2">Affected CNI Asset</th>
                  <th className="pb-2">CVSS Score</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Threat Actor Profile</th>
                </tr>
              </thead>
              <tbody>
                {remediationQueue.map((cve) => (
                  <tr key={cve.id} className="border-b border-border/50">
                    <td className="py-2.5 font-semibold font-mono text-primary">{cve.id}</td>
                    <td className="py-2.5">{cve.asset}</td>
                    <td className="py-2.5">
                      <span className="font-bold text-foreground">{cve.cvss}</span> / 10
                    </td>
                    <td className="py-2.5">
                      <Badge className={cve.status === "CRITICAL" ? "bg-danger/15 text-danger border-danger/30" : "bg-warning/15 text-warning border-warning/30"}>
                        {cve.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{cve.exploitability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
