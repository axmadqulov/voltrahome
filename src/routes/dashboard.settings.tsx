import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Bell, Globe, Moon, ShieldCheck } from "lucide-react";
import { Card, PageHeader, Toggle } from "@/components/app/ui";
import { NOTIF_PREFS } from "@/lib/prefs";
import { useStore, type Prefs } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => seo("Settings", "Appearance, language, notifications and security settings."),
  component: Settings,
});

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card>
      <div className="mb-2 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </Card>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div><p className="font-medium">{label}</p>{desc && <p className="text-sm text-muted-foreground">{desc}</p>}</div>
      {children}
    </div>
  );
}

function Settings() {
  const { prefs, setPrefs, user } = useStore();
  const [lastLogin] = useState(() => new Date().toLocaleString("en-GB"));
  return (
    <>
      <PageHeader title="Settings" description="Personalise how the platform works for you." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Section icon={<Moon />} title="Appearance">
          <Row label="Dark Mode" desc="Switch to a darker interface"><Toggle checked={prefs.dark} onChange={(v) => setPrefs({ dark: v })} label="Dark mode" /></Row>
        </Section>
        <Section icon={<Globe />} title="Language">
          <Row label="Interface language">
            <select value={prefs.language} onChange={(e) => setPrefs({ language: e.target.value as Prefs["language"] })} className="h-10 rounded-xl border border-input bg-card px-3 text-sm focus:border-primary focus:outline-none">
              <option value="en">English</option><option value="uz">O'zbekcha</option><option value="ru">Русский</option>
            </select>
          </Row>
        </Section>
        <Section icon={<Bell />} title="Notifications">
          {NOTIF_PREFS.map((p) => (
            <Row key={p.key} label={p.label} desc={p.desc}><Toggle checked={Boolean(prefs[p.key])} onChange={(v) => setPrefs({ [p.key]: v })} label={p.label} /></Row>
          ))}
        </Section>
        <Section icon={<ShieldCheck />} title="Security">
          <Row label="Two-factor authentication" desc="Require a code when signing in"><Toggle checked={prefs.twoFactor} onChange={(v) => setPrefs({ twoFactor: v })} label="Two-factor" /></Row>
          <Row label="Signed in as" desc={`Session started ${lastLogin}`}><span className="text-sm font-semibold">{user?.username}</span></Row>
        </Section>
      </div>
    </>
  );
}
