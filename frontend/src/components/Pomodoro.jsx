import React from 'react';
import CircularProgress from './CircularProgress';

export default function Pomodoro({ pomodoroState, setPomodoroState }) {
  const pomMin = String(Math.floor(pomodoroState.seconds / 60)).padStart(2, "0");
  const pomSec = String(pomodoroState.seconds % 60).padStart(2, "0");
  const pomPct = pomodoroState.mode === "focus"
    ? ((pomodoroState.focusLength * 60 - pomodoroState.seconds) / (pomodoroState.focusLength * 60)) * 100
    : ((pomodoroState.breakLength * 60 - pomodoroState.seconds) / (pomodoroState.breakLength * 60)) * 100;

  return (
    <div className="fade-in" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Focus Mode</h1>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 28 }}>Pomodoro timer for deep work sessions</p>

      <div className="card card-accent" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ marginBottom: 8 }}>
          <span className={`tag ${pomodoroState.mode === "focus" ? "tag-active" : "tag-warn"}`}>
            {pomodoroState.mode === "focus" ? "Focus Session" : "Break Time"}
          </span>
        </div>
        <div className="pomo-ring" style={{ margin: "20px auto" }}>
          <CircularProgress value={pomPct} size={160} stroke={10}
            color={pomodoroState.mode === "focus" ? "var(--accent)" : "var(--warn)"} />
          <div style={{ position: "absolute", textAlign: "center" }}>
            <div className="pomo-time">{pomMin}:{pomSec}</div>
            <div className="pomo-label">{pomodoroState.mode === "focus" ? "minutes left" : "break"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
          <button className="btn btn-primary" onClick={() => setPomodoroState(p => ({ ...p, active: !p.active }))}>
            {pomodoroState.active ? "Pause" : "Start"}
          </button>
          <button className="btn btn-secondary" onClick={() => setPomodoroState(p => ({ ...p, active: false, seconds: p.focusLength * 60, mode: "focus" }))}>
            Reset
          </button>
        </div>
        <div style={{ color: "var(--text2)", fontSize: 13 }}>
          Completed cycles: <strong style={{ color: "var(--accent)" }}>{pomodoroState.cycles}</strong>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title" style={{ marginBottom: 12 }}>Timer Presets</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["25 / 5", 25, 5], ["50 / 10", 50, 10], ["90 / 15", 90, 15]].map(([l, f, b]) => (
            <button key={l} className="btn btn-secondary btn-sm"
              onClick={() => setPomodoroState(p => ({ ...p, active: false, focusLength: f, breakLength: b, seconds: f * 60, mode: "focus" }))}>
              {l} min
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title" style={{ marginBottom: 12 }}>Today's Focus Stats</div>
        {[
          { label: "Focus time", value: `${pomodoroState.cycles * pomodoroState.focusLength} min`, color: "var(--accent)" },
          { label: "Sessions", value: pomodoroState.cycles, color: "var(--info)" },
          { label: "Target", value: "4 sessions", color: "var(--text2)" },
        ].map(s => (
          <div key={s.label} className="analytics-row">
            <span style={{ flex: 1, fontSize: 13, color: "var(--text2)" }}>{s.label}</span>
            <strong style={{ color: s.color }}>{s.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
