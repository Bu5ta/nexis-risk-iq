const base = import.meta.env.BASE_URL;

export default function Slide03Capabilities() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1E3A5F" }}>
      {/* Subtle teal diagonal accent */}
      <div className="absolute" style={{ bottom: 0, right: 0, width: "45vw", height: "55vh", background: "rgba(13,148,136,0.08)", clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0% 100%)" }} />

      {/* Header */}
      <div className="absolute flex items-center justify-between" style={{ top: "4vh", left: "5vw", right: "5vw" }}>
        <div className="flex items-center gap-[1vw]">
          <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "4vh", width: "auto" }} />
          <span className="font-display font-bold" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2vw", letterSpacing: "0.15em" }}>NEXIS Risk-IQ</span>
        </div>
        <div className="flex items-center gap-[1.5vw]">
          <span className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>Platform Capabilities</span>
          <span className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Title */}
      <div className="absolute" style={{ top: "14vh", left: "5vw", right: "5vw" }}>
        <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.2vw", marginBottom: "1.5vh" }}>Six Integrated Modules</div>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#FFFFFF", fontSize: "4.2vw", marginBottom: "0.8vh" }}>
          Platform Capabilities
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "3.5vh" }} />
      </div>

      {/* 3-column module grid */}
      <div className="absolute" style={{ top: "32vh", left: "5vw", right: "5vw" }}>
        <div className="grid grid-cols-3 gap-[2vw]">
          {/* Module 1 */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.8vw", padding: "2.5vh 1.8vw", borderTop: "0.3vw solid #0D9488" }}>
            <div className="font-body font-bold" style={{ color: "#0D9488", fontSize: "1.3vw", marginBottom: "1vh" }}>01</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.6vw", marginBottom: "1vh" }}>Executive Dashboard</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.4 }}>Real-time KPI monitoring and board-ready visualisations</div>
          </div>

          {/* Module 2 */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.8vw", padding: "2.5vh 1.8vw", borderTop: "0.3vw solid #0D9488" }}>
            <div className="font-body font-bold" style={{ color: "#0D9488", fontSize: "1.3vw", marginBottom: "1vh" }}>02</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.6vw", marginBottom: "1vh" }}>Risk &amp; Control Register</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.4 }}>360° control lifecycle management with action tracking</div>
          </div>

          {/* Module 3 */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.8vw", padding: "2.5vh 1.8vw", borderTop: "0.3vw solid rgba(13,148,136,0.5)" }}>
            <div className="font-body font-bold" style={{ color: "#0D9488", fontSize: "1.3vw", marginBottom: "1vh" }}>03</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.6vw", marginBottom: "1vh" }}>Department Intelligence</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.4 }}>Accountability mapping per business unit and owner</div>
          </div>

          {/* Module 4 */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.8vw", padding: "2.5vh 1.8vw", borderTop: "0.3vw solid rgba(13,148,136,0.5)" }}>
            <div className="font-body font-bold" style={{ color: "#0D9488", fontSize: "1.3vw", marginBottom: "1vh" }}>04</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.6vw", marginBottom: "1vh" }}>Automated Reports</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.4 }}>Board-pack generation in minutes, not days</div>
          </div>

          {/* Module 5 */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.8vw", padding: "2.5vh 1.8vw", borderTop: "0.3vw solid rgba(13,148,136,0.5)" }}>
            <div className="font-body font-bold" style={{ color: "#0D9488", fontSize: "1.3vw", marginBottom: "1vh" }}>05</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.6vw", marginBottom: "1vh" }}>Audit Trail</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.4 }}>Immutable, timestamped governance log for regulators</div>
          </div>

          {/* Module 6 */}
          <div style={{ background: "rgba(13,148,136,0.15)", borderRadius: "0.8vw", padding: "2.5vh 1.8vw", borderTop: "0.3vw solid #0D9488", outline: "1px solid rgba(13,148,136,0.3)" }}>
            <div className="font-body font-bold" style={{ color: "#0D9488", fontSize: "1.3vw", marginBottom: "1vh" }}>06</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.6vw", marginBottom: "1vh" }}>RiskSight AI</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.4 }}>GPT-powered briefings and predictive analytics layer</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute flex items-center justify-between" style={{ bottom: "3vh", left: "5vw", right: "5vw" }}>
        <span className="font-body" style={{ color: "rgba(255,255,255,0.3)", fontSize: "1.1vw" }}>NEXIS Risk-IQ · In Partnership with RiskInteg Solution Services</span>
        <span className="font-body" style={{ color: "rgba(255,255,255,0.3)", fontSize: "1.1vw" }}>Confidential &amp; Proprietary</span>
      </div>
    </div>
  );
}
