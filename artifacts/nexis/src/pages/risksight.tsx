import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTenant } from "@/lib/tenant-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Sparkles,
  Send,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  Shield,
  ChevronRight,
  Bot,
  User,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface Analytics {
  riskVelocity: { overdueChange: number; implementedChange: number; trend: string };
  anomalies: Array<{ id: string; control: string; department: string; residualScore: number; zScore: number; status: string; riskLevel: string }>;
  meanRiskScore: number;
  stdDevRiskScore: number;
  forecast: Array<{ month: string; projected: number; confidence: number }>;
  deptConcentration: Array<{ department: string; share: number; residualTotal: number; highRiskCount: number; status: string }>;
  reductionEfficiency: number;
  criticalPath: Array<{ id: string; control: string; department: string; owner: string; residualScore: number }>;
  mlScore: number;
  trendHistory: Array<{ month: string; complianceRate: number; implemented: number; overdue: number }>;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function RiskSightAI() {
  const { currentTenant } = useTenant();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [briefing, setBriefing] = useState("");
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingDone, setBriefingDone] = useState(false);
  const [briefingError, setBriefingError] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello. I'm RiskSight AI — your intelligent risk analysis assistant. Ask me anything about your current risk posture, overdue controls, appetite breaches, or department performance." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchAnalytics = useCallback(async () => {
    if (!currentTenant) return;
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/ai/analytics/${currentTenant}`);
      const data = await res.json();
      setAnalytics(data);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [currentTenant]);

  const fetchBriefing = useCallback(async () => {
    if (!currentTenant) return;
    setBriefing("");
    setBriefingError("");
    setBriefingDone(false);
    setBriefingLoading(true);
    try {
      const res = await fetch(`/api/ai/briefing/${currentTenant}`);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.error) { setBriefingError(json.error); break; }
              if (json.content) setBriefing((prev) => prev + json.content);
              if (json.done) setBriefingDone(true);
            } catch {}
          }
        }
      }
    } catch (e) {
      setBriefingError(e instanceof Error ? e.message : "Network error");
    } finally {
      setBriefingLoading(false);
      setBriefingDone(true);
    }
  }, [currentTenant]);

  useEffect(() => {
    fetchAnalytics();
    fetchBriefing();
  }, [fetchAnalytics, fetchBriefing]);

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading || !currentTenant) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    let assistantContent = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: currentTenant,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.error) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: `⚠️ ${json.error}` };
                  return updated;
                });
                break;
              }
              if (json.content) {
                assistantContent += json.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: `⚠️ ${e instanceof Error ? e.message : "Network error"}` };
        return updated;
      });
    } finally {
      setChatLoading(false);
    }
  };

  const velocityIcon = analytics?.riskVelocity.trend === "improving"
    ? <TrendingUp className="w-5 h-5 text-emerald-500" />
    : analytics?.riskVelocity.trend === "deteriorating"
    ? <TrendingDown className="w-5 h-5 text-destructive" />
    : <Minus className="w-5 h-5 text-muted-foreground" />;

  const mlScoreColor = !analytics ? "" : analytics.mlScore >= 75 ? "text-emerald-500" : analytics.mlScore >= 55 ? "text-amber-500" : "text-destructive";

  const suggestedQuestions = [
    "Which department has the highest risk concentration?",
    "What are our top 3 overdue high-risk controls?",
    "How are we trending on compliance this quarter?",
    "Which appetite breaches need immediate board attention?",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">RiskSight AI</h1>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-mono text-[10px]">BETA</Badge>
          </div>
          <p className="text-muted-foreground">Smart insights that surface patterns, flag emerging risks, and guide better decisions — automatically</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Executive Briefing</CardTitle>
                {briefingLoading && !briefingDone && (
                  <Badge variant="outline" className="text-[10px] animate-pulse">Generating…</Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={fetchBriefing} disabled={briefingLoading} className="h-8 gap-1.5">
                <RefreshCw className={`w-3.5 h-3.5 ${briefingLoading ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
            </CardHeader>
            <CardContent>
              {briefingError ? (
                <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{briefingError}</span>
                </div>
              ) : !briefing && briefingLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{briefing}</p>
                  {briefingLoading && !briefingDone && (
                    <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">Ask RiskSight AI</CardTitle>
              </div>
              <CardDescription>Natural language queries against your live risk data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.length === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => { setChatInput(q); }}
                      className="text-left text-xs p-2.5 rounded-md border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 shrink-0 text-primary" />
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <ScrollArea className="h-72 pr-3">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${msg.role === "assistant" ? "bg-primary/20" : "bg-muted"}`}>
                        {msg.role === "assistant"
                          ? <Brain className="w-4 h-4 text-primary" />
                          : <User className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === "assistant" ? "bg-muted/50 text-foreground" : "bg-primary text-primary-foreground"}`}>
                        {msg.content
                          ? <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          : <span className="inline-block w-1 h-4 bg-current animate-pulse" />}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
                  placeholder="Ask about risks, controls, compliance…"
                  disabled={chatLoading}
                  className="flex-1"
                />
                <Button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Risk-IQ Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-2">
              {analyticsLoading ? <Skeleton className="h-20 w-24 mx-auto" /> : (
                <>
                  <div className={`text-6xl font-black tracking-tight ${mlScoreColor}`}>
                    {analytics?.mlScore}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">out of 100</div>
                  <Badge className={`mt-2 ${
                    (analytics?.mlScore ?? 0) >= 75 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    (analytics?.mlScore ?? 0) >= 55 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                    "bg-destructive/10 text-destructive border-destructive/20"
                  }`}>
                    {(analytics?.mlScore ?? 0) >= 75 ? "Healthy" : (analytics?.mlScore ?? 0) >= 55 ? "Moderate Risk" : "Elevated Risk"}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed">
                    Composite of compliance rate (40%), appetite adherence (30%), and control effectiveness (30%)
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {velocityIcon} Risk Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? <Skeleton className="h-16" /> : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Overdue trend (3mo)</span>
                    <span className={`text-sm font-bold ${(analytics?.riskVelocity.overdueChange ?? 0) > 0 ? "text-destructive" : "text-emerald-500"}`}>
                      {(analytics?.riskVelocity.overdueChange ?? 0) > 0 ? "+" : ""}{analytics?.riskVelocity.overdueChange} items
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Implemented (3mo)</span>
                    <span className={`text-sm font-bold ${(analytics?.riskVelocity.implementedChange ?? 0) >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                      {(analytics?.riskVelocity.implementedChange ?? 0) > 0 ? "+" : ""}{analytics?.riskVelocity.implementedChange} items
                    </span>
                  </div>
                  <div className={`text-[11px] font-semibold uppercase tracking-wider mt-2 ${
                    analytics?.riskVelocity.trend === "improving" ? "text-emerald-500" :
                    analytics?.riskVelocity.trend === "deteriorating" ? "text-destructive" :
                    "text-muted-foreground"
                  }`}>
                    {analytics?.riskVelocity.trend}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Control Effectiveness
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? <Skeleton className="h-16" /> : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Risk Reduction</span>
                    <span className="text-lg font-bold text-primary">{analytics?.reductionEfficiency}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${analytics?.reductionEfficiency ?? 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Inherent → residual score reduction across all controls</p>
                </div>
              )}
            </CardContent>
          </Card>

          {analyticsLoading ? <Skeleton className="h-32" /> : analytics && analytics.criticalPath.length > 0 && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                  <Zap className="w-4 h-4" /> Critical Path ({analytics.criticalPath.length})
                </CardTitle>
                <CardDescription className="text-[11px]">Overdue + High Risk + Appetite Breach</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {analytics.criticalPath.slice(0, 3).map((item) => (
                  <div key={item.id} className="text-xs border-l-2 border-destructive pl-2 py-0.5">
                    <div className="font-medium truncate">{item.control}</div>
                    <div className="text-muted-foreground">{item.department} • Score: {item.residualScore}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Compliance Forecast
            </CardTitle>
            <CardDescription>6-month history + 3-month ML projection (linear regression)</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? <Skeleton className="h-48" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={[
                    ...(analytics?.trendHistory ?? []),
                    ...(analytics?.forecast.map((f) => ({
                      month: f.month,
                      complianceRate: undefined,
                      projected: f.projected,
                      confidence: f.confidence,
                    })) ?? []),
                  ]}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(value: unknown, name: string) => [
                      `${value}%`,
                      name === "complianceRate" ? "Actual" : "Projected"
                    ]}
                  />
                  <ReferenceLine y={90} stroke="hsl(var(--primary))" strokeDasharray="4 4" label={{ value: "Target 90%", fontSize: 10, fill: "hsl(var(--primary))" }} />
                  <Line type="monotone" dataKey="complianceRate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} name="Actual" />
                  <Line type="monotone" dataKey="projected" stroke="hsl(142 71% 45%)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} connectNulls={false} name="Projected" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Risk Concentration
            </CardTitle>
            <CardDescription>Share of total residual risk exposure by department</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? <Skeleton className="h-48" /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={analytics?.deptConcentration ?? []}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="department" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: unknown) => [`${v}%`, "Risk Share"]}
                  />
                  <Bar dataKey="share" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Anomaly Detection
          </CardTitle>
          <CardDescription>
            Controls with residual risk scores statistically above the mean (z-score &gt; 1σ — mean: {analytics?.meanRiskScore ?? "—"}, σ: {analytics?.stdDevRiskScore ?? "—"})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsLoading ? (
            <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12" />)}</div>
          ) : analytics?.anomalies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No statistical anomalies detected — risk scores are well-distributed.</div>
          ) : (
            <div className="space-y-2">
              {analytics?.anomalies.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="font-medium text-sm truncate">{a.control}</div>
                    <div className="text-xs text-muted-foreground">{a.department}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Residual</div>
                      <div className="font-bold text-destructive">{a.residualScore}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Z-Score</div>
                      <div className="font-bold text-amber-500">+{a.zScore}σ</div>
                    </div>
                    <Badge variant={a.riskLevel === "High" ? "destructive" : "secondary"} className={a.riskLevel === "Medium" ? "bg-amber-500 text-white" : ""}>{a.riskLevel}</Badge>
                    <Badge variant="outline" className="text-[10px]">{a.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
