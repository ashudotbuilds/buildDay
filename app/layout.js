import "./globals.css";

export const metadata = {
  title: "CommuteClass — Turn dead time into audio lessons",
  description: "Personalized, source-backed audio lessons sized exactly to your commute.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-viewport">
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "10px", 
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0d14",
                boxShadow: "0 2px 10px rgba(245, 158, 11, 0.3)"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: "1.15rem", fontWeight: "700", letterSpacing: "-0.02em", color: "#f8fafc", margin: 0 }}>
                  Commute<span style={{ color: "#f59e0b" }}>Class</span>
                </h1>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0, fontWeight: 500 }}>
                  Audio lessons sized to your time
                </p>
              </div>
            </div>
            <div style={{
              fontSize: "0.72rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              padding: "4px 10px",
              borderRadius: "99px",
              background: "rgba(245, 158, 11, 0.12)",
              color: "#f59e0b",
              border: "1px solid rgba(245, 158, 11, 0.3)"
            }}>
              Beta
            </div>
          </header>

          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
          </main>

          <footer style={{ marginTop: "32px", textAlign: "center", fontSize: "0.78rem", color: "#64748b" }}>
            CommuteClass &bull; Built for hands-busy, ears-free learning
          </footer>
        </div>
      </body>
    </html>
  );
}
