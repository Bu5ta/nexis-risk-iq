const base = import.meta.env.BASE_URL;

export default function Slide08Timeline() {
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
          <span className="font-body" style={{ color: "#64748B", fontSize: "1.1vw" }}>Implementation Timeline</span>
          <span className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Title */}
      <div className="absolute" style={{ top: "13vh", left: "5vw" }}>
        <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.2vw", marginBottom: "1.5vh" }}>Structured 90-Day Deployment</div>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#1E3A5F", fontSize: "4.2vw", marginBottom: "0.8vh" }}>
          Implementation Timeline
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "4vh" }} />
      </div>

      {/* Timeline: horizontal with connecting line */}
      <div className="absolute" style={{ top: "35vh", left: "5vw", right: "5vw" }}>
        {/* Connector line */}
        <div style={{ position: "absolute", top: "3vh", left: "2.5vw", right: "2.5vw", height: "2px", background: "#E2E8F0", zIndex: 0 }} />

        <div className="grid grid-cols-4 gap-[2.5vw]" style={{ position: "relative", zIndex: 1 }}>
          {/* Phase 1 */}
          <div className="flex flex-col items-start">
            <div style={{ width: "2vw", height: "2vw", borderRadius: "50%", background: "#0D9488", marginBottom: "2.5vh", marginLeft: "0.5vw" }} />
            <div className="font-body font-semibold" style={{ color: "#0D9488", fontSize: "1.1vw", marginBottom: "0.8vh" }}>Weeks 1–2</div>
            <div className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.6vw", marginBottom: "1.2vh", lineHeight: 1.2 }}>Foundation</div>
            <div style={{ width: "2.5vw", height: "2px", background: "#CBD5E1", marginBottom: "1.5vh" }} />
            <div className="font-body" style={{ color: "#64748B", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Tenant configuration and data migration from existing systems
            </div>
          </div>

          {/* Phase 2 */}
          <div className="flex flex-col items-start">
            <div style={{ width: "2vw", height: "2vw", borderRadius: "50%", background: "#0D9488", marginBottom: "2.5vh", marginLeft: "0.5vw" }} />
            <div className="font-body font-semibold" style={{ color: "#0D9488", fontSize: "1.1vw", marginBottom: "0.8vh" }}>Weeks 3–4</div>
            <div className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.6vw", marginBottom: "1.2vh", lineHeight: 1.2 }}>Configuration</div>
            <div style={{ width: "2.5vw", height: "2px", background: "#CBD5E1", marginBottom: "1.5vh" }} />
            <div className="font-body" style={{ color: "#64748B", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Role setup and control register population across all departments
            </div>
          </div>

          {/* Phase 3 */}
          <div className="flex flex-col items-start">
            <div style={{ width: "2vw", height: "2vw", borderRadius: "50%", background: "#1E3A5F", marginBottom: "2.5vh", marginLeft: "0.5vw" }} />
            <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.1vw", marginBottom: "0.8vh" }}>Month 2</div>
            <div className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.6vw", marginBottom: "1.2vh", lineHeight: 1.2 }}>Go-Live</div>
            <div style={{ width: "2.5vw", height: "2px", background: "#CBD5E1", marginBottom: "1.5vh" }} />
            <div className="font-body" style={{ color: "#64748B", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Dashboard go-live, staff training, and first live reporting cycle
            </div>
          </div>

          {/* Phase 4 */}
          <div className="flex flex-col items-start">
            <div style={{ width: "2vw", height: "2vw", borderRadius: "50%", background: "#1E3A5F", marginBottom: "2.5vh", marginLeft: "0.5vw" }} />
            <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.1vw", marginBottom: "0.8vh" }}>Month 3</div>
            <div className="font-display font-bold" style={{ color: "#1E3A5F", fontSize: "1.6vw", marginBottom: "1.2vh", lineHeight: 1.2 }}>Full Deployment</div>
            <div style={{ width: "2.5vw", height: "2px", background: "#CBD5E1", marginBottom: "1.5vh" }} />
            <div className="font-body" style={{ color: "#64748B", fontSize: "1.2vw", lineHeight: 1.5 }}>
              AI layer activation and first full board pack report generated
            </div>
          </div>
        </div>

        {/* ROI visibility banner */}
        <div className="flex items-center" style={{ marginTop: "5vh", background: "#FFFFFF", borderRadius: "0.8vw", padding: "2vh 2.5vw", boxShadow: "0 2px 12px rgba(30,58,95,0.07)", borderLeft: "0.4vw solid #0D9488" }}>
          <span className="font-body" style={{ color: "#64748B", fontSize: "1.3vw" }}>Full ROI visibility achieved within</span>
          <span className="font-display font-black" style={{ color: "#0D9488", fontSize: "1.7vw", marginLeft: "1vw" }}>6 months of go-live</span>
          <span className="font-body" style={{ color: "#64748B", fontSize: "1.3vw", marginLeft: "1vw" }}>— guided end-to-end by RiskInteg advisory team</span>
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
