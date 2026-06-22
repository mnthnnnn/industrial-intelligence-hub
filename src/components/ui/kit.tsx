import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Health } from "@/lib/mock-data";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>{children}</div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  tone?: "default" | "danger" | "warning" | "success";
}) {
  const toneCls = {
    default: "text-primary",
    danger: "text-danger",
    warning: "text-warning",
    success: "text-success",
  }[tone];
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        </div>
        {icon && <div className={cn("rounded-lg bg-secondary p-2", toneCls)}>{icon}</div>}
      </div>
    </Card>
  );
}

const healthMap: Record<Health, { label: string; cls: string; dot: string }> = {
  green: { label: "Healthy", cls: "bg-success/15 text-success border-success/30", dot: "bg-success" },
  yellow: { label: "Watch", cls: "bg-warning/15 text-warning border-warning/30", dot: "bg-warning" },
  red: { label: "Critical", cls: "bg-danger/15 text-danger border-danger/30", dot: "bg-danger" },
};

export function HealthBadge({ health, label }: { health: Health; label?: string }) {
  const h = healthMap[health];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", h.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", h.dot)} />
      {label ?? h.label}
    </span>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground", className)}>
      {children}
    </span>
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  const tone = value >= 75 ? "bg-success" : value >= 45 ? "bg-warning" : "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-xs font-medium text-muted-foreground">{value}%</span>
    </div>
  );
}
