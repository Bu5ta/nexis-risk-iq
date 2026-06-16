const base = import.meta.env.BASE_URL;

export default function Slide05CostOptimisation() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1E3A5F" }}>
      {/* Teal bottom accent */}
      <div className="absolute" style={{ bottom: 0, left: 0, width: "100vw", height: "1vh", background: "#0D9488" }} />

      {/* Header */}
      <div className="absolute flex items-center justify-between" style={{ top: "4vh", left: "5vw", right: "5vw" }}>
        <div className="flex items-center gap-[1vw]">
          <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "4vh", width: "auto" }} />
          <span className="font-display font-bold" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2vw", letterSpacing: "0.15em" }}>NEXIS Risk-IQ</span>
        </div>
        <div className="flex items-center gap-[1.5vw]">
          <span className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>Cost Optimisation</span>
          <span className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Title block */}
      <div className="absolute" style={{ top: "14vh", left: "5vw" }}>
        <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.2vw", marginBottom: "1.5vh" }}>Direct Cost Savings</div>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#FFFFFF", fontSize: "4.2vw", marginBottom: "0.8vh" }}>
          Cost Optimisation
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "4vh" }} />
      </div>

      {/* Three saving areas */}
      <div className="absolute" style={{ top: "32vh", left: "5vw", right: "5vw" }}>
        <div className="grid grid-cols-3 gap-[2.5vw]">
          {/* Area 1 */}
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "0.8vw", padding: "3.5vh 2vw 3vh" }}>
            <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "5vw", lineHeight: 1, marginBottom: "1.5vh" }}>60%</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", marginBottom: "1.2vh" }}>Risk Reporting Labour</div>
            <div style={{ width: "3vw", height: "2px", background: "#0D9488", marginBottom: "1.5vh" }} />
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Reduction in manual effort. Average 12 hrs/week saved per risk team.
            </div>
          </div>

          {/* Area 2 */}
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "0.8vw", padding: "3.5vh 2vw 3vh" }}>
            <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "5vw", lineHeight: 1, marginBottom: "1.5vh" }}>&lt;4hrs</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", marginBottom: "1.2vh" }}>Audit Preparation Time</div>
            <div style={{ width: "3vw", height: "2px", background: "#0D9488", marginBottom: "1.5vh" }} />
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Down from 3–5 days of manual data gathering across departments.
            </div>
          </div>

          {/* Area 3 */}
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "0.8vw", padding: "3.5vh 2vw 3vh" }}>
            <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "5vw", lineHeight: 1, marginBottom: "1.5vh" }}>$1.2M</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", marginBottom: "1.2vh" }}>Penalty Avoidance</div>
            <div style={{ width: "3vw", height: "2px", background: "#0D9488", marginBottom: "1.5vh" }} />
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Estimated annual savings ($280K–$1.2M) depending on sector and exposure.
            </div>
          </div>
        </div>

        {/* Summary banner */}
        <div className="flex items-center justify-center" style={{ marginTop: "3.5vh", background: "rgba(13,148,136,0.2)", borderRadius: "0.8vw", padding: "2vh 3vw", border: "1px solid rgba(13,148,136,0.4)" }}>
          <span className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.8vw" }}>
            Total 3-year cost avoidance:
          </span>
          <span className="font-display font-black" style={{ color: "#0D9488", fontSize: "2vw", marginLeft: "1.2vw" }}>
            8–14× platform investment
          </span>
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
