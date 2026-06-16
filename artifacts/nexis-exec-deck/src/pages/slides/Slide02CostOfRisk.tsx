const base = import.meta.env.BASE_URL;

export default function Slide02CostOfRisk() {
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
          <span className="font-body" style={{ color: "#64748B", fontSize: "1.1vw" }}>The Challenge</span>
          <span className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Slide title */}
      <div className="absolute" style={{ top: "14vh", left: "5vw", right: "5vw" }}>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#1E3A5F", fontSize: "4.5vw", marginBottom: "0.8vh", textWrap: "balance" }}>
          The Cost of Unmanaged Risk
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "4vh" }} />
      </div>

      {/* Four stat cards */}
      <div className="absolute" style={{ top: "30vh", left: "5vw", right: "5vw" }}>
        <div className="grid grid-cols-2 gap-[2.5vw]" style={{ rowGap: "2.5vh" }}>
          {/* Card 1 */}
          <div className="flex gap-[1.8vw] items-start" style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2.8vh 2.2vw", boxShadow: "0 2px 16px rgba(30,58,95,0.08)", borderLeft: "0.4vw solid #0D9488" }}>
            <div>
              <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "4.5vw", lineHeight: 1 }}>4–6%</div>
              <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.4vw", marginTop: "0.8vh", marginBottom: "0.5vh" }}>of Annual Revenue</div>
              <div className="font-body" style={{ color: "#64748B", fontSize: "1.2vw", lineHeight: 1.4 }}>Average regulatory non-compliance fines faced by organisations each year</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex gap-[1.8vw] items-start" style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2.8vh 2.2vw", boxShadow: "0 2px 16px rgba(30,58,95,0.08)", borderLeft: "0.4vw solid #1E3A5F" }}>
            <div>
              <div className="font-display font-black" style={{ color: "#1E3A5F", fontSize: "4.5vw", lineHeight: 1 }}>30–40%</div>
              <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.4vw", marginTop: "0.8vh", marginBottom: "0.5vh" }}>Risk Team Capacity</div>
              <div className="font-body" style={{ color: "#64748B", fontSize: "1.2vw", lineHeight: 1.4 }}>Consumed by manual GRC processes — time stolen from strategic oversight</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex gap-[1.8vw] items-start" style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2.8vh 2.2vw", boxShadow: "0 2px 16px rgba(30,58,95,0.08)", borderLeft: "0.4vw solid #0D9488" }}>
            <div>
              <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "4.5vw", lineHeight: 1 }}>3–5</div>
              <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.4vw", marginTop: "0.8vh", marginBottom: "0.5vh" }}>Days Per Board Cycle</div>
              <div className="font-body" style={{ color: "#64748B", fontSize: "1.2vw", lineHeight: 1.4 }}>Board-level reporting timeline with fragmented, manual tooling</div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex gap-[1.8vw] items-start" style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "2.8vh 2.2vw", boxShadow: "0 2px 16px rgba(30,58,95,0.08)", borderLeft: "0.4vw solid #1E3A5F" }}>
            <div>
              <div className="font-display font-black" style={{ color: "#1E3A5F", fontSize: "4.5vw", lineHeight: 1 }}>1</div>
              <div className="font-body font-semibold" style={{ color: "#1E3A5F", fontSize: "1.4vw", marginTop: "0.8vh", marginBottom: "0.5vh" }}>Undetected Control Failure</div>
              <div className="font-body" style={{ color: "#64748B", fontSize: "1.2vw", lineHeight: 1.4 }}>Can trigger audit findings, penalties, and reputational damage at scale</div>
            </div>
          </div>
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
