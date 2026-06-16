const base = import.meta.env.BASE_URL;

export default function Slide07MultiTenant() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#1E3A5F" }}>
      {/* Diagonal light accent */}
      <div className="absolute" style={{ top: 0, right: 0, width: "30vw", height: "100vh", background: "rgba(255,255,255,0.03)", clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }} />

      {/* Header */}
      <div className="absolute flex items-center justify-between" style={{ top: "4vh", left: "5vw", right: "5vw" }}>
        <div className="flex items-center gap-[1vw]">
          <img src={`${base}nexis-icon.svg`} crossOrigin="anonymous" alt="NEXIS" style={{ height: "4vh", width: "auto" }} />
          <span className="font-display font-bold" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.2vw", letterSpacing: "0.15em" }}>NEXIS Risk-IQ</span>
        </div>
        <div className="flex items-center gap-[1.5vw]">
          <span className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.1vw" }}>Multi-Tenant Architecture</span>
          <span className="font-body font-semibold" style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1vw" }}>2026</span>
        </div>
      </div>

      {/* Title */}
      <div className="absolute" style={{ top: "14vh", left: "5vw" }}>
        <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.2vw", marginBottom: "1.5vh" }}>One Platform, Three Profiles</div>
        <h2 className="font-display font-black tracking-tight" style={{ color: "#FFFFFF", fontSize: "4.2vw", marginBottom: "0.8vh" }}>
          Multi-Tenant Architecture
        </h2>
        <div style={{ width: "5vw", height: "0.4vh", background: "#0D9488", marginBottom: "4vh" }} />
      </div>

      {/* Three tenant cards */}
      <div className="absolute" style={{ top: "34vh", left: "5vw", right: "5vw" }}>
        <div className="grid grid-cols-3 gap-[2.5vw]">
          {/* Tenant 1: Government */}
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "0.8vw", padding: "3vh 2vw", borderTop: "0.4vw solid #0D9488" }}>
            <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.1vw", marginBottom: "1.5vh" }}>Government</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", lineHeight: 1.3, marginBottom: "2vh" }}>National Revenue Authority</div>
            <div style={{ width: "2.5vw", height: "2px", background: "rgba(13,148,136,0.5)", marginBottom: "1.8vh" }} />
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Fiscal policy oversight and tax compliance management across national operations
            </div>
          </div>

          {/* Tenant 2: Parastatal */}
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "0.8vw", padding: "3vh 2vw", borderTop: "0.4vw solid rgba(13,148,136,0.6)" }}>
            <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.1vw", marginBottom: "1.5vh" }}>Parastatal</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", lineHeight: 1.3, marginBottom: "2vh" }}>Meridian Power &amp; Utilities</div>
            <div style={{ width: "2.5vw", height: "2px", background: "rgba(13,148,136,0.5)", marginBottom: "1.8vh" }} />
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Infrastructure risk and national grid compliance with high-availability controls
            </div>
          </div>

          {/* Tenant 3: Private */}
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "0.8vw", padding: "3vh 2vw", borderTop: "0.4vw solid rgba(13,148,136,0.4)" }}>
            <div className="font-body font-semibold tracking-widest uppercase" style={{ color: "#0D9488", fontSize: "1.1vw", marginBottom: "1.5vh" }}>Private Sector</div>
            <div className="font-display font-bold" style={{ color: "#FFFFFF", fontSize: "1.7vw", lineHeight: 1.3, marginBottom: "2vh" }}>Apex Financial Services Group</div>
            <div style={{ width: "2.5vw", height: "2px", background: "rgba(13,148,136,0.5)", marginBottom: "1.8vh" }} />
            <div className="font-body" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.2vw", lineHeight: 1.5 }}>
              Financial regulation and investment risk management across group entities
            </div>
          </div>
        </div>

        {/* Role-based access banner */}
        <div className="flex items-center justify-center gap-[4vw]" style={{ marginTop: "3vh", background: "rgba(255,255,255,0.05)", borderRadius: "0.6vw", padding: "1.8vh 2vw" }}>
          <div className="font-body" style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1vw" }}>Role-based access:</div>
          <div className="font-body font-semibold" style={{ color: "#FFFFFF", fontSize: "1.25vw" }}>Super Admin</div>
          <div style={{ width: "1px", height: "2.5vh", background: "rgba(255,255,255,0.2)" }} />
          <div className="font-body font-semibold" style={{ color: "#FFFFFF", fontSize: "1.25vw" }}>Risk Manager</div>
          <div style={{ width: "1px", height: "2.5vh", background: "rgba(255,255,255,0.2)" }} />
          <div className="font-body font-semibold" style={{ color: "#FFFFFF", fontSize: "1.25vw" }}>Executive Viewer</div>
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
