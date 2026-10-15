import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5 font-bold tracking-tight", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Zap className="size-5" />
      </span>
      {!compact && <span className="text-lg">Voltra<span className="text-primary">Home</span></span>}
    </Link>
  );
}
