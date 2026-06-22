import React, { createContext, useContext, useState, useEffect } from "react";
import {
  assets as initialAssets,
  documents as initialDocuments,
  workOrders as initialWorkOrders,
  compliance as initialCompliance,
  expertNotes as initialExpertNotes,
  graphNodes as initialGraphNodes,
  graphEdges as initialGraphEdges,
  rcaCauses as initialRcaCauses,
  copilotKB as initialCopilotKB,
  lessons as initialLessons,
  type Asset,
  type Doc,
  type GraphNode,
  type GraphEdge,
  type WorkOrder,
  type ComplianceItem,
  type ExpertNote,
  type RcaCause,
  type CopilotAnswer,
  type Lesson
} from "./mock-data";

interface Stats {
  totalAssets: number;
  activeRisks: number;
  complianceScore: number;
  openWorkOrders: number;
  incidents: number;
  documents: number;
  entities: number;
  relationships: number;
}

interface IndustrialStateContextType {
  assets: Asset[];
  documents: Doc[];
  workOrders: WorkOrder[];
  compliance: ComplianceItem[];
  expertNotes: ExpertNote[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  rcaCauses: RcaCause[];
  copilotKB: CopilotAnswer[];
  lessons: Lesson[];
  stats: Stats;
  kpis: { id: string; label: string; active: boolean }[];
  toggleKpi: (id: string) => void;
  addDocument: (name: string, type: string, size: string, fileContent: string) => void;
  addExpertNote: (author: string, role: string, type: "Voice Note" | "Recommendation" | "Field Note", asset: string, summary: string) => void;
  addWorkOrder: (asset: string, title: string, priority: "High" | "Medium" | "Low") => void;
  generateRca: (assetId: string, failureEvent: string) => void;
  runComplianceAudit: () => void;
  searchKB: (query: string) => CopilotAnswer;
}

const IndustrialStateContext = createContext<IndustrialStateContextType | undefined>(undefined);

export const useIndustrialState = () => {
  const context = useContext(IndustrialStateContext);
  if (!context) {
    throw new Error("useIndustrialState must be used within an IndustrialStateProvider");
  }
  return context;
};

export const IndustrialStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [documents, setDocuments] = useState<Doc[]>(initialDocuments);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [compliance, setCompliance] = useState<ComplianceItem[]>(initialCompliance);
  const [expertNotes, setExpertNotes] = useState<ExpertNote[]>(initialExpertNotes);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>(initialGraphNodes);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>(initialGraphEdges);
  const [rcaCauses, setRcaCauses] = useState<RcaCause[]>(initialRcaCauses);
  const [copilotKB, setCopilotKB] = useState<CopilotAnswer[]>(initialCopilotKB);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const [kpis, setKpis] = useState([
    { id: "assets", label: "Total Assets", active: true },
    { id: "risks", label: "Active Risks", active: true },
    { id: "compliance", label: "Compliance Score", active: true },
    { id: "workOrders", label: "Open Work Orders", active: true },
    { id: "incidents", label: "Incidents (YTD)", active: true },
  ]);

  const [stats, setStats] = useState<Stats>({
    totalAssets: initialAssets.length,
    activeRisks: 5,
    complianceScore: 76,
    openWorkOrders: initialWorkOrders.filter((w) => w.status !== "Closed").length,
    incidents: 12,
    documents: initialDocuments.length,
    entities: initialDocuments.reduce((sum, d) => sum + d.entities, 0),
    relationships: initialGraphEdges.length * 47,
  });

