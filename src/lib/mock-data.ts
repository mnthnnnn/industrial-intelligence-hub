// Centralized industrial mock data powering all platform modules.

export type Health = "green" | "yellow" | "red";

export interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  health: Health;
  healthScore: number;
  lastMaintenance: string;
  openWorkOrders: number;
  failures: number;
}

export const assets: Asset[] = [
  { id: "P-101", name: "Centrifugal Pump P-101", type: "Pump", location: "Unit 2 — Crude Distillation", health: "red", healthScore: 41, lastMaintenance: "2026-03-12", openWorkOrders: 3, failures: 7 },
  { id: "C-202", name: "Reciprocating Compressor C-202", type: "Compressor", location: "Unit 4 — Gas Handling", health: "yellow", healthScore: 67, lastMaintenance: "2026-05-02", openWorkOrders: 1, failures: 3 },
  { id: "HX-310", name: "Shell & Tube Exchanger HX-310", type: "Heat Exchanger", location: "Unit 2 — Crude Distillation", health: "green", healthScore: 88, lastMaintenance: "2026-04-18", openWorkOrders: 0, failures: 1 },
  { id: "V-115", name: "Control Valve V-115", type: "Valve", location: "Unit 1 — Feed", health: "yellow", healthScore: 72, lastMaintenance: "2026-02-28", openWorkOrders: 2, failures: 4 },
  { id: "T-040", name: "Storage Tank T-040", type: "Tank", location: "Tank Farm", health: "green", healthScore: 91, lastMaintenance: "2026-01-20", openWorkOrders: 0, failures: 0 },
  { id: "M-220", name: "Induction Motor M-220", type: "Motor", location: "Unit 4 — Gas Handling", health: "red", healthScore: 38, lastMaintenance: "2026-05-30", openWorkOrders: 2, failures: 5 },
  { id: "B-501", name: "Package Boiler B-501", type: "Boiler", location: "Utilities", health: "green", healthScore: 84, lastMaintenance: "2026-04-01", openWorkOrders: 0, failures: 1 },
  { id: "F-118", name: "Process Fan F-118", type: "Fan", location: "Unit 1 — Feed", health: "yellow", healthScore: 63, lastMaintenance: "2026-03-25", openWorkOrders: 1, failures: 2 },
];

export interface Doc {
  id: string;
  name: string;
  type: string;
  classification: string;
  entities: number;
  status: "processed" | "processing" | "queued";
  uploaded: string;
  size: string;
}

export const documents: Doc[] = [
  { id: "D-1001", name: "OEM Manual — Pump P-101.pdf", type: "PDF", classification: "Equipment Manual", entities: 142, status: "processed", uploaded: "2026-06-20", size: "8.4 MB" },
  { id: "D-1002", name: "Maintenance Work Order #52.docx", type: "DOCX", classification: "Work Order", entities: 38, status: "processed", uploaded: "2026-06-20", size: "220 KB" },
  { id: "D-1003", name: "Inspection Report Q2 — Unit 2.pdf", type: "PDF", classification: "Inspection Report", entities: 96, status: "processed", uploaded: "2026-06-19", size: "3.1 MB" },
  { id: "D-1004", name: "OISD-118 Compliance Audit.pdf", type: "PDF", classification: "Compliance", entities: 211, status: "processed", uploaded: "2026-06-18", size: "5.7 MB" },
  { id: "D-1005", name: "Vibration Logs C-202.xlsx", type: "XLSX", classification: "Operational Record", entities: 64, status: "processing", uploaded: "2026-06-22", size: "1.2 MB" },
  { id: "D-1006", name: "Bearing Failure Incident.scan.jpg", type: "Image", classification: "Incident Report", entities: 27, status: "processing", uploaded: "2026-06-22", size: "2.9 MB" },
  { id: "D-1007", name: "SOP — Pump Isolation & LOTO.pdf", type: "PDF", classification: "SOP", entities: 53, status: "queued", uploaded: "2026-06-22", size: "640 KB" },
  { id: "D-1008", name: "Vendor Emails — Seal Supplier.eml", type: "Email", classification: "Correspondence", entities: 19, status: "queued", uploaded: "2026-06-22", size: "88 KB" },
];

export interface GraphNode {
  id: string;
  label: string;
  kind: "asset" | "record" | "failure" | "person" | "doc" | "action";
  x: number;
  y: number;
}
export interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

