import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, Badge } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { ZoomIn, ZoomOut, Move, RotateCcw, Link2, Plus, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { type GraphNode } from "@/lib/mock-data";

export const Route = createFileRoute("/graph")({
  head: () => ({
    meta: [
      { title: "Knowledge Graph — IKIP" },
      { name: "description", content: "AI-generated knowledge graph linking assets, failures, records, personnel and procedures into one connected brain." },
    ],
  }),
  component: Graph,
});

const kindColor: Record<GraphNode["kind"], string> = {
  asset: "oklch(0.68 0.15 232)",
  record: "oklch(0.72 0.15 75)",
  failure: "oklch(0.62 0.22 25)",
  person: "oklch(0.7 0.16 300)",
  doc: "oklch(0.72 0.17 155)",
  action: "oklch(0.79 0.16 80)",
};

const legend: { kind: GraphNode["kind"]; label: string }[] = [
  { kind: "asset", label: "Asset" },
  { kind: "record", label: "Maintenance Record" },
  { kind: "failure", label: "Failure" },
  { kind: "doc", label: "Document" },
  { kind: "person", label: "Personnel" },
  { kind: "action", label: "Corrective Action" },
];

function Graph() {
  const { graphNodes, graphEdges, setGraphEdges } = useIndustrialState() as any;

  // Selected Node State
  const [selected, setSelected] = useState<GraphNode>(graphNodes[0] || { id: "P-101", label: "Pump P-101", kind: "asset" });

  // Zoom / Pan ViewBox State
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Category Filters State
  const [filters, setFilters] = useState<Record<string, boolean>>({
    asset: true,
    record: true,
    failure: true,
    person: true,
    doc: true,
    action: true,
  });

  // Relationship Modeler Form State
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [relLabel, setRelLabel] = useState("references");
  const [isLinking, setIsLinking] = useState(false);

  const nodeMap = Object.fromEntries(graphNodes.map((n: any) => [n.id, n]));

  // Filtered nodes and edges
  const visibleNodes = graphNodes.filter((n: any) => filters[n.kind]);
  const visibleNodeIds = new Set(visibleNodes.map((n: any) => n.id));
  const visibleEdges = graphEdges.filter(
    (e: any) => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)
  );

  const connected = visibleEdges
    .filter((e: any) => e.from === selected.id || e.to === selected.id)
    .map((e: any) => {
      const otherId = e.from === selected.id ? e.to : e.from;
      const node = graphNodes.find((n: any) => n.id === otherId)!;
      return { node, label: e.label };
    })
    .filter((c: any) => c.node !== undefined);

  const handleZoom = (factor: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(4, prev * factor)));
  };

  const handlePan = (dx: number, dy: number) => {
    setPanX((prev) => prev + dx / zoom);
    setPanY((prev) => prev + dy / zoom);
  };

  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromNode || !toNode || fromNode === toNode) return;
    
    // Add relationship edge directly using the state setter
    const newEdge = { from: fromNode, to: toNode, label: relLabel };
    setGraphEdges((prev: any) => [...prev, newEdge]);
    
    setFromNode("");
    setToNode("");
    setRelLabel("references");
    setIsLinking(false);
  };

  // SVG viewBox calculation
  const viewBoxWidth = 100 / zoom;
  const viewBoxHeight = 100 / zoom;
  const viewBoxStr = `${panX} ${panY} ${viewBoxWidth} ${viewBoxHeight}`;

  return (
    <AppShell>
      <PageHeader title="Enterprise Knowledge Graph" subtitle="AI-generated semantic network connecting assets, procedures, failures and engineering teams." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 mb-3">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Filter className="h-3.5 w-3.5" /> Filters:</span>
              {legend.map((l) => (
                <button
                  key={l.kind}
                  onClick={() => setFilters(prev => ({ ...prev, [l.kind]: !prev[l.kind] }))}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium cursor-pointer transition-all ${filters[l.kind] ? 'text-foreground' : 'text-muted-foreground opacity-40 border-transparent bg-transparent'}`}
                  style={{ 
                    borderColor: filters[l.kind] ? kindColor[l.kind] : "transparent",
                    background: filters[l.kind] ? `${kindColor[l.kind]}15` : "transparent"
                  }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: kindColor[l.kind] }} />
                  {l.label}
                </button>
              ))}
            </div>

            {/* SVG controls */}
            <div className="flex items-center gap-1 bg-secondary/35 rounded-lg border border-border p-1">
              <button onClick={() => handleZoom(1.2)} className="p-1 hover:bg-secondary rounded" title="Zoom In"><ZoomIn className="h-4 w-4" /></button>
              <button onClick={() => handleZoom(0.85)} className="p-1 hover:bg-secondary rounded" title="Zoom Out"><ZoomOut className="h-4 w-4" /></button>
              <button onClick={() => handlePan(-10, 0)} className="p-1 hover:bg-secondary rounded" title="Pan Left"><Move className="h-4 w-4 rotate-180" /></button>
              <button onClick={() => handlePan(10, 0)} className="p-1 hover:bg-secondary rounded" title="Pan Right"><Move className="h-4 w-4" /></button>
              <button onClick={() => handlePan(0, -10)} className="p-1 hover:bg-secondary rounded" title="Pan Up"><Move className="h-4 w-4 -rotate-90" /></button>
              <button onClick={() => handlePan(0, 10)} className="p-1 hover:bg-secondary rounded" title="Pan Down"><Move className="h-4 w-4 rotate-90" /></button>
              <button onClick={handleReset} className="p-1 hover:bg-secondary rounded" title="Reset View"><RotateCcw className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border grid-bg">
            <svg viewBox={viewBoxStr} className="h-full w-full select-none" preserveAspectRatio="xMidYMid meet">
              {visibleEdges.map((e: any, i: number) => {
                const a = nodeMap[e.from];
                const b = nodeMap[e.to];
                if (!a || !b) return null;
                const active = e.from === selected.id || e.to === selected.id;
                return (
                  <g key={i}>
                    <line
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={active ? "oklch(0.68 0.15 232)" : "oklch(0.35 0.02 250)"}
                      strokeWidth={active ? 0.75 : 0.4}
                    />
                    {active && (
                      <text 
                        x={(a.x + b.x) / 2} 
                        y={(a.y + b.y) / 2 - 1.5} 
                        textAnchor="middle" 
                        fontSize={1.8} 
                        fill="oklch(0.68 0.15 232)"
                        fontWeight="semibold"
                      >
                        {e.label}
                      </text>
                    )}
                  </g>
                );
              })}
              {visibleNodes.map((n: any) => {
                const active = n.id === selected.id;
                const linked = connected.some((c: any) => c.node.id === n.id);
                return (
                  <g key={n.id} onClick={() => setSelected(n)} className="cursor-pointer group">
                    <circle
                      cx={n.x} cy={n.y}
                      r={active ? 4.5 : linked ? 3.5 : 2.8}
                      fill={kindColor[n.kind]}
                      opacity={active || linked ? 1 : 0.7}
                      stroke={active ? "white" : "transparent"}
                      strokeWidth={0.5}
                      className="transition-all duration-150 group-hover:scale-110"
                    />
                    <text 
                      x={n.x} 
                      y={n.y - 5.5} 
                      textAnchor="middle" 
                      fontSize={active ? 2.5 : 2} 
                      fill={active ? "white" : "oklch(0.85 0.01 240)"}
                      fontWeight={active ? "bold" : "normal"}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Selected node</div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: kindColor[selected.kind] }} />
              <h2 className="text-lg font-semibold">{selected.label}</h2>
            </div>
            <Badge className="mt-2 capitalize bg-secondary/50">{selected.kind}</Badge>

            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
              Connected ({connected.length})
            </div>
            <div className="mt-2 space-y-2 max-h-[30vh] overflow-y-auto pr-1">
              {connected.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No connections matching current filters.</span>
              ) : (
                connected.map((c: any) => (
                  <button
                    key={c.node.id}
                    onClick={() => setSelected(c.node)}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/40 p-2.5 text-left hover:bg-secondary cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: kindColor[c.node.kind] }} />
                      <span className="text-sm font-medium">{c.node.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{c.label}</span>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <h3 className="text-sm font-semibold flex items-center gap-1.5"><Link2 className="h-4 w-4 text-primary" /> Relationship Modeler</h3>
              <button 
                onClick={() => setIsLinking(!isLinking)}
                className="text-xs text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add Link
              </button>
            </div>

            {isLinking ? (
              <form onSubmit={handleCreateLink} className="space-y-3 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Source Node (From)</label>
                  <select 
                    required 
                    value={fromNode} 
                    onChange={(e) => setFromNode(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"
                  >
                    <option value="">Select source...</option>
                    {graphNodes.map((n: any) => (
                      <option key={n.id} value={n.id}>{n.label} ({n.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Relationship Label</label>
                  <select 
                    value={relLabel} 
                    onChange={(e) => setRelLabel(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"
                  >
                    <option value="has record">has record</option>
                    <option value="reports">reports</option>
                    <option value="confirmed by">confirmed by</option>
                    <option value="performed by">performed by</option>
                    <option value="resolved via">resolved via</option>
                    <option value="documented in">documented in</option>
                    <option value="governed by">governed by</option>
                    <option value="inspected in">inspected in</option>
                    <option value="references">references</option>
                    <option value="advises on">advises on</option>
                    <option value="undergoing">undergoing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Target Node (To)</label>
                  <select 
                    required 
                    value={toNode} 
                    onChange={(e) => setToNode(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none"
                  >
                    <option value="">Select target...</option>
                    {graphNodes.map((n: any) => (
                      <option key={n.id} value={n.id}>{n.label} ({n.id})</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit" 
                    className="flex-1 rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 cursor-pointer"
                  >
                    Link Nodes
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsLinking(false)}
                    className="flex-1 rounded-lg border border-border py-2 text-xs text-muted-foreground hover:bg-secondary cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect documents, technicians, and assets manually to record custom operational structures. Use "Add Link" to update the graph.
              </p>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
