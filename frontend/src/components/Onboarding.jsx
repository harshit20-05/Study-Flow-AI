import React, { useState } from "react";
import { BookOpen } from "lucide-react";

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", goals: [], wakeTime: "06:00", sleepTime: "22:30",
    availableHours: 8, energyPeak: "morning",
    priorities: [], deadlines: "", routineStyle: "structured",
  });

  const GOALS = ["DSA Practice", "Core Study", "Gym / Fitness", "Side Projects", "Reading", "Meditation", "Language Learning"];
  const PRIORITIES = ["Exams / Deadlines", "Career Growth", "Physical Health", "Mental Wellness", "Skill Building"];

  const toggle = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val],
    }));
  };

  const steps = [
    {
      title: "Welcome to LifeOS", subtitle: "Let's build your optimization profile",
      content: (
        <>
          <div className="field">
            <label className="label">Your Name</label>
            <input className="input" placeholder="What should I call you?" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="field">
            <label className="label">Routine Style</label>
            <select className="select" value={form.routineStyle} onChange={e => setForm(f => ({ ...f, routineStyle: e.target.value }))}>
              <option value="structured">Structured (strict schedule)</option>
              <option value="flexible">Flexible (loose blocks)</option>
              <option value="adaptive">Adaptive (AI decides daily)</option>
            </select>
          </div>
          <div className="field">
            <label className="label">Available Hours / Day</label>
            <input type="range" min={4} max={16} value={form.availableHours}
              onChange={e => setForm(f => ({ ...f, availableHours: +e.target.value }))}
              style={{ width: "100%", accentColor: "var(--accent)" }} />
            <div style={{ textAlign: "center", marginTop: 6, fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{form.availableHours} hours</div>
          </div>
        </>
      ),
    },
    {
      title: "Your Goals", subtitle: "Select everything you want to optimize for",
      content: (
        <>
          <div className="field">
            <label className="label">Goals (select all that apply)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {GOALS.map(g => (
                <span key={g} className={`tag ${form.goals.includes(g) ? "tag-active" : "tag-default"}`} onClick={() => toggle("goals", g)}>
                  {form.goals.includes(g) ? "\u2713 " : ""}{g}
                </span>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="label">Top Priorities</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PRIORITIES.map(p => (
                <span key={p} className={`tag ${form.priorities.includes(p) ? "tag-active" : "tag-default"}`} onClick={() => toggle("priorities", p)}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="label">Upcoming Deadlines (optional)</label>
            <input className="input" placeholder="e.g. GATE exam in 60 days, Project due next Friday\u2026" value={form.deadlines} onChange={e => setForm(f => ({ ...f, deadlines: e.target.value }))} />
          </div>
        </>
      ),
    },
    {
      title: "Your Rhythm", subtitle: "Help the AI understand your biological clock",
      content: (
        <>
          <div className="grid2">
            <div className="field">
              <label className="label">Wake Up Time</label>
              <input type="time" className="input" value={form.wakeTime} onChange={e => setForm(f => ({ ...f, wakeTime: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">Sleep Time</label>
              <input type="time" className="input" value={form.sleepTime} onChange={e => setForm(f => ({ ...f, sleepTime: e.target.value }))} />
            </div>
          </div>
          <div className="field">
            <label className="label">Peak Energy Time</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[["morning", "Morning", "5am\u201312pm"], ["afternoon", "Afternoon", "12pm\u20135pm"], ["evening", "Evening", "5pm\u201312am"]].map(([v, l, t]) => (
                <div key={v} onClick={() => setForm(f => ({ ...f, energyPeak: v }))}
                  style={{
                    flex: 1, padding: 12, borderRadius: 10, cursor: "pointer", textAlign: "center",
                    border: `1px solid ${form.energyPeak === v ? "var(--accent)" : "var(--border2)"}`,
                    background: form.energyPeak === v ? "rgba(0,229,160,.1)" : "var(--bg3)",
                  }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{l.split(" ")[0]}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: form.energyPeak === v ? "var(--accent)" : "var(--text2)" }}>{l.split(" ")[1]}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{t}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
  ];

  const cur = steps[step];
  const canNext = step === 0 ? form.name.trim() : step === 1 ? form.goals.length > 0 : true;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 16px", marginBottom: 24 }}>
            <span style={{ color: "var(--accent)", fontSize: 20, display: "flex" }}><BookOpen size={20} /></span>
            <span style={{ fontWeight: 800, letterSpacing: .5 }}>StudyFlow AI</span>
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }} className="glow-text">{cur.title}</h2>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>{cur.subtitle}</p>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 28, justifyContent: "center" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 28 : 8, height: 8, borderRadius: 4,
              background: i < step ? "var(--accent2)" : i === step ? "var(--accent)" : "var(--border2)",
              transition: "all .3s",
            }} />
          ))}
        </div>

        <div className="card onboard-step" key={step}>
          {cur.content}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          {step > 0 && <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn btn-primary" style={{ flex: 1 }} disabled={!canNext}
            onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete(form)}>
            {step < steps.length - 1 ? "Continue" : "Generate My Schedule"}
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginTop: 14 }}>
          Powered by Claude AI \u00B7 Your data stays private
        </p>
      </div>
    </div>
  );
}