export const graphNodes: GraphNode[] = [
  { id: "P-101", label: "Pump P-101", kind: "asset", x: 50, y: 50 },
  { id: "WO-52", label: "Work Order #52", kind: "record", x: 22, y: 22 },
  { id: "FAIL", label: "Bearing Failure", kind: "failure", x: 80, y: 24 },
  { id: "INSP", label: "Inspection Rpt Q2", kind: "doc", x: 84, y: 70 },
  { id: "JOHN", label: "Tech. John D.", kind: "person", x: 18, y: 78 },
  { id: "CA", label: "Corrective Action", kind: "action", x: 50, y: 88 },
  { id: "OEM", label: "OEM Manual", kind: "doc", x: 14, y: 50 },
  { id: "SOP", label: "Isolation SOP", kind: "doc", x: 50, y: 14 },
];

export const graphEdges: GraphEdge[] = [
  { from: "P-101", to: "WO-52", label: "has record" },
  { from: "WO-52", to: "FAIL", label: "reports" },
  { from: "FAIL", to: "INSP", label: "confirmed by" },
  { from: "WO-52", to: "JOHN", label: "performed by" },
  { from: "FAIL", to: "CA", label: "resolved via" },
  { from: "P-101", to: "OEM", label: "documented in" },
  { from: "P-101", to: "SOP", label: "governed by" },
  { from: "P-101", to: "INSP", label: "inspected in" },
  { from: "CA", to: "OEM", label: "references" },
];

export interface WorkOrder {
  id: string;
  asset: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Closed";
  date: string;
}

export const workOrders: WorkOrder[] = [
  { id: "WO-061", asset: "P-101", title: "Replace inboard bearing assembly", priority: "High", status: "In Progress", date: "2026-06-19" },
  { id: "WO-058", asset: "M-220", title: "Investigate winding overtemperature", priority: "High", status: "Open", date: "2026-06-18" },
  { id: "WO-055", asset: "V-115", title: "Recalibrate positioner", priority: "Medium", status: "Open", date: "2026-06-16" },
  { id: "WO-052", asset: "P-101", title: "Mechanical seal leak — top up & monitor", priority: "Medium", status: "In Progress", date: "2026-06-14" },
  { id: "WO-049", asset: "C-202", title: "Valve plate inspection", priority: "Low", status: "Closed", date: "2026-06-10" },
];

export const failureTrend = [
  { month: "Jan", failures: 4, planned: 12 },
  { month: "Feb", failures: 6, planned: 14 },
  { month: "Mar", failures: 9, planned: 11 },
  { month: "Apr", failures: 5, planned: 16 },
  { month: "May", failures: 8, planned: 13 },
  { month: "Jun", failures: 3, planned: 15 },
];

export const failureByType = [
  { type: "Bearing", count: 14 },
  { type: "Seal", count: 11 },
  { type: "Electrical", count: 8 },
  { type: "Corrosion", count: 6 },
  { type: "Vibration", count: 5 },
];

export interface ComplianceItem {
  standard: string;
  area: string;
  score: number;
  status: Health;
  gaps: string[];
}

export const compliance: ComplianceItem[] = [
  { standard: "OISD-118", area: "Fire & Safety Inspections", score: 92, status: "green", gaps: [] },
  { standard: "Factory Act", area: "Pressure Vessel Certification", score: 71, status: "yellow", gaps: ["HX-310 certification expires in 21 days"] },
  { standard: "Environmental", area: "Emission Monitoring Records", score: 58, status: "red", gaps: ["2 missing CEMS monthly reports", "Stack test overdue (Unit 4)"] },
  { standard: "Internal SOP", area: "LOTO Verification", score: 88, status: "green", gaps: [] },
  { standard: "Safety Std.", area: "PPE & Training Logs", score: 64, status: "yellow", gaps: ["3 technicians overdue for refresher"] },
];

export interface RcaCause {
  cause: string;
  likelihood: "Most likely" | "Moderately likely" | "Low likelihood";
  confidence: number;
  evidence: string[];
}

export const rcaCauses: RcaCause[] = [
  {
    cause: "Inadequate lubrication interval on inboard bearing",
    likelihood: "Most likely",
    confidence: 86,
    evidence: ["WO-52 noted seal leak 14 days prior", "Vibration logs show rising 1x harmonic from May", "OEM manual specifies 90-day greasing; last record 156 days ago"],
  },
  {
    cause: "Misalignment after previous coupling replacement",
    likelihood: "Moderately likely",
    confidence: 54,
    evidence: ["Coupling replaced in WO-41 (Feb)", "Inspection Rpt Q2 flagged elevated axial vibration"],
  },
  {
    cause: "Process upset causing cavitation",
    likelihood: "Low likelihood",
    confidence: 22,
    evidence: ["Suction pressure within range per DCS trend", "No operator log of upset events"],
  },
];

export interface Lesson {
  pattern: string;
  occurrences: number;
  assets: string[];
  recommendation: string;
  severity: Health;
}

