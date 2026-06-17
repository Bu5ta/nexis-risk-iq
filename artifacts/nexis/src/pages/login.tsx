import React, { useState } from "react";
import { useLocation } from "wouter";
import { useTenant } from "@/lib/tenant-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Building2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL;

// ─── Role definitions ──────────────────────────────────────────────────────────

const DEMO_ROLES = [
  {
    id: "Manager - Risk and Compliance",
    label: "Manager — Risk and Compliance",
    desc: "Full access: verify evidence, review ratings, manage dashboard",
    color: "bg-violet-500/10 border-violet-500/30 text-violet-400",
  },
  {
    id: "Risk Champion",
    label: "Risk Champion",
    desc: "Data entry: update controls, quarterly scores, evidence submission",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  },
  {
    id: "Director / Head of Department",
    label: "Director / Head of Department",
    desc: "Review and confirm departmental ratings and evidence",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  },
  {
    id: "Executive Management",
    label: "Executive Management",
    desc: "Dashboard overview, executive summaries and board reports",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  },
  {
    id: "Risk Owner",
    label: "Risk Owner",
    desc: "Manage and track own assigned risks and control actions",
    color: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  },
];

const DEMO_TENANTS = [
  {
    id: "ten-gov",
    name: "National Revenue Authority",
    sector: "Government",
    country: "🇧🇼",
    description: "Tax administration and fiscal oversight body",
  },
  {
    id: "ten-para",
    name: "Meridian Power & Utilities",
    sector: "Parastatal",
    country: "🇧🇼",
    description: "State-owned energy generation and distribution",
  },
  {
    id: "ten-priv",
    name: "Apex Financial Services",
    sector: "Private Sector",
    country: "🇧🇼",
    description: "Banking, insurance and investment management",
  },
];

// ─── Feature highlights ────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Shield, text: "ISO 31000 & COSO-aligned risk register with full control lifecycle tracking" },
  { icon: BarChart3, text: "Board-ready dashboards with real-time KPIs, risk appetite, and assurance ratings" },
  { icon: Users, text: "Enterprise RBAC from Risk Champions to Executive Management and the Board" },
];

// ─── Company Sign-In Panel ─────────────────────────────────────────────────────

function CompanySignIn({ onBack }: { onBack: () => void }) {
  const [, setLocation] = useLocation();
  const { setTenant, setRole, setUser, setDemoMode } = useTenant();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }
      setTenant(data.tenant.id);
      setRole(data.user.role);
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        department: data.user.department,
        tenantId: data.user.tenantId,
      });
      setDemoMode(false);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      setLocation("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center max-w-sm mx-auto w-full">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 self-start transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-2xl font-bold mb-1">Sign in to your workspace</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Enter your company credentials to access NEXIS Risk-IQ.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Work Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@yourorganisation.co.bw"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPw(v => !v)}
              tabIndex={-1}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-6 text-center">
        Not onboarded yet?{" "}
        <a href="mailto:info@riskinteg.co.bw" className="underline hover:text-foreground">
          Contact RiskInteg
        </a>{" "}
        to get started.
      </p>
    </div>
  );
}

// ─── Demo Picker ───────────────────────────────────────────────────────────────

