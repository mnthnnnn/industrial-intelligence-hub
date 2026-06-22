import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, Badge } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { UploadCloud, FileText, FileSpreadsheet, Image as ImageIcon, Mail, ScanLine, Tag, Boxes, Network, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Ingestion — IKIP" },
      { name: "description", content: "Universal ingestion of PDF, DOCX, XLSX, images, scans and emails with OCR, entity and metadata extraction." },
    ],
  }),
  component: Documents,
});

const typeIcon: Record<string, typeof FileText> = {
  PDF: FileText,
  DOCX: FileText,
  XLSX: FileSpreadsheet,
  CSV: FileSpreadsheet,
  Image: ImageIcon,
  Email: Mail,
};

const pipeline = [
  { icon: ScanLine, label: "OCR & Text Layer" },
  { icon: Tag, label: "Entity Extraction" },
  { icon: Boxes, label: "Semantic Chunking" },
  { icon: Network, label: "Classification & Graph Link" },
];

const entityTypes = ["Equipment IDs", "Asset Names", "Dates", "Personnel", "Procedures", "Failure Types", "Maintenance Activities", "Safety Risks", "Regulatory References"];

function statusBadge(status: string) {
  if (status === "processed") return <Badge className="bg-success/15 text-success border-success/30">Processed</Badge>;
  if (status === "processing") return <Badge className="bg-warning/15 text-warning border-warning/30">Processing</Badge>;
  return <Badge>Queued</Badge>;
}

function Documents() {
  const { documents, addDocument } = useIndustrialState();
  const [dragActive, setDragActive] = useState(false);
  const [justUploaded, setJustUploaded] = useState<string | null>(null);

  const processFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toUpperCase() || "TXT";
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string || "";
      // If the file is not a standard text file or is empty, use a generated context matching the filename
      let documentContent = text;
      if (!text || text.length < 10) {
        documentContent = `Simulated OCR contents for ${file.name}: Mentioning centrifugal Pump P-101. Standard Operating Procedure for isolate and lock-out tag-out. Last compliance audit standard OISD-118. Technicians on site registered high vibration levels.`;
      }
      addDocument(file.name, ext, sizeStr, documentContent);
      setJustUploaded(file.name);
      setTimeout(() => setJustUploaded(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <AppShell>
      <PageHeader title="Universal Document Ingestion" subtitle="PDF · DOCX · XLSX · CSV · Images · Scans · Email · Text — auto-processed into structured intelligence." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card 
          className={`lg:col-span-2 border-dashed transition-all duration-200 ${dragActive ? 'border-primary bg-primary/5' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 py-12 text-center relative">
            <UploadCloud className="h-10 w-10 text-primary" />
            <div className="mt-3 font-medium">Drop documents to ingest</div>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Files are OCR'd, entity-tagged, semantically chunked, classified, and linked into the knowledge graph automatically.
            </p>
            <label className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 cursor-pointer">
              Select files
              <input 
                type="file" 
                className="hidden" 
                accept=".txt,.pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg" 
                onChange={handleFileChange} 
              />
            </label>
          </div>

          {justUploaded && (
            <div className="mt-3 flex items-center gap-2 text-xs text-success bg-success/15 border border-success/30 rounded-lg p-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>"{justUploaded}" has been queued. OCR and entity extraction pipeline started.</span>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pipeline.map((p) => (
              <div key={p.label} className="flex items-center gap-2 rounded-lg bg-secondary/40 p-3 text-xs">
                <p.icon className="h-4 w-4 shrink-0 text-primary" />
                {p.label}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">Entities extracted</h2>
          <div className="flex flex-wrap gap-2">
            {entityTypes.map((e) => (
              <Badge key={e}>{e}</Badge>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-secondary/40 p-3 text-sm">
            <div className="text-2xl font-semibold">{documents.reduce((a, d) => a + d.entities, 0)}</div>
            <div className="text-xs text-muted-foreground">entities indexed across {documents.length} documents</div>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-4 font-semibold">Ingestion Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2">Document</th><th className="pb-2">Type</th><th className="pb-2">Classification</th><th className="pb-2">Entities</th><th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => {
                const Icon = typeIcon[d.type] ?? FileText;
                return (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground/90">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.size} · {d.uploaded}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5"><Badge>{d.type}</Badge></td>
                    <td className="py-2.5 text-muted-foreground">{d.classification}</td>
                    <td className="py-2.5 font-mono text-xs">{d.entities}</td>
                    <td className="py-2.5">{statusBadge(d.status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