export const lessons: Lesson[] = [
  { pattern: "Mechanical seal failure preceding bearing failure on centrifugal pumps", occurrences: 7, assets: ["P-101", "P-104", "P-220"], recommendation: "Replace seal every 120 days; add seal-leak detection to PM checklist", severity: "red" },
  { pattern: "Motor winding overtemp after monsoon humidity ingress", occurrences: 4, assets: ["M-220", "M-118"], recommendation: "Install space heaters; verify IP rating before wet season", severity: "yellow" },
  { pattern: "Valve positioner drift after recalibration", occurrences: 3, assets: ["V-115"], recommendation: "Use updated calibration SOP rev. 4; verify air supply quality", severity: "yellow" },
];

export interface ExpertNote {
  id: string;
  author: string;
  role: string;
  type: "Voice Note" | "Recommendation" | "Field Note";
  asset: string;
  summary: string;
  date: string;
}

export const expertNotes: ExpertNote[] = [
  { id: "E-01", author: "R. Mehta", role: "Sr. Rotating Equipment Engineer (32 yrs)", type: "Voice Note", asset: "P-101", summary: "On P-101 always check the auxiliary flush plan 23 — clogging here is the silent killer behind most seal failures we've seen.", date: "2026-06-15" },
  { id: "E-02", author: "S. Khan", role: "Maintenance Superintendent (28 yrs)", type: "Recommendation", asset: "C-202", summary: "C-202 valve plates fatigue early when discharge temp creeps above 140°C. Trend it weekly, don't wait for the quarterly.", date: "2026-06-10" },
  { id: "E-03", author: "A. Iyer", role: "Reliability Lead (24 yrs)", type: "Field Note", asset: "M-220", summary: "M-220 trips correlate with cooling fan dust loading. A 2-week cleaning cadence in summer eliminated nuisance trips.", date: "2026-06-05" },
];

export interface CopilotSource {
  doc: string;
  excerpt: string;
}
export interface CopilotAnswer {
  q: string;
  answer: string;
  confidence: number;
  sources: CopilotSource[];
  related: string[];
}

export const copilotKB: CopilotAnswer[] = [
  {
    q: "Why did Pump P-101 fail last year?",
    answer:
      "Pump P-101 experienced an inboard bearing failure. The most likely root cause (86% confidence) was inadequate lubrication — the last greasing record was 156 days before failure against an OEM-specified 90-day interval. A mechanical seal leak logged in Work Order #52 fourteen days prior accelerated contamination ingress into the bearing.",
    confidence: 86,
    sources: [
      { doc: "Work Order #52", excerpt: "Mechanical seal leak observed, top-up performed, monitoring requested." },
      { doc: "OEM Manual — Pump P-101", excerpt: "Re-grease inboard bearing every 90 days under continuous duty." },
      { doc: "Inspection Report Q2 — Unit 2", excerpt: "Rising 1x harmonic vibration; bearing condition graded marginal." },
    ],
    related: ["RCA Report — P-101", "Lessons Learned: Seal→Bearing pattern"],
  },
  {
    q: "Which SOP should be followed before maintenance on P-101?",
    answer:
      "Follow SOP — Pump Isolation & LOTO before any maintenance on P-101. Key steps: isolate suction/discharge valves, apply lock-out/tag-out, verify zero energy state, and confirm flush plan 23 is depressurized. Senior engineer R. Mehta flags flush plan 23 clogging as a frequent precursor to seal issues.",
    confidence: 92,
    sources: [
      { doc: "SOP — Pump Isolation & LOTO", excerpt: "Isolate, lock-out, verify zero energy, depressurize auxiliary systems." },
      { doc: "Expert Note — R. Mehta", excerpt: "Always check auxiliary flush plan 23 on P-101." },
    ],
    related: ["Generate maintenance checklist", "Asset: P-101"],
  },
  {
    q: "Show all valve failures in the last 2 years.",
    answer:
      "Across the plant, 4 valve-related failures are recorded in the last 24 months, primarily on Control Valve V-115 (positioner drift after recalibration). The recurring pattern has triggered a Lessons Learned alert recommending calibration SOP rev. 4 and air-supply quality checks.",
    confidence: 79,
    sources: [
      { doc: "Inspection Report Q2 — Unit 2", excerpt: "V-115 positioner output deviating from setpoint." },
      { doc: "Lessons Learned DB", excerpt: "Valve positioner drift after recalibration — 3 occurrences." },
    ],
    related: ["Asset: V-115", "Compliance: Internal SOP"],
  },
];

export const stats = {
  totalAssets: assets.length,
  activeRisks: 5,
  complianceScore: 76,
  openWorkOrders: workOrders.filter((w) => w.status !== "Closed").length,
  incidents: 12,
  documents: documents.length,
  entities: documents.reduce((a, d) => a + d.entities, 0),
  relationships: graphEdges.length * 47,
};
