import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo />
          <h1 className="mt-10 text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-ink text-ink-foreground lg:flex lg:flex-col lg:justify-end lg:p-14">
        <div className="grid-dots absolute inset-0 opacity-40" />
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/40 blur-3xl" />
        <div className="relative">
          <ShieldCheck className="size-10 text-primary" />
          <p className="mt-6 max-w-md text-3xl font-bold leading-tight">Know what's running at home — wherever you are.</p>
          <p className="mt-3 max-w-md opacity-70">Electricity, gas and water status, remote control and payments in one secure place.</p>
        </div>
      </div>
    </div>
  );
}
