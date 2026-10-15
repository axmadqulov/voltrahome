import { createFileRoute } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Lock, Mail, User } from "lucide-react";
import { Button, Card, Input, PageHeader, Toggle } from "@/components/app/ui";
import { useStore } from "@/lib/store";
import { NOTIF_PREFS } from "@/lib/prefs";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => seo("Profile", "Your account details and notification preferences."),
  component: Profile,
});


function Profile() {
  const { user, updateProfile, prefs, setPrefs } = useStore();
  const [editing, setEditing] = useState(false);
  const [f, setF] = useState({ username: user?.username ?? "", email: user?.email ?? "", password: "", avatar: user?.avatar ?? "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const start = () => { setF({ username: user?.username ?? "", email: user?.email ?? "", password: "", avatar: user?.avatar ?? "" }); setMsg(null); setEditing(true); };

  const onAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setF((p) => ({ ...p, avatar: String(r.result) }));
    r.readAsDataURL(file);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.username.trim()) return setMsg({ ok: false, text: "Username is required." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setMsg({ ok: false, text: "Invalid email address." });
    if (f.password && f.password.length < 6) return setMsg({ ok: false, text: "Password must be at least 6 characters." });
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const err = updateProfile({ username: f.username.trim(), email: f.email.trim(), avatar: f.avatar || undefined, ...(f.password ? { password: f.password } : {}) });
    setLoading(false);
    if (err) return setMsg({ ok: false, text: err });
    setMsg({ ok: true, text: "Profile updated." });
    setEditing(false);
  };

  const avatar = editing ? f.avatar : user?.avatar;

  return (
    <>
      <PageHeader title="Profile" description="Manage your personal information." actions={!editing && <Button onClick={start}>Edit Profile</Button>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center">
          <div className="relative">
            {avatar ? <img src={avatar} alt="Avatar" className="size-24 rounded-3xl object-cover" /> :
              <span className="flex size-24 items-center justify-center rounded-3xl bg-primary text-3xl font-bold text-primary-foreground">{(user?.username ?? "U").charAt(0).toUpperCase()}</span>}
            {editing && (
              <label className="absolute -bottom-2 -right-2 flex size-9 cursor-pointer items-center justify-center rounded-xl border border-border bg-card shadow transition-colors hover:text-primary">
                <Camera className="size-4" /><input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
              </label>
            )}
          </div>
          <p className="mt-4 text-lg font-bold">{user?.username}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </Card>
        <Card className="lg:col-span-2">
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Username" name="username" icon={<User />} disabled={!editing} value={editing ? f.username : user?.username ?? ""} onChange={(e) => setF({ ...f, username: e.target.value })} />
              <Input label="Email" name="email" icon={<Mail />} disabled={!editing} value={editing ? f.email : user?.email ?? ""} onChange={(e) => setF({ ...f, email: e.target.value })} />
            </div>
            <Input label="Password" name="password" type="password" icon={<Lock />} disabled={!editing} placeholder={editing ? "Leave blank to keep current" : "••••••••"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
            {msg && <p className={msg.ok ? "rounded-xl bg-success/12 px-3 py-2 text-sm font-medium text-success" : "rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"}>{msg.text}</p>}
            {editing && (
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="submit" loading={loading}>Save changes</Button>
              </div>
            )}
          </form>
        </Card>
      </div>
      <Card className="mt-6">
        <h3 className="mb-2 font-semibold">Notifications</h3>
        <div className="divide-y divide-border">
          {NOTIF_PREFS.map((p) => (
            <div key={p.key} className="flex items-center justify-between gap-4 py-4">
              <div><p className="font-medium">{p.label}</p><p className="text-sm text-muted-foreground">{p.desc}</p></div>
              <Toggle checked={Boolean(prefs[p.key])} onChange={(v) => setPrefs({ [p.key]: v })} label={p.label} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
