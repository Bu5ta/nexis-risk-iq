const base = import.meta.env.BASE_URL;

export default function Slide06RiskSightAI() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#FAFBFC" }}>
      {/* Left navy accent strip */}
      <div className="absolute" style={{ top: 0, left: 0, width: "0.6vw", height: "100vh", background: "#1E3A5F" }} />
      {/* Teal top bar */}
      <div className="absolute" style={{ top: 0, left: "0.6vw", right: 0, height: "0.5vh", background: "#0D9488" }} />

      {/* Header */}
      <div className="absolute flex items-center justify-between" style={{ top: "4vh", left: "5vw", right: "5vw" }}>
        <div className="flex items-center gap-[1vw]">
          <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "4vh", width: "auto" }} />
          <span className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.2vw", letterSpacing: "0.15em" }}>NEXIS Risk-IQ</span>
        </div>
        <div className="flex items-center gap-[1.5vw]">
          <span className="font-body" style={{ color: "#64748B", fontSize: "1.1vw" }}>RiskSight AI</span>
          <span className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Left: title + description */}
      <div className="absolute flex flex-col justify-center" style={{ top: "12vh", left: "5vw", width: "38vw", bottom: "8vh" }}>
        <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.2vw", marginBottom: "1.5vh" }}>AI-Powered Intelligence</div>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#1E3A5F", fontSize: "3.8vw", lineHeight: 1.1, marginBottom: "0.8vh", textWrap: "balance" }}>
          RiskSight AI
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "3vh" }} />
        <p className="font-body" style={{ color: "#64748B", fontSize: "1.4vw", lineHeight: 1.6, textWrap: "pretty" }}>
          Built into the NEXIS platform, the RiskSight AI layer transforms raw governance data into clear, actionable intelligence for every level of the organisation.
        </p>
      </div>

      {/* Right: four AI capability cards */}
      <div className="absolute flex flex-col gap-[1.8vh]" style={{ top: "12vh", left: "47vw", right: "3vw", bottom: "8vh", justifyContent: "center" }}>
        <div style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2.2vh 2vw", boxShadow: "0 2px 12px rgba(30,58,95,0.07)", borderLeft: "0.4vw solid #0D9488" }}>
          <div className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.5vw", marginBottom: "0.6vh" }}>Executive Briefings</div>
          <div className="font-body" style={{ color: "#64748B", fontSize: "1.25vw", lineHeight: 1.4 }}>GPT-4o mini generates plain-language summaries for board members — no data literacy required</div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2.2vh 2vw", boxShadow: "0 2px 12px rgba(30,58,95,0.07)", borderLeft: "0.4vw solid #1E3A5F" }}>
          <div className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.5vw", marginBottom: "0.6vh" }}>Anomaly Detection</div>
          <div className="font-body" style={{ color: "#64748B", fontSize: "1.25vw", lineHeight: 1.4 }}>ML flags control performance outliers before they escalate into compliance events</div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2.2vh 2vw", boxShadow: "0 2px 12px rgba(30,58,95,0.07)", borderLeft: "0.4vw solid #0D9488" }}>
          <div className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.5vw", marginBottom: "0.6vh" }}>Predictive Compliance Forecast</div>
          <div className="font-body" style={{ color: "#64748B", fontSize: "1.25vw", lineHeight: 1.4 }}>90-day risk trajectory modelled per department from live control data</div>
        </div>

        <div style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2.2vh 2vw", boxShadow: "0 2px 12px rgba(30,58,95,0.07)", borderLeft: "0.4vw solid #1E3A5F" }}>
          <div className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.5vw", marginBottom: "0.6vh" }}>Natural Language Q&amp;A</div>
          <div className="font-body" style={{ color: "#64748B", fontSize: "1.25vw", lineHeight: 1.4 }}>Leadership asks questions; the platform answers from live governance data</div>
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
