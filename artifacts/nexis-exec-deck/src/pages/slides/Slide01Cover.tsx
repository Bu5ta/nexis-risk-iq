const base = import.meta.env.BASE_URL;

export default function Slide01Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1E3A5F" }}>
      {/* Geometric accent shapes */}
      <div className="absolute" style={{ top: 0, right: 0, width: "38vw", height: "100vh", background: "#0D9488", clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)" }} />
      <div className="absolute" style={{ top: 0, right: 0, width: "38vw", height: "100vh", background: "rgba(255,255,255,0.06)", clipPath: "polygon(30% 0, 100% 0, 100% 100%, 12% 100%)" }} />

      {/* Top header bar */}
      <div className="absolute flex items-center gap-[1.2vw]" style={{ top: "4vh", left: "5vw" }}>
        <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "5vh", width: "auto" }} />
        <span className="font-display font-bold tracking-widest" style={{ color: "#FFFFFF", fontSize: "1.4vw", letterSpacing: "0.2em", opacity: 0.9 }}>NEXIS Risk-IQ</span>
      </div>

      {/* RiskInteg logo top right */}
      <div className="absolute flex items-center" style={{ top: "4vh", right: "5vw" }}>
        <img src={`${base}riskinteg-logo.jpg`} crossOrigin="anonymous" alt="RiskInteg" style={{ height: "5vh", width: "auto", borderRadius: "0.4vw", opacity: 0.92 }} />
      </div>

      {/* Main content */}
      <div className="absolute flex flex-col justify-center" style={{ top: "0", left: "5vw", width: "52vw", height: "100vh" }}>
        <div style={{ marginBottom: "2vh" }}>
          <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.3vw", marginBottom: "2vh" }}>
            Executive Briefing — 2026
          </div>
          <h1 className="font-display font-black tracking-tight" style={{ color: "#FFFFFF", fontSize: "7.5vw", lineHeight: 1, textWrap: "balance", marginBottom: "2.5vh" }}>
            NEXIS
            <br />
            Risk-IQ
          </h1>
          <div style={{ width: "6vw", height: "0.5vh", background: "#0D9488", marginBottom: "3vh" }} />
          <p className="font-body" style={{ color: "rgba(255,255,255,0.85)", fontSize: "2.2vw", lineHeight: 1.4, textWrap: "pretty", marginBottom: "1.5vh" }}>
            The Intelligent GRC Platform
          </p>
          <p className="font-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.7vw", lineHeight: 1.4 }}>
            Government · Parastatal · Private Sector
          </p>
        </div>
        <div style={{ marginTop: "4vh" }}>
          <p className="font-body" style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.3vw", letterSpacing: "0.05em" }}>
            In Partnership with RiskInteg Solution Services
          </p>
        </div>
      </div>

      {/* Right panel content */}
      <div className="absolute flex flex-col justify-center" style={{ top: "0", right: "0", width: "36vw", height: "100vh", padding: "0 5vw" }}>
        <div className="flex flex-col gap-[3vh]">
          <div>
            <div className="font-body font-bold" style={{ color: "rgba(255,255,255,0.95)", fontSize: "1.5vw", marginBottom: "0.8vh" }}>Governance</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.2vw" }}>Real-time control monitoring across all business units</div>
          </div>
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
          <div>
            <div className="font-body font-bold" style={{ color: "rgba(255,255,255,0.95)", fontSize: "1.5vw", marginBottom: "0.8vh" }}>Risk</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.2vw" }}>AI-powered risk detection and predictive analytics</div>
          </div>
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
          <div>
            <div className="font-body font-bold" style={{ color: "rgba(255,255,255,0.95)", fontSize: "1.5vw", marginBottom: "0.8vh" }}>Compliance</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.2vw" }}>Automated reporting and audit-ready documentation</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute flex items-center justify-between" style={{ bottom: "3vh", left: "5vw", right: "5vw" }}>
        <span className="font-body" style={{ color: "rgba(255,255,255,0.35)", fontSize: "1.1vw" }}>
          NEXIS Risk-IQ · In Partnership with RiskInteg Solution Services
        </span>
        <span className="font-body" style={{ color: "rgba(255,255,255,0.35)", fontSize: "1.1vw" }}>
          Confidential &amp; Proprietary
        </span>
      </div>
    </div>
  );
}
