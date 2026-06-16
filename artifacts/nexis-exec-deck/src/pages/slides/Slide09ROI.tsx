const base = import.meta.env.BASE_URL;

export default function Slide09ROI() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1E3A5F" }}>
      {/* Geometric accent */}
      <div className="absolute" style={{ top: 0, right: 0, width: "28vw", height: "100vh", background: "rgba(13,148,136,0.08)" }} />
      <div className="absolute" style={{ bottom: 0, left: 0, width: "100vw", height: "0.5vh", background: "#0D9488" }} />

      {/* Header */}
      <div className="absolute flex items-center justify-between" style={{ top: "4vh", left: "5vw", right: "5vw" }}>
        <div className="flex items-center gap-[1vw]">
          <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "4vh", width: "auto" }} />
          <span className="font-display font-bold" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2vw", letterSpacing: "0.15em" }}>NEXIS Risk-IQ</span>
        </div>
        <div className="flex items-center gap-[1.5vw]">
          <span className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>Return on Investment</span>
          <span className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Left: title + hero number */}
      <div className="absolute flex flex-col justify-center" style={{ top: "12vh", left: "5vw", width: "35vw", bottom: "8vh" }}>
        <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.2vw", marginBottom: "1.5vh" }}>3-Year Financial Case</div>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#FFFFFF", fontSize: "3.8vw", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Return on Investment
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "4vh" }} />

        <div style={{ marginBottom: "3vh" }}>
          <div className="font-body" style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.3vw", marginBottom: "0.5vh" }}>Net 3-Year Value</div>
          <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "8vw", lineHeight: 1 }}>$660K</div>
        </div>

        <div className="flex items-center gap-[3vw]">
          <div>
            <div className="font-display font-black" style={{ color: "#FFFFFF", fontSize: "3vw", lineHeight: 1 }}>5.5×</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.2vw", marginTop: "0.3vh" }}>ROI multiple</div>
          </div>
          <div style={{ width: "1px", height: "6vh", background: "rgba(255,255,255,0.15)" }} />
          <div>
            <div className="font-display font-black" style={{ color: "#FFFFFF", fontSize: "3vw", lineHeight: 1 }}>&lt;11mo</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.2vw", marginTop: "0.3vh" }}>Payback period</div>
          </div>
        </div>
      </div>

      {/* Right: financial breakdown */}
      <div className="absolute flex flex-col justify-center" style={{ top: "12vh", left: "45vw", right: "5vw", bottom: "8vh" }}>
        <div className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.2vw", marginBottom: "2.5vh" }}>Mid-market organisation — illustrative</div>

        {/* Row: Investment */}
        <div className="flex items-center justify-between" style={{ padding: "1.8vh 2vw", background: "rgba(255,255,255,0.05)", borderRadius: "0.6vw", marginBottom: "0.8vh" }}>
          <div>
            <div className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.3vw" }}>Platform Investment</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>3-year total cost</div>
          </div>
          <div className="font-display font-black" style={{ color: "rgba(255,255,255,0.6)", fontSize: "2vw" }}>$120K</div>
        </div>

        {/* Row: Labour */}
        <div className="flex items-center justify-between" style={{ padding: "1.8vh 2vw", background: "rgba(255,255,255,0.05)", borderRadius: "0.6vw", marginBottom: "0.8vh" }}>
          <div>
            <div className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.3vw" }}>Labour Savings</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>Reduced manual reporting effort</div>
          </div>
          <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "2vw" }}>$210K</div>
        </div>

        {/* Row: Penalty */}
        <div className="flex items-center justify-between" style={{ padding: "1.8vh 2vw", background: "rgba(255,255,255,0.05)", borderRadius: "0.6vw", marginBottom: "0.8vh" }}>
          <div>
            <div className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.3vw" }}>Penalty Avoidance</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>Estimated regulatory savings</div>
          </div>
          <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "2vw" }}>$480K</div>
        </div>

        {/* Row: Audit */}
        <div className="flex items-center justify-between" style={{ padding: "1.8vh 2vw", background: "rgba(255,255,255,0.05)", borderRadius: "0.6vw", marginBottom: "2vh" }}>
          <div>
            <div className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.3vw" }}>Audit Efficiency Gains</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>Time-to-audit reduction value</div>
          </div>
          <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "2vw" }}>$90K</div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between" style={{ padding: "2vh 2vw", background: "rgba(13,148,136,0.2)", borderRadius: "0.6vw", border: "1px solid rgba(13,148,136,0.4)" }}>
          <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.5vw" }}>Net 3-Year Value</div>
          <div className="font-display font-black" style={{ color: "#0D9488", fontSize: "2.5vw" }}>$660K</div>
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
