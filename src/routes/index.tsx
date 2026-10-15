import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity, ArrowRight, BarChart3, CreditCard, Droplets, Flame, Home, Menu, Power, ShieldCheck, UserPlus, Wallet, X, Zap,
} from "lucide-react";
import { Logo } from "@/components/app/Logo";
import { buttonVariants, StatusBadge } from "@/components/app/ui";
import { UsageAreaChart, COLORS } from "@/components/app/charts";
import { weeklyUsage } from "@/lib/data";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => seo("Smart Home & Utility Management", "Watch electricity, gas and water from anywhere, switch them remotely and pay utility bills in one secure platform."),
  component: Landing,
});

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#how", label: "How It Works" },
  { href: "#features", label: "Features" },
];

const STEPS = [
  { icon: UserPlus, title: "Create an account", text: "Sign up in under a minute with just a username and email." },
  { icon: Home, title: "Connect your home", text: "Link your smart meters and controllers to your profile." },
  { icon: Activity, title: "Monitor devices", text: "See live readings and status of every utility in real time." },
  { icon: Power, title: "Control utilities", text: "Switch electricity, gas and water on or off from anywhere." },
  { icon: Wallet, title: "Pay your bills", text: "Settle every utility bill securely without leaving the app." },
];

const FEATURES = [
  { icon: Zap, title: "Smart Electricity", text: "Live load, voltage and bill forecasting for every circuit." },
  { icon: Flame, title: "Smart Gas", text: "Pressure monitoring with instant warning and emergency alerts." },
  { icon: Droplets, title: "Smart Water", text: "Track flow and consumption, shut off the main remotely." },
  { icon: Power, title: "Remote Control", text: "Confirmed, logged switching of every system from your phone." },
  { icon: CreditCard, title: "Utility Payments", text: "One place for electricity, gas, water, heating and internet." },
  { icon: BarChart3, title: "Analytics", text: "Daily, weekly and yearly trends to cut waste and costs." },
];

const TIMELINE = [
  { year: "2024", title: "The idea", text: "Born from the frustration of leaving home unsure whether the gas was off." },
  { year: "2025", title: "Development", text: "Built the monitoring core, remote control layer and payment flow." },
  { year: "2026", title: "Launch", text: "Platform launched for households who want calm, control and clarity." },
];

function Landing() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{n.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>Login</Link>
            <Link to="/register" className={buttonVariants({ size: "sm" })}>Get Started</Link>
          </div>
          <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden animate-in slide-in-from-top-2">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">{n.label}</a>
            ))}
            <Link to="/login" className={cn(buttonVariants({ variant: "outline" }), "mt-3 w-full")}>Login</Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="grid-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="size-3.5 text-success" /> Secure remote utility control
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Your home's utilities, <span className="text-primary">in your pocket.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              See electricity, gas and water status while you're away, switch them remotely and pay every bill from one calm, secure dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className={buttonVariants({ size: "lg" })}>Get Started <ArrowRight className="size-4" /></Link>
              <a href="#about" className={buttonVariants({ variant: "outline", size: "lg" })}>Learn More</a>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              {[["24/7", "Monitoring"], ["3", "Utilities"], ["<1s", "Remote switch"]].map(([a, b]) => (
                <div key={b}><p className="text-2xl font-bold">{a}</p><p className="text-muted-foreground">{b}</p></div>
              ))}
            </div>
          </div>
          <DashboardPreview />
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-y border-border bg-card py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">About</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Peace of mind for every household.</h2>
            <p className="mt-4 text-muted-foreground">
              VoltraHome connects your meters and controllers to one platform. Whether you're at work or on holiday, you always know what's running at home, what it costs, and you can act in seconds.
            </p>
          </div>
          <ol className="relative space-y-8 border-l-2 border-border pl-8">
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[41px] top-1 flex size-5 items-center justify-center rounded-full border-4 border-card bg-primary" />
                <p className="text-sm font-bold text-primary">{t.year}</p>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-muted-foreground">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="How It Works" title="Five steps to a smarter home" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <div key={s.title} className="surface surface-hover p-6">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><s.icon className="size-5" /></div>
                  <span className="text-3xl font-extrabold text-border">0{i + 1}</span>
                </div>
                <p className="mt-5 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-ink py-20 text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Features" title="Everything your utilities need" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-ink-foreground/10 bg-ink-foreground/[0.04] p-6 transition-colors hover:border-primary/50 hover:bg-ink-foreground/[0.07]">
                <f.icon className="size-6 text-primary" />
                <p className="mt-5 font-semibold">{f.title}</p>
                <p className="mt-1 text-sm opacity-70">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <h3 className="text-2xl font-bold">Ready to take control?</h3>
            <Link to="/register" className={buttonVariants({ size: "lg" })}>Create free account <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Logo />
          <p>© 2026 VoltraHome. Demo platform — no real devices or payments.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

function DashboardPreview() {
  const tiles = [
    { icon: Zap, label: "Electricity", value: "82 kWh" },
    { icon: Flame, label: "Gas", value: "34 m³" },
    { icon: Droplets, label: "Water", value: "18 m³" },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
      <div className="surface relative p-4 shadow-elevated sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <p className="font-semibold">Home overview</p>
          </div>
          <StatusBadge status="ONLINE" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl border border-border bg-background p-3">
              <t.icon className="size-4 text-primary" />
              <p className="mt-2 text-xs text-muted-foreground">{t.label}</p>
              <p className="text-sm font-bold sm:text-base">{t.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-border bg-background p-3">
          <UsageAreaChart data={weeklyUsage} series={[{ key: "electricity", name: "Electricity", color: COLORS.electricity }]} height={160} />
        </div>
      </div>
    </div>
  );
}
