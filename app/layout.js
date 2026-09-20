import "./globals.css";

export const metadata = {
  title: "CommuteClass — Turn dead time into personalized audio lessons",
  description: "Personalized, source-backed audio briefings sized to the exact minutes of your commute. Hands and eyes busy, ears free.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Top Navigation Bar */}
        <header
          style={{
            width: "100%",
            borderBottom: "1px solid var(--border-subtle)",
            background: "rgba(7, 8, 12, 0.75)",
            backdropFilter: "blur(18px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            className="landing-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "64px",
            }}
          >
            {/* Logo */}
            <a
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "11px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#07080c",
                  boxShadow: "0 4px 14px rgba(245, 158, 11, 0.35)",
                }}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <span>Commute</span>
                  <span style={{ color: "var(--primary-amber)" }}>Class</span>
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  Hands-busy, ears-free audio
                </div>
              </div>
            </a>

            {/* Right tags / badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="badge-gold" style={{ display: "none", sm: "inline-flex" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent-emerald)",
                  }}
                />
                150 words/min
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "4px 10px",
                  borderRadius: "99px",
                  background: "rgba(245, 158, 11, 0.1)",
                  color: "var(--primary-amber)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                }}
              >
                Beta
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main style={{ flex: 1, padding: "28px 0 60px" }}>{children}</main>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--border-subtle)",
            background: "rgba(7, 8, 12, 0.9)",
            padding: "36px 0",
            fontSize: "0.85rem",
            color: "var(--text-subtle)",
          }}
        >
          <div
            className="landing-container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 700, color: "var(--text-main)" }}>CommuteClass</span>
              <span>&bull;</span>
              <span>Turn your commute into audio mastery</span>
            </div>
            <p style={{ maxWidth: "560px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Built for people whose hands and eyes are occupied—on the subway, walking the dog, or at the gym. Real web sources, clarifying questions, and exact time-fit.
            </p>
            <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
              &copy; 2026 CommuteClass &bull; No database &bull; Local session storage &bull; Free Neural Voices
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
