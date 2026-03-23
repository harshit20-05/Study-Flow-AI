import React from 'react';
import { fmtTime } from '../utils/helpers';

export default function Weekly({ weekSchedule, aiLoading, generateWeekPlan }) {
  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Weekly Planner</h1>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>7-day optimized view</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={generateWeekPlan} disabled={aiLoading}>
          {aiLoading ? <><span className="spinner" /> Generating\u2026</> : "\u2728 Generate Week Plan"}
        </button>
      </div>
      {weekSchedule ? (
        <div className="week-grid">
          {Object.entries(weekSchedule).map(([day, blocks]) => (
            <div key={day} className="week-col">
              <div className="week-head">{day}</div>
              {Array.isArray(blocks) && blocks.map((b, i) => (
                <div key={i} className={`week-block block-${b.type}`} style={{ borderLeftColor: b.type === "study" ? "var(--info)" : b.type === "dsa" ? "var(--purple)" : b.type === "gym" ? "var(--accent)" : b.type === "break" ? "var(--warn)" : "var(--border)" }}>
                  <div style={{ fontSize: 9, opacity: .7 }}>{fmtTime(b.hour)}</div>
                  <div>{b.title}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>\uD83D\uDCC5</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No weekly plan yet</div>
          <div style={{ fontSize: 13, marginBottom: 20 }}>Click "Generate Week Plan" to get your AI-optimized weekly schedule</div>
          <button className="btn btn-primary" onClick={generateWeekPlan}>\u2728 Generate Week Plan</button>
        </div>
      )}
    </div>
  );
}
