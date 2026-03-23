import React from "react";
import CircularProgress from "./CircularProgress";
import { Brain, Activity, Moon, Flame, Lightbulb } from 'lucide-react';

export default function Dashboard({ 
  profile, now, completionPct, completedCount, totalCount, burnout, productivity, DAYS, analyzeBurnout, aiLoading
}) {
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Good {now.getHours() < 12 ? "Morning" : now.getHours() < 17 ? "Afternoon" : "Evening"}, {profile?.name || "Optimizer"}</h1>
        <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>{now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div className="grid4" style={{ marginBottom: 20 }}>
        {[
          { label: "Completion", value: `${completionPct}%`, meta: `${completedCount}/${totalCount} tasks`, color: "var(--accent)", fill: "fill-accent" },
          { label: "Focus Score", value: "87", meta: "Above avg today", color: "var(--info)", fill: "fill-info" },
          { label: "Streak", value: "12d", meta: "Personal best!", color: "var(--purple)", fill: "fill-purple" },
          { label: "Burnout Risk", value: `${burnout}%`, meta: burnout < 40 ? "Low \u2013 keep it up" : burnout < 70 ? "Moderate \u2013 take breaks" : "High \u2013 rest!", color: burnout > 60 ? "var(--warn)" : "var(--accent)", fill: burnout > 60 ? "fill-warn" : "fill-accent" },
        ].map(s => (
          <div key={s.label} className={`card ${s.color === "var(--accent)" ? "card-accent" : ""}`}>
            <div className="card-title" style={{ marginBottom: 12 }}>{s.label}</div>
            <div className="card-value" style={{ color: s.color }}>{s.value}</div>
            <div style={{ marginTop: 10 }}>
              <div className="progress-bar">
                <div className={`progress-fill ${s.fill}`} style={{ width: String(s.value).includes("%") ? String(s.value) : "70%" }} />
              </div>
            </div>
            <div className="card-meta" style={{ marginTop: 6 }}>{s.meta}</div>
          </div>
        ))}
      </div>

      <div className="grid2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Today's Progress</span>
            <span className="tag tag-active">Live</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div className="completion-ring" style={{ flexShrink: 0 }}>
              <CircularProgress value={completionPct} size={100} stroke={8} />
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>{completionPct}%</div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>done</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: "Study", pct: 60, color: "fill-info" },
                { label: "DSA", pct: 100, color: "fill-purple" },
                { label: "Gym", pct: 100, color: "fill-accent" },
                { label: "Breaks", pct: 33, color: "fill-warn" },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "var(--text2)" }}>{row.label}</span>
                    <span className="mono" style={{ color: "var(--text3)" }}>{row.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${row.color}`} style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Productivity Trend</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>7-day avg</span>
          </div>
          <div className="bar-chart">
            {productivity.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div className="bar" style={{
                  height: `${v}%`,
                  background: i === 6 ? "var(--accent)" : i === productivity.indexOf(Math.max(...productivity)) ? "var(--info)" : "var(--surface2)",
                  border: `1px solid ${i === 6 ? "var(--accent)" : "var(--border2)"}`,
                }} />
                <span style={{ fontSize: 10, color: "var(--text3)" }}>{DAYS[i]}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: "8px 0", borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>Avg: <strong style={{ color: "var(--accent)" }}>{Math.round(productivity.reduce((a, b) => a + b, 0) / productivity.length)}%</strong></span>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>Peak: <strong style={{ color: "var(--info)" }}>{Math.max(...productivity)}%</strong></span>
          </div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Burnout Risk Monitor</span>
            <button className="btn btn-sm btn-secondary" onClick={analyzeBurnout}>
              {aiLoading ? <span className="spinner" /> : "Analyze"}
            </button>
          </div>
          <div className="burnout-track" style={{ marginBottom: 12 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="burnout-seg" style={{
                background: i < burnout / 5
                  ? i < 8 ? "var(--accent2)" : i < 14 ? "var(--warn)" : "var(--warn2)"
                  : "var(--border)",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Low", desc: "< 40%", color: "var(--accent)" },
              { label: "Moderate", desc: "40\u201370%", color: "var(--warn2)" },
              { label: "High", desc: "> 70%", color: "var(--warn)" }
            ].map(item => (
              <div key={item.label} style={{ flex: 1, background: "var(--bg3)", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                  {item.label}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: 12, background: "var(--bg3)", borderRadius: 8, fontSize: 13, color: "var(--text2)", display: "flex", gap: 8, alignItems: "center" }}>
            <Lightbulb size={20} color="var(--accent)" />
            <div><strong>Tip:</strong> You've had 3 productive days in a row. Consider a lighter evening today.</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">AI Recommendations</span></div>
          {[
            { icon: <Brain size={20} />, text: "Peak DSA focus: 8\u201310am (your historical best)", tag: "Cognitive", tagClass: "tag-info" },
            { icon: <Activity size={20} />, text: "Gym consistency: 6am workouts show 40% better completion", tag: "Habit", tagClass: "tag-active" },
            { icon: <Moon size={20} />, text: "Sleep debt detected. Aim for 10pm tonight", tag: "Recovery", tagClass: "tag-warn" },
            { icon: <Flame size={20} />, text: "Pomodoro at 2pm boosts afternoon focus by 35%", tag: "Focus", tagClass: "tag-info" },
          ].map((r, i) => (
            <div key={i} className="analytics-row">
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <span style={{ flex: 1, fontSize: 12, color: "var(--text2)" }}>{r.text}</span>
              <span className={`tag ${r.tagClass}`}>{r.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
