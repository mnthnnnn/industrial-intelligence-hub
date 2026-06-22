import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FileStack,
  Share2,
  Bot,
  Wrench,
  SearchCheck,
  ShieldCheck,
  Lightbulb,
  BrainCircuit,
  Boxes,
  Search,
  Bell,
  Menu,
  X,
  QrCode,
  CheckCircle,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIndustrialState } from "@/lib/IndustrialState";

const industrialNav = [
  { to: "/", label: "Command Center", icon: LayoutDashboard },
  { to: "/assets", label: "Assets & Health", icon: Boxes },
  { to: "/documents", label: "Document Ingestion", icon: FileStack },
  { to: "/graph", label: "Knowledge Graph", icon: Share2 },
  { to: "/copilot", label: "Industrial Copilot", icon: Bot },
  { to: "/maintenance", label: "Maintenance Intel", icon: Wrench },
  { to: "/rca", label: "Root Cause Analysis", icon: SearchCheck },
  { to: "/compliance", label: "Compliance Intel", icon: ShieldCheck },
  { to: "/lessons", label: "Lessons Learned", icon: Lightbulb },
  { to: "/experts", label: "Expert Capture", icon: BrainCircuit },
] as const;

const crossSectorNav = [
  { to: "/public-safety", label: "Digital Public Safety", icon: ShieldAlert },
  { to: "/cyber-resilience", label: "Cyber Resilience", icon: Activity },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { assets } = useIndustrialState();
  const [open, setOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<typeof assets[0] | null>(null);
  
  const path = useRouterState({ select: (s) => s.location.pathname });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    window.location.href = `/copilot?q=${encodeURIComponent(searchVal)}`;
  };

  const simulateScan = (asset: typeof assets[0]) => {
    setScanning(true);
    setScannedAsset(null);
    setTimeout(() => {
      setScanning(false);
      setScannedAsset(asset);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-300">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">IKIP</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Asset Brain</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 pb-20 scrollbar-thin">
          <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">
            Industrial Intel (T8)
          </div>
          <nav className="flex flex-col gap-1 px-3 mb-4">
            {industrialNav.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border pt-4 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">
            Cross-Sector Showcase
          </div>
          <nav className="flex flex-col gap-1 px-3">
            {crossSectorNav.map((item) => {
              const active = path.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full border-t border-sidebar-border p-3 bg-sidebar shrink-0">
          <div className="rounded-lg bg-sidebar-accent p-3 text-xs text-muted-foreground">
            <div className="mb-1 font-medium text-sidebar-accent-foreground">8 AI agents online</div>
            Orchestration layer healthy
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border glass px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          {/* Header search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Ask anything: 'Show P-101 oil levels' or press Enter..."
              className="w-full rounded-lg border border-input bg-card/60 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-ring text-foreground"
            />
          </form>

          {/* QR Scan trigger */}
          <button 
            onClick={() => { setScanning(true); setScannedAsset(null); }}
            className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-card sm:flex cursor-pointer"
          >
            <QrCode className="h-4 w-4" /> Scan Asset
          </button>
          <button className="relative rounded-lg border border-border p-2 hover:bg-card">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
            PM
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {/* QR Scanning Simulator Modal */}
      {(scanning || scannedAsset) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-glow text-center">
            <div className="flex justify-between items-start mb-4 border-b border-border pb-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">QR Tag Scanning Agent</span>
              <button 
                onClick={() => { setScanning(false); setScannedAsset(null); }} 
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {scanning && (
              <div className="py-8 space-y-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary bg-primary/10 animate-bounce">
                  <QrCode className="h-10 w-10 text-primary" />
                </div>
                <div className="text-sm font-medium text-foreground">Point your camera or select tag to scan:</div>
                
                {/* Simulated list of asset tags */}
                <div className="space-y-1.5 text-left max-h-40 overflow-y-auto pr-1">
                  {assets.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => simulateScan(a)}
                      className="w-full text-xs text-left p-2 border border-border hover:border-primary/50 hover:bg-secondary/40 rounded-lg flex justify-between items-center"
                    >
                      <span className="font-semibold text-foreground">{a.name}</span>
                      <span className="font-mono text-primary text-[10px]">{a.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {scannedAsset && (
              <div className="py-4 space-y-4 text-left animate-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2 text-success bg-success/15 border border-success/30 rounded-lg p-2.5 text-xs font-semibold">
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  <span>Scan Successful! Asset tagged: {scannedAsset.id}</span>
                </div>

                <div className="rounded-lg border border-border bg-secondary/35 p-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Asset Name</span>
                    <div className="font-bold text-sm text-foreground">{scannedAsset.name}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground">Location</span>
                      <div className="font-medium">{scannedAsset.location}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground">Status</span>
                      <div className="capitalize font-semibold">{scannedAsset.health}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground">Telemetry Health Score</span>
                    <div className="mt-1"><ConfidenceBar value={scannedAsset.healthScore} /></div>
                  </div>
                </div>

                <Link 
                  to="/assets" 
                  onClick={() => { setScanning(false); setScannedAsset(null); }}
                  className="w-full text-center block rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  View Historical PM Logs
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
