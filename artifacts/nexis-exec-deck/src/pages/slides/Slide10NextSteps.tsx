const base = import.meta.env.BASE_URL;

export default function Slide10NextSteps() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1E3A5F" }}>
      {/* Teal right panel */}
      <div className="absolute" style={{ top: 0, right: 0, width: "42vw", height: "100vh", background: "#0D9488" }} />
      {/* Lighter teal overlay */}
      <div className="absolute" style={{ top: 0, right: 0, width: "42vw", height: "100vh", background: "rgba(255,255,255,0.05)", clipPath: "polygon(0% 0, 100% 0, 100% 100%, 18% 100%)" }} />

      {/* Header */}
      <div className="absolute flex items-center justify-between" style={{ top: "4vh", left: "5vw", right: "5vw" }}>
        <div className="flex items-center gap-[1vw]">
          <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "4vh", width: "auto" }} />
          <span className="font-display font-bold" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2vw", letterSpacing: "0.15em" }}>NEXIS Risk-IQ</span>
        </div>
        <div className="flex items-center gap-[1.5vw]">
          <span className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>Next Steps</span>
          <span className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Left: title + three steps */}
      <div className="absolute flex flex-col justify-center" style={{ top: "12vh", left: "5vw", width: "48vw", bottom: "8vh" }}>
        <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.2vw", marginBottom: "1.5vh" }}>Three Ways to Proceed</div>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#FFFFFF", fontSize: "4vw", lineHeight: 1.1, marginBottom: "0.8vh" }}>
          Next Steps
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "4vh" }} />

        {/* Step 1 */}
        <div className="flex items-start gap-[1.5vw]" style={{ marginBottom: "3vh" }}>
          <div style={{ minWidth: "3.5vw", height: "3.5vw", borderRadius: "50%", background: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="font-display font-black" style={{ color: "#FFFFFF", fontSize: "1.5vw" }}>1</span>
          </div>
          <div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", marginBottom: "0.6vh" }}>Executive Demo</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.25vw", lineHeight: 1.4 }}>
              Live walkthrough with your tenant pre-configured — see the platform with your real context
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-[1.5vw]" style={{ marginBottom: "3vh" }}>
          <div style={{ minWidth: "3.5vw", height: "3.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="font-display font-black" style={{ color: "#FFFFFF", fontSize: "1.5vw" }}>2</span>
          </div>
          <div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", marginBottom: "0.6vh" }}>Proof of Concept</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.25vw", lineHeight: 1.4 }}>
              30-day pilot on one business unit at no cost — full feature access, measurable outcomes
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-[1.5vw]">
          <div style={{ minWidth: "3.5vw", height: "3.5vw", borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="font-display font-black" style={{ color: "#FFFFFF", fontSize: "1.5vw" }}>3</span>
          </div>
          <div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", marginBottom: "0.6vh" }}>Full Deployment</div>
            <div className="font-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1.25vw", lineHeight: 1.4 }}>
              RiskInteg advisory team guides end-to-end implementation and onboarding
            </div>
          </div>
        </div>
      </div>

      {/* Right: contact + tagline */}
      <div className="absolute flex flex-col justify-center items-start" style={{ top: "0", right: "0", width: "40vw", height: "100vh", padding: "0 5vw 0 4vw" }}>
        <div style={{ background: "#FFFFFF", borderRadius: "0.8vw", padding: "0.8vw", boxShadow: "0 2px 16px rgba(0,0,0,0.2)", marginBottom: "4vh" }}>
          <img src={`${base}riskinteg-logo.jpg`} crossOrigin="anonymous" alt="RiskInteg" style={{ height: "10vh", width: "10vh", objectFit: "contain", display: "block" }} />
        </div>

        <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1vw", marginBottom: "1.5vh" }}>Contact</div>
        <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "2vw", marginBottom: "5vh", lineHeight: 1.3 }}>
          RiskInteg Solution Services
        </div>

        <div style={{ width: "4vw", height: "0.3vh", background: "rgba(255,255,255,0.3)", marginBottom: "4vh" }} />

        <div className="font-display font-black" style={{ color: "#FFFFFF", fontSize: "2.2vw", lineHeight: 1.3 }}>
          Intelligent Risk.
        </div>
        <div className="font-display font-black" style={{ color: "rgba(255,255,255,0.7)", fontSize: "2.2vw", lineHeight: 1.3 }}>
          Total Clarity.
        </div>

        {/* NEXIS logo */}
        <div className="flex items-center gap-[1vw]" style={{ marginTop: "6vh" }}>
          <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "4vh", width: "auto", opacity: 0.7 }} />
          <span className="font-display font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1vw", letterSpacing: "0.2em" }}>NEXIS Risk-IQ</span>
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
