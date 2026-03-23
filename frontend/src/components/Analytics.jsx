import React from 'react';
import { DAYS } from '../utils/helpers';

export default function Analytics({ completionPct }) {
  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Analytics</h1>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 24 }}>Your productivity insights and patterns</p>

      <div className="grid2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Daily Completion Rate</span></div>
          <div className="bar-chart" style={{ height: 100 }}>
            {[78, 82, 65, 91, 74, 88, completionPct].map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 9, color: "var(--text3)" }}>{v}%</div>
                <div className="bar" style={{
                  height: `${v}%`, width: "100%",
                  background: i === 6 ? "linear-gradient(var(--accent3), var(--accent2))" : "var(--surface2)",
                  border: "1px solid var(--border2)",
                }} />
                <span style={{ fontSize: 10, color: "var(--text3)" }}>{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Time Distribution</span></div>
          {[
            { label: "Deep Study", hours: 4.5, pct: 32, color: "fill-info" },
            { label: "DSA Practice", hours: 2.5, pct: 18, color: "fill-purple" },
            { label: "Gym / Fitness", hours: 1.5, pct: 11, color: "fill-accent" },
            { label: "Breaks / Rest", hours: 2, pct: 14, color: "fill-warn" },
            { label: "Other", hours: 3.5, pct: 25, color: "" },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "var(--text2)" }}>{r.label}</span>
                <span className="mono" style={{ color: "var(--text3)" }}>{r.hours}h</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${r.color || ""}`} style={{ width: `${r.pct}%`, background: r.color ? undefined : "var(--border2)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Performance Metrics</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Avg Daily Focus", value: "5h 20m", delta: "+12% vs last week", up: true },
            { label: "Goal Completion", value: "84%", delta: "+6% vs last week", up: true },
            { label: "Sleep Average", value: "7.2h", delta: "-0.3h vs target", up: false },
            { label: "DSA Problems", value: "47", delta: "+8 this week", up: true },
            { label: "Workout Streak", value: "12 days", delta: "Personal best!", up: true },
            { label: "Break Compliance", value: "62%", delta: "Needs improvement", up: false },
          ].map(m => (
            <div key={m.label} style={{ background: "var(--bg3)", borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>{m.value}</div>
              <div className={m.up ? "delta-up" : "delta-down"} style={{ marginTop: 4 }}>
                {m.up ? "\u2191" : "\u2193"} {m.delta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
