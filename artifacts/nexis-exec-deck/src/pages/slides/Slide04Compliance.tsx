import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const base = import.meta.env.BASE_URL;

const data = [
  { quarter: "Q1", before: 52, after: 58 },
  { quarter: "Q2", before: 54, after: 63 },
  { quarter: "Q3", before: 55, after: 68 },
  { quarter: "Q4", before: 57, after: 72 },
  { quarter: "Q5", before: 58, after: 76 },
  { quarter: "Q6", before: 59, after: 79 },
  { quarter: "Q7", before: 60, after: 82 },
  { quarter: "Q8", before: 61, after: 84 },
];

export default function Slide04Compliance() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#FAFBFC" }}>
      {/* Left navy accent strip */}
      <div className="absolute" style={{ top: 0, left: 0, width: "0.6vw", height: "100vh", background: "#1E3A5F" }} />

      {/* Header */}
      <div className="absolute flex items-center justify-between" style={{ top: "4vh", left: "5vw", right: "5vw" }}>
        <div className="flex items-center gap-[1vw]">
          <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "4vh", width: "auto" }} />
          <span className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.2vw", letterSpacing: "0.15em" }}>NEXIS Risk-IQ</span>
        </div>
        <div className="flex items-center gap-[1.5vw]">
          <span className="font-body" style={{ color: "#64748B", fontSize: "1.1vw" }}>Compliance Rate Improvement</span>
          <span className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Left: title + stats */}
      <div className="absolute flex flex-col justify-center" style={{ top: "12vh", left: "5vw", width: "35vw", bottom: "8vh" }}>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#1E3A5F", fontSize: "3.8vw", lineHeight: 1.1, marginBottom: "0.8vh", textWrap: "balance" }}>
          Compliance Rate Improvement
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "3.5vh" }} />

        <div className="flex flex-col gap-[2.5vh]">
          <div style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2vh 1.8vw", boxShadow: "0 2px 12px rgba(30,58,95,0.07)", borderLeft: "0.4vw solid #0D9488" }}>
            <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "3.2vw", lineHeight: 1 }}>+18pts</div>
            <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.3vw", marginTop: "0.5vh" }}>Compliance rate lift — Year 1</div>
          </div>
          <div style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2vh 1.8vw", boxShadow: "0 2px 12px rgba(30,58,95,0.07)", borderLeft: "0.4vw solid #1E3A5F" }}>
            <div className="font-display font-black" style={{ color: "#1E3A5F", fontSize: "3.2vw", lineHeight: 1 }}>62%</div>
            <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.3vw", marginTop: "0.5vh" }}>High-risk backlog reduction — 6 months</div>
          </div>
          <div style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2vh 1.8vw", boxShadow: "0 2px 12px rgba(30,58,95,0.07)", borderLeft: "0.4vw solid #0D9488" }}>
            <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "3.2vw", lineHeight: 1 }}>74%</div>
            <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.3vw", marginTop: "0.5vh" }}>Overdue control actions reduced</div>
          </div>
        </div>
      </div>

      {/* Right: chart */}
      <div className="absolute flex flex-col" style={{ top: "12vh", left: "43vw", right: "3vw", bottom: "8vh" }}>
        <div className="font-body font-semibold" style={{ color: "#64748B", fontSize: "1.2vw", marginBottom: "2vh" }}>
          Compliance Rate — Before vs. After Implementation (Q1–Q8)
        </div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fill: "#64748B", fontSize: "1.1vw" as any, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 90]} tick={{ fill: "#64748B", fontSize: "1.1vw" as any, fontFamily: "Inter" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: "#1E3A5F", border: "none", borderRadius: "0.5vw", color: "#fff", fontSize: "1.1vw" as any, fontFamily: "Inter" }}
                formatter={(value: number) => [`${value}%`]}
              />
              <Legend
                wrapperStyle={{ fontSize: "1.1vw" as any, fontFamily: "Inter", color: "#64748B", paddingTop: "1vh" }}
                formatter={(value) => value === "before" ? "Before NEXIS" : "After NEXIS"}
              />
              <Bar dataKey="before" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="before" />
              <Bar dataKey="after" fill="#0D9488" radius={[4, 4, 0, 0]} name="after" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute flex items-center justify-between" style={{ bottom: "3vh", left: "5vw", right: "5vw" }}>
        <span className="font-body" style={{ color: "#94A3B8", fontSize: "1.1vw" }}>NEXIS Risk-IQ · In Partnership with RiskInteg Solution Services</span>
        <span className="font-body" style={{ color: "#94A3B8", fontSize: "1.1vw" }}>Confidential &amp; Proprietary</span>
      </div>
    </div>
  );
}