function DemoPicker({ onBack }: { onBack: () => void }) {
  const [, setLocation] = useLocation();
  const { setTenant, setRole, setUser, setDemoMode } = useTenant();
  const [expandedTenant, setExpandedTenant] = useState<string | null>(DEMO_TENANTS[0].id);

  const handleDemoLogin = (tenantId: string, tenantName: string, roleId: string) => {
    setTenant(tenantId);
    setRole(roleId);
    setUser(null);
    setDemoMode(true);
    toast.success(`Entered demo: ${tenantName}`);
    setLocation("/dashboard");
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 self-start transition-colors shrink-0"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-6 shrink-0">
        <h2 className="text-2xl font-bold mb-1">Demo Environment</h2>
        <p className="text-muted-foreground text-sm">
          Choose an organisation and role to explore NEXIS Risk-IQ with realistic sample data.
        </p>
      </div>

      <div className="space-y-3 overflow-y-auto">
        {DEMO_TENANTS.map(tenant => (
          <div
            key={tenant.id}
            className="border rounded-xl overflow-hidden bg-card transition-colors"
          >
            <button
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedTenant(v => v === tenant.id ? null : tenant.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{tenant.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs">{tenant.sector}</Badge>
                    <span className="text-xs text-muted-foreground">{tenant.description}</span>
                  </div>
                </div>
              </div>
              {expandedTenant === tenant.id
                ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
              }
            </button>

            {expandedTenant === tenant.id && (
              <div className="border-t bg-muted/20">
                <p className="text-xs text-muted-foreground px-4 pt-3 pb-2 font-medium uppercase tracking-wider">
                  Select your role
                </p>
                <div className="grid grid-cols-1 gap-1.5 px-3 pb-3">
                  {DEMO_ROLES.map(role => (
                    <button
                      key={role.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-left hover:opacity-90 transition-opacity ${role.color}`}
                      onClick={() => handleDemoLogin(tenant.id, tenant.name, role.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                      <div>
                        <div className="text-sm font-medium">{role.label}</div>
                        <div className="text-xs opacity-70 mt-0.5">{role.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center shrink-0 pt-2 border-t">
        Demo data is read from a realistic sample dataset — no real data is at risk.
      </p>
    </div>
  );
}

// ─── Landing (default view) ────────────────────────────────────────────────────

function LandingView({ onCompanyLogin, onDemo }: { onCompanyLogin: () => void; onDemo: () => void }) {
  return (
    <div className="flex flex-col items-center justify-between h-full text-center py-2">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <img
          src={`${BASE}images/nexis-icon.svg`}
          alt="NEXIS"
          className="w-9 h-9 drop-shadow-[0_0_12px_rgba(0,212,255,0.4)]"
        />
        <div className="text-left">
          <div className="text-xl font-bold tracking-tight leading-tight">NEXIS</div>
          <div className="text-sm font-light text-primary leading-tight">Risk-IQ</div>
        </div>
      </div>

      {/* Headline */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Enterprise Risk Intelligence<br />
          <span className="text-primary">at global standard</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          ISO 31000 · COSO · King IV aligned — purpose-built for Botswana and the global community. Governance without compromise.
        </p>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <button
          onClick={onCompanyLogin}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/70 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-sm">Sign In</div>
            <div className="text-xs text-muted-foreground mt-0.5">Company workspace</div>
          </div>
        </button>

        <button
          onClick={onDemo}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-muted hover:border-muted-foreground/40 bg-muted/30 hover:bg-muted/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sm">Explore Demo</div>
            <div className="text-xs text-muted-foreground mt-0.5">Try with sample data</div>
          </div>
        </button>
      </div>

      {/* Feature list */}
      <ul className="space-y-1.5 text-left w-full max-w-sm">
        {FEATURES.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <f.icon className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
            {f.text}
          </li>
        ))}
      </ul>

      {/* Partnership footer */}
      <div className="flex items-center justify-center gap-3 border-t pt-3 w-full max-w-sm">
        <p className="text-xs text-muted-foreground">A NEXIS product · In partnership with</p>
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white rounded-lg overflow-hidden shrink-0" style={{ width: 28, height: 28 }}>
            <img
              src={`${BASE}images/riskinteg-brochure.jpg`}
              alt="RiskInteg"
              style={{ width: 28, height: 28, objectFit: "contain" }}
            />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold leading-tight">RiskInteg</div>
            <div className="text-xs text-muted-foreground leading-tight">info@riskinteg.co.bw</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root Login Page ───────────────────────────────────────────────────────────

type View = "landing" | "company" | "demo";

export default function Login() {
  const [view, setView] = useState<View>("landing");

  return (
    <div className="min-h-[100dvh] w-full bg-background flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 border-r border-border/50">
        <div className="flex items-center gap-3">
          <img
            src={`${BASE}images/nexis-icon.svg`}
            alt="NEXIS"
            className="w-10 h-10 drop-shadow-[0_0_12px_rgba(0,212,255,0.5)]"
          />
          <div>
            <div className="text-xl font-bold text-white leading-tight">NEXIS</div>
            <div className="text-sm font-light text-primary/90 leading-tight">Risk-IQ</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-3">
              Global-standard risk intelligence
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              ISO 31000, COSO, and King IV aligned. Built for Botswana's leading organisations — and designed to scale globally.
            </p>
          </div>

          <div className="space-y-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-slate-300 text-sm leading-snug mt-1">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">Trusted RBAC roles</div>
            <div className="flex flex-col gap-1.5">
              {DEMO_ROLES.map(r => (
                <div key={r.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${r.color.includes("violet") ? "bg-violet-400" : r.color.includes("blue") ? "bg-blue-400" : r.color.includes("amber") ? "bg-amber-400" : r.color.includes("emerald") ? "bg-emerald-400" : "bg-orange-400"}`} />
                  <span className="text-xs text-slate-400">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs text-slate-600 uppercase tracking-wider font-medium">In partnership with</div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl overflow-hidden" style={{ width: 52, height: 52 }}>
              <img
                src={`${BASE}images/riskinteg-brochure.jpg`}
                alt="RiskInteg"
                style={{ width: 52, height: 52, objectFit: "contain" }}
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">RiskInteg Solution Services</div>
              <div className="text-xs text-slate-500">info@riskinteg.co.bw</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right content panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-lg h-full flex flex-col justify-center py-2">
          {view === "landing" && (
            <LandingView
              onCompanyLogin={() => setView("company")}
              onDemo={() => setView("demo")}
            />
          )}
          {view === "company" && <CompanySignIn onBack={() => setView("landing")} />}
          {view === "demo" && <DemoPicker onBack={() => setView("landing")} />}
        </div>
      </div>
    </div>
  );
}
