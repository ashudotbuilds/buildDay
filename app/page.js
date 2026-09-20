"use client";

import { useState } from "react";

// Master toggle flag requested: switch between mock layer and real API routes
export const USE_MOCK = true;

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="glass-panel" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "8px" }}>
          Ready for your next commute?
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          CommuteClass transforms any complex concept into a concise, high-yield audio briefing tailored to the exact minutes you have free.
        </p>
      </div>
    </div>
  );
}
