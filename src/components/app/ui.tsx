import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, Bell, CheckCircle2, Info, Inbox, Loader2, TrendingDown, TrendingUp, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtDate, fmtTime, type AppNotification } from "@/lib/data";

/* ---------- LoadingSpinner ---------- */
export function LoadingSpinner({ className, label }: { className?: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Loader2 className={cn("size-4 animate-spin", className)} />
      {label && <span>{label}</span>}
    </span>
  );
}

/* ---------- Button ---------- */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-sm hover:brightness-110 hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
        outline: "border border-border bg-card text-foreground hover:border-primary/40 hover:text-primary",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        danger: "bg-destructive text-destructive-foreground hover:brightness-110",
        success: "bg-success text-success-foreground hover:brightness-110",
        ink: "bg-ink text-ink-foreground hover:brightness-125",
      },
      size: { sm: "h-9 px-3", md: "h-11 px-5", lg: "h-12 px-6 text-base", icon: "size-10" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

export function Button({ className, variant, size, loading, loadingText = "Processing...", children, disabled, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} {...props}>
      {loading ? <LoadingSpinner label={size === "icon" ? undefined : loadingText} /> : children}
    </button>
  );
}
export { buttonVariants };

/* ---------- Input ---------- */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}
export function Input({ label, error, icon, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">{icon}</span>}
        <input
          id={inputId}
          className={cn(
            "h-11 w-full rounded-xl border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
            icon && "pl-10",
            error && "border-destructive focus:border-destructive focus:ring-destructive/15",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

/* ---------- Card ---------- */
export function Card({ className, children, hover }: { className?: string; children: ReactNode; hover?: boolean }) {
  return <div className={cn("surface p-5 sm:p-6", hover && "surface-hover", className)}>{children}</div>;
}

/* ---------- Toggle ---------- */
export function Toggle({ checked, onChange, disabled, label }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
        checked ? "bg-primary" : "bg-input",
      )}
    >
      <span className={cn("inline-block size-5 rounded-full bg-card shadow transition-transform duration-300", checked ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}

/* ---------- StatusBadge ---------- */
export type Status = "ONLINE" | "OFFLINE" | "ON" | "OFF" | "WARNING" | "EMERGENCY" | "Paid" | "Pending" | "Overdue";
const tone: Record<Status, string> = {
  ONLINE: "bg-success/12 text-success",
  ON: "bg-success/12 text-success",
  Paid: "bg-success/12 text-success",
  OFFLINE: "bg-muted text-muted-foreground",
  OFF: "bg-muted text-muted-foreground",
  WARNING: "bg-warning/15 text-warning-foreground dark:text-warning",
  Pending: "bg-warning/15 text-warning-foreground dark:text-warning",
  EMERGENCY: "bg-destructive/12 text-destructive",
  Overdue: "bg-destructive/12 text-destructive",
};
export function StatusBadge({ status }: { status: Status }) {
  const pulse = status === "ONLINE" || status === "ON" || status === "EMERGENCY";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide", tone[status])}>
      <span className="relative flex size-1.5">
        {pulse && <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />}
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      {status}
    </span>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, className }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; className?: string }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn("relative w-full max-w-md rounded-t-3xl border border-border bg-card p-6 shadow-elevated animate-in fade-in slide-in-from-bottom-4 sm:rounded-2xl sm:zoom-in-95 duration-200", className)}
      >
        {title && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Close">
              <X className="size-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ---------- ConfirmationModal ---------- */
export function ConfirmationModal({
  open, onCancel, onConfirm, title = "Please confirm", message, loading, error, danger,
}: { open: boolean; onCancel: () => void; onConfirm: () => void; title?: string; message: string; loading?: boolean; error?: string | null; danger?: boolean }) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onCancel}>
      <div className={cn("mb-4 flex size-12 items-center justify-center rounded-2xl", danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{message}</p>
      {error && <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>}
      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button variant={danger ? "danger" : "primary"} className="flex-1" onClick={onConfirm} loading={loading} loadingText="Updating...">Confirm</Button>
      </div>
    </Modal>
  );
}

/* ---------- StatCard ---------- */
export function StatCard({
  icon, label, value, unit, description, trend, status, iconClass,
}: { icon: ReactNode; label: string; value: string | number; unit?: string; description?: string; trend?: number; status?: Status; iconClass?: string }) {
  return (
    <Card hover className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={cn("flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5", iconClass)}>{icon}</div>
        {status && <StatusBadge status={status} />}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {value}
          {unit && <span className="ml-1 text-base font-semibold text-muted-foreground">{unit}</span>}
        </p>
      </div>
      {(description || trend !== undefined) && (
        <div className="flex items-center justify-between gap-2 border-t border-border pt-3 text-xs">
          {description && <span className="text-muted-foreground">{description}</span>}
          {trend !== undefined && (
            <span className={cn("inline-flex items-center gap-1 font-semibold", trend >= 0 ? "text-destructive" : "text-success")}>
              {trend >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

/* ---------- ChartCard ---------- */
export function ChartCard({ title, subtitle, actions, children, className }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("min-w-0", className)}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </Card>
  );
}

/* ---------- EmptyState ---------- */
export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground [&_svg]:size-6">{icon ?? <Inbox />}</div>
      <p className="font-semibold">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

/* ---------- NotificationItem ---------- */
const nIcon = { info: Info, warning: AlertTriangle, success: CheckCircle2, danger: XCircle };
const nTone = { info: "bg-info/12 text-info", warning: "bg-warning/15 text-warning", success: "bg-success/12 text-success", danger: "bg-destructive/12 text-destructive" };
export function NotificationItem({ n, onRead, onRemove }: { n: AppNotification; onRead?: () => void; onRemove?: () => void }) {
  const Icon = nIcon[n.type] ?? Bell;
  return (
    <div className={cn("group flex gap-4 rounded-2xl border p-4 transition-colors", n.read ? "border-border bg-card" : "border-primary/20 bg-accent/50")}>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", nTone[n.type])}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{n.title}</p>
          {!n.read && <span className="size-2 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
        <p className="mt-1.5 text-xs text-muted-foreground">{fmtDate(n.date)} · {fmtTime(n.date)}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-start">
        {!n.read && onRead && <Button size="sm" variant="ghost" onClick={onRead}>Mark read</Button>}
        {onRemove && (
          <button onClick={onRemove} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive" aria-label="Remove">
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- PageHeader ---------- */
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

/* ---------- Segmented filter ---------- */
export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-all", value === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
