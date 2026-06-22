import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, PageHeader, HealthBadge, Badge } from "@/components/ui/kit";
import { useIndustrialState } from "@/lib/IndustrialState";
import { Lightbulb, AlertTriangle, Repeat } from "lucide-react";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lessons Learned — IKIP" },
      { name: "description", content: "Organizational learning database that detects recurring failure patterns and pushes preventive-action alerts." },
    ],
  }),
  component: Lessons,
});

function Lessons() {
  const { lessons } = useIndustrialState();

  return (
    <AppShell>
      <PageHeader title="Lessons Learned Intelligence" subtitle="Recurring patterns mined from incidents, near misses, audit findings and quality deviations." />

      <div className="space-y-3">
        {lessons.map((l) => (
          <Card key={l.pattern} className="border-l-4 hover:border-primary/30 transition-colors duration-150" >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-warning/15 p-2 text-warning">
                  <Repeat className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground/95">{l.pattern}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge className="bg-danger/15 text-danger border-danger/30">
                      <AlertTriangle className="mr-1 h-3 w-3" /> Occurred {l.occurrences}× before
                    </Badge>
                    {l.assets.map((a) => <Badge key={a}>{a}</Badge>)}
                  </div>
                </div>
              </div>
              <HealthBadge health={l.severity} />
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-success/10 p-3">
              <Lightbulb className="h-4 w-4 shrink-0 text-success" />
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-success">Recommended preventive action</div>
                <p className="text-sm text-foreground/90">{l.recommendation}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