  const toggleKpi = (id: string) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, active: !k.active } : k))
    );
  };

  // Recalculate stats whenever dependent state changes
  useEffect(() => {
    const totalAssets = assets.length;
    const activeRisks = assets.filter((a) => a.health !== "green").length + compliance.filter((c) => c.status === "red").length;
    const avgCompliance = Math.round(compliance.reduce((acc, c) => acc + c.score, 0) / (compliance.length || 1));
    const openWOs = workOrders.filter((w) => w.status !== "Closed").length;
    const docsCount = documents.length;
    const entitiesCount = documents.reduce((sum, d) => sum + d.entities, 0);
    const relationshipsCount = graphEdges.length * 12;

    setStats((prev) => ({
      ...prev,
      totalAssets,
      activeRisks,
      complianceScore: avgCompliance,
      openWorkOrders: openWOs,
      documents: docsCount,
      entities: entitiesCount,
      relationships: relationshipsCount,
    }));
  }, [assets, documents, workOrders, compliance, graphEdges]);

  // Simulates OCR processing and automatic entity extraction + knowledge graph linking
  const addDocument = (name: string, type: string, size: string, fileContent: string) => {
    const id = `D-${1000 + documents.length + 1}`;
    
    // 1. Regex scanning for known entity patterns: Asset ID, Standards, Keywords
    const assetMatches = Array.from(new Set(fileContent.match(/\b[PCVMTB]-[0-9]{3}\b/g) || []));
    const standardsMatches = Array.from(new Set(fileContent.match(/\b(OISD-[0-9]{3}|Factory Act|Compliance)\b/gi) || []));
    
    const entitiesFound = (assetMatches.length * 10) + (standardsMatches.length * 15) + 8; // base entities

    const newDoc: Doc = {
      id,
      name,
      type,
      classification: standardsMatches.length > 0 ? "Compliance Regulation" : assetMatches.length > 0 ? "Technical Specification" : "General Manual",
      entities: entitiesFound,
      status: "queued",
      uploaded: new Date().toISOString().split("T")[0],
      size,
    };

    setDocuments((prev) => [...prev, newDoc]);

    // Simulate async pipeline: Queued -> Processing -> Processed
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "processing" } : d))
      );
    }, 800);

    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "processed" } : d))
      );

      // Link newly discovered entities in Knowledge Graph
      const xVal = 30 + Math.random() * 40;
      const yVal = 30 + Math.random() * 40;
      const docNode: GraphNode = {
        id,
        label: name.replace(/\.[a-zA-Z0-9]+$/, ""),
        kind: "doc",
        x: xVal,
        y: yVal,
      };

      setGraphNodes((prev) => [...prev, docNode]);

      // Connect to detected assets
      assetMatches.forEach((assetId) => {
        const edge: GraphEdge = {
          from: assetId,
          to: id,
          label: "documented in",
        };
        setGraphEdges((prev) => [...prev, edge]);
      });

      // Index document sentences in Copilot knowledge base
      const sentences = fileContent.split(/[.?!]+/).map(s => s.trim()).filter(s => s.length > 10);
      if (sentences.length > 0) {
        const answers: CopilotAnswer[] = assetMatches.map((assetId) => ({
          q: `Tell me about ${assetId} in ${name}`,
          answer: `According to ${name}, ${sentences.slice(0, 3).join(". ")}.`,
          confidence: 88,
          sources: [
            { doc: name, excerpt: sentences[0] || "Found reference inside document." }
          ],
          related: [`Asset: ${assetId}`, `Document: ${id}`]
        }));
        setCopilotKB((prev) => [...prev, ...answers]);
      }

    }, 2000);
  };

  // Add notes from engineers and link to Graph
  const addExpertNote = (
    author: string,
    role: string,
    type: "Voice Note" | "Recommendation" | "Field Note",
    asset: string,
    summary: string
  ) => {
    const id = `E-${10 + expertNotes.length + 1}`;
    const newNote: ExpertNote = {
      id,
      author,
      role,
      type,
      asset,
      summary,
      date: new Date().toISOString().split("T")[0],
    };

    setExpertNotes((prev) => [...prev, newNote]);

    // Graph Node
    const noteNode: GraphNode = {
      id,
      label: `${author} (${type})`,
      kind: "person",
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    };

    setGraphNodes((prev) => [...prev, noteNode]);

    // Graph Edge link to Asset
    const edge: GraphEdge = {
      from: id,
      to: asset,
      label: "advises on",
    };
    setGraphEdges((prev) => [...prev, edge]);

    // Update Copilot KB with the expert note
    const q1 = `What did ${author} recommend for ${asset}?`;
    const q2 = `Tacit tips for ${asset}`;
    const customAnswers: CopilotAnswer[] = [
      {
        q: q1,
        answer: `${author} (${role}) provided a ${type.toLowerCase()} stating: "${summary}"`,
        confidence: 95,
        sources: [{ doc: `Expert Note — ${author}`, excerpt: summary }],
        related: [`Asset: ${asset}`, `Note: ${id}`],
      },
      {
        q: q2,
        answer: `Retiring expert ${author} advises: "${summary}"`,
        confidence: 90,
        sources: [{ doc: `Expert Note — ${author}`, excerpt: summary }],
        related: [`Asset: ${asset}`],
      }
    ];

    setCopilotKB((prev) => [...prev, ...customAnswers]);
  };

  const addWorkOrder = (assetId: string, title: string, priority: "High" | "Medium" | "Low") => {
    const id = `WO-${String(workOrders.length + 65).padStart(3, "0")}`;
    const newWO: WorkOrder = {
      id,
      asset: assetId,
      title,
      priority,
      status: "Open",
      date: new Date().toISOString().split("T")[0],
    };

    setWorkOrders((prev) => [newWO, ...prev]);

    // Update health of target asset
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          const wOrders = a.openWorkOrders + 1;
          const scoreDiff = priority === "High" ? 15 : priority === "Medium" ? 7 : 2;
          const newScore = Math.max(10, a.healthScore - scoreDiff);
          const health = newScore > 75 ? "green" : newScore > 45 ? "yellow" : "red";
          return {
            ...a,
            openWorkOrders: wOrders,
            healthScore: newScore,
            health,
          };
        }
        return a;
      })
    );

    // Link in Graph
    const woNode: GraphNode = {
      id,
      label: `Work Order ${id}`,
      kind: "record",
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
    };
    setGraphNodes((prev) => [...prev, woNode]);

    const edge: GraphEdge = {
      from: assetId,
      to: id,
      label: "undergoing",
    };
    setGraphEdges((prev) => [...prev, edge]);
  };

  const generateRca = (assetId: string, failureEvent: string) => {
    const matchingLogs = workOrders.filter(w => w.asset === assetId && w.status === "Closed");
    const notes = expertNotes.filter(n => n.asset === assetId);

    const generatedCauses: RcaCause[] = [
      {
        cause: `Failure pattern associated with ${failureEvent} on ${assetId}`,
        likelihood: "Most likely",
        confidence: 89,
        evidence: [
          `Detected ${matchingLogs.length} similar closed maintenance records`,
          notes[0] ? `Expert Mehta notes check flush plans: "${notes[0].summary}"` : "Vibration trend deviation observed in inspection log",
          "Last service log exceeds OEM-recommended timeframe by 45 days"
        ]
      },
      {
        cause: "Ancillary component fatigue (e.g. alignment issue)",
        likelihood: "Moderately likely",
        confidence: 58,
        evidence: [
          `Historical failure pattern matches for asset type: ${assets.find(a => a.id === assetId)?.type}`
        ]
      }
    ];

    setRcaCauses(generatedCauses);
  };

  const runComplianceAudit = () => {
    // Audit gap analysis: scans compliance targets, checks if documents are missing
    setCompliance((prev) =>
      prev.map((c) => {
        let status: "green" | "yellow" | "red" = "green";
        let score = c.score;
        let gaps = [...c.gaps];

        if (c.standard === "Factory Act") {
          // check if we have pressure vessel certification documents
          const docsExist = documents.some(d => d.name.toLowerCase().includes("pressure") || d.name.toLowerCase().includes("vessel"));
          if (!docsExist) {
            status = "red";
            score = 55;
            gaps = ["No active pressure vessel certs uploaded!", ...c.gaps.filter(g => !g.includes("pressure"))];
          } else {
            status = "green";
            score = 95;
            gaps = [];
          }
        } else if (c.standard === "Environmental") {
          const emissionsDocs = documents.some(d => d.name.toLowerCase().includes("emission") || d.name.toLowerCase().includes("log"));
          if (emissionsDocs) {
            status = "yellow";
            score = 75;
            gaps = ["Overdue emissions stack test reports remain pending."];
          }
        }

        return { ...c, status, score, gaps };
      })
    );
  };

  // RAG Search with Grounded Evidence and Citations
  const searchKB = (query: string): CopilotAnswer => {
    const lower = query.toLowerCase().trim();
    if (!lower) {
      return { q: query, answer: "", confidence: 0, sources: [], related: [] };
    }

    // Exact matches in our knowledge base
    const hit = copilotKB.find((k) => {
      // Direct substring match
      if (k.q.toLowerCase().includes(lower) || lower.includes(k.q.toLowerCase())) return true;
      // Keywords overlapping
      const keywords = k.q.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const overlap = keywords.filter((w) => lower.includes(w)).length;
      return overlap >= 2;
    });

    if (hit) return hit;

    // Build dynamic search match from documents, notes, assets
    const matchedDocs = documents.filter(
      (d) => d.name.toLowerCase().includes(lower) || d.classification.toLowerCase().includes(lower)
    );
    const matchedNotes = expertNotes.filter(
      (n) => n.summary.toLowerCase().includes(lower) || n.author.toLowerCase().includes(lower)
    );
    const matchedAssets = assets.filter(
      (a) => a.name.toLowerCase().includes(lower) || a.id.toLowerCase().includes(lower) || a.location.toLowerCase().includes(lower)
    );

    const sources = [
      ...matchedDocs.map(d => ({ doc: d.name, excerpt: `Document classified as ${d.classification} containing operational parameters.` })),
      ...matchedNotes.map(n => ({ doc: `Expert Note — ${n.author}`, excerpt: n.summary })),
      ...matchedAssets.map(a => ({ doc: `Asset Health Registry — ${a.id}`, excerpt: `${a.name} is located in ${a.location} with health status ${a.health} (Score: ${a.healthScore}).` }))
    ];

    if (sources.length > 0) {
      const summaryText = `Found relevant data points in ${sources.length} sources. ${sources.map((s, idx) => `[${idx+1}] ${s.excerpt}`).join(" ")}`;
      return {
        q: query,
        answer: summaryText,
        confidence: Math.min(95, 40 + sources.length * 15),
        sources,
        related: matchedAssets.map(a => `Asset: ${a.id}`).concat(matchedDocs.map(d => `Doc: ${d.id}`))
      };
    }

    return {
      q: query,
      answer: "Insufficient evidence found in the local repository. No matching operational manuals, engineering records, or compliance checklists support an answer for this query.",
      confidence: 0,
      sources: [],
      related: [],
    };
  };

  return (
    <IndustrialStateContext.Provider
      value={{
        assets,
        documents,
        workOrders,
        compliance,
        expertNotes,
        graphNodes,
        graphEdges,
        rcaCauses,
        copilotKB,
        lessons,
        stats,
        kpis,
        toggleKpi,
        addDocument,
        addExpertNote,
        addWorkOrder,
        generateRca,
        runComplianceAudit,
        searchKB,
      }}
    >
      {children}
    </IndustrialStateContext.Provider>
  );
};
