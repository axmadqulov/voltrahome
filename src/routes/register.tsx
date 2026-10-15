import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock, Mail, User } from "lucide-react";
import { AuthShell } from "@/components/app/AuthShell";
import { Button, Input } from "@/components/app/ui";
import { useStore } from "@/lib/store";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () => seo("Create account", "Register to start managing your home's electricity, gas and water."),
  component: Register,
});

type Errors = Partial<Record<"username" | "email" | "password" | "confirm" | "form", string>>;

function Register() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ username: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (!f.username.trim()) er.username = "Username is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = "Invalid email address.";
    if (f.password.length < 6) er.password = "Password must be at least 6 characters.";
    if (f.password !== f.confirm) er.confirm = "Passwords do not match.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const err = register({ username: f.username.trim(), email: f.email.trim(), password: f.password });
    if (err) {
      setErrors({ username: err });
      setLoading(false);
      return;
    }
    navigate({ to: "/login" });
  };

  const bind = (k: keyof typeof f) => ({ value: f[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value }), error: errors[k] });

  return (
    <AuthShell title="Create your account" subtitle="Start monitoring your home in minutes.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input label="Username" name="username" icon={<User />} placeholder="johndoe" {...bind("username")} />
        <Input label="Email" name="email" type="email" icon={<Mail />} placeholder="you@example.com" {...bind("email")} />
        <Input label="Password" name="password" type="password" icon={<Lock />} placeholder="At least 6 characters" {...bind("password")} />
        <Input label="Confirm Password" name="confirm" type="password" icon={<Lock />} placeholder="Repeat password" {...bind("confirm")} />
        <Button type="submit" className="w-full" size="lg" loading={loading}>Create account</Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
        </p>
      </form>
    </AuthShell>
  );
}
