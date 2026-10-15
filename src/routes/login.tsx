import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock, User } from "lucide-react";
import { AuthShell } from "@/components/app/AuthShell";
import { Button, Input } from "@/components/app/ui";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () => seo("Login", "Sign in to monitor and control your home utilities."),
  component: Login,
});

function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (login(username, password)) navigate({ to: "/dashboard" });
    else {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your smart home account.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Username" name="username" icon={<User />} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="demo" autoComplete="username" />
        <Input label="Password" name="password" type="password" icon={<Lock />} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" autoComplete="current-password" />
        <div className="flex justify-end">
          <button type="button" onClick={() => setInfo("Password reset is not available in the demo. Use demo / demo123.")} className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </button>
        </div>
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>}
        {info && <p className="rounded-xl bg-accent px-3 py-2 text-sm text-accent-foreground">{info}</p>}
        <Button type="submit" className="w-full" size="lg" loading={loading}>Login</Button>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="font-semibold text-primary hover:underline">Register</Link>
        </p>
        <p className="rounded-xl border border-dashed border-border p-3 text-center text-xs text-muted-foreground">Demo account: <b>demo</b> / <b>demo123</b></p>
      </form>
    </AuthShell>
  );
}
