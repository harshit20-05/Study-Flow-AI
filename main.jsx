import { useState, useEffect, useRef, useCallback } from "react";

// ── Palette & theme ──────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #080b0f;
  --bg2: #0d1117;
  --bg3: #131920;
  --surface: #161d27;
  --surface2: #1c2534;
  --border: #1f2d3d;
  --border2: #263649;
  --accent: #00e5a0;
  --accent2: #00b87a;
  --accent3: #00ffc3;
  --warn: #ff7b4b;
  --warn2: #ff5a1e;
  --info: #4db8ff;
  --info2: #1a9fff;
  --purple: #b87bff;
  --text: #e8f0fe;
  --text2: #8fa3bf;
  --text3: #4a6580;
  --glow: 0 0 20px rgba(0,229,160,0.15);
  --glow-warn: 0 0 20px rgba(255,123,75,0.2);
  --r: 12px;
  --r2: 8px;
  --r3: 16px;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; overflow-x: hidden; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

.mono { font-family: 'DM Mono', monospace; }
.serif { font-family: 'Instrument Serif', serif; }

/* ── Layout ── */
.shell { display: flex; min-height: 100vh; }

.sidebar {
  width: 220px; min-width: 220px; background: var(--bg2);
  border-right: 1px solid var(--border); display: flex; flex-direction: column;
  position: fixed; height: 100vh; z-index: 100; transition: transform .3s;
}
.sidebar-logo {
  padding: 24px 20px 16px; border-bottom: 1px solid var(--border);
  font-size: 13px; font-weight: 800; letter-spacing: .5px; color: var(--accent);
  display: flex; align-items: center; gap: 10px;
}
.logo-dot { width: 28px; height: 28px; background: var(--accent); border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 15px;
  box-shadow: var(--glow); flex-shrink: 0; }

.nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border-radius: var(--r2); cursor: pointer; font-size: 13px; font-weight: 500;
  color: var(--text2); transition: all .2s; position: relative;
}
.nav-item:hover { background: var(--surface); color: var(--text); }
.nav-item.active { background: rgba(0,229,160,.1); color: var(--accent); }
.nav-item.active::before {
  content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  width: 3px; height: 60%; background: var(--accent); border-radius: 0 2px 2px 0;
}
.nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
.nav-badge { margin-left: auto; background: var(--warn); color: #fff;
  font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 20px; }

.sidebar-footer { padding: 12px 10px 20px; border-top: 1px solid var(--border); }

.main { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

.topbar {
  height: 60px; border-bottom: 1px solid var(--border); display: flex; align-items: center;
  padding: 0 28px; gap: 16px; background: rgba(8,11,15,.8); backdrop-filter: blur(12px);
  position: sticky; top: 0; z-index: 90;
}
.topbar-title { font-size: 18px; font-weight: 700; flex: 1; }
.topbar-sub { font-size: 12px; color: var(--text3); font-family: 'DM Mono', monospace; margin-top: 1px; }

.content { flex: 1; padding: 28px; }

/* ── Cards ── */
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r3); padding: 20px; position: relative; overflow: hidden;
}
.card-accent { border-color: rgba(0,229,160,.3); box-shadow: var(--glow); }
.card-warn { border-color: rgba(255,123,75,.3); box-shadow: var(--glow-warn); }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text2); }
.card-value { font-size: 32px; font-weight: 800; line-height: 1; }
.card-meta { font-size: 12px; color: var(--text3); margin-top: 4px; font-family: 'DM Mono', monospace; }

/* ── Grid ── */
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
.grid4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
  border-radius: var(--r2); font-size: 13px; font-weight: 600; cursor: pointer;
  border: none; transition: all .2s; font-family: 'Syne', sans-serif; letter-spacing: .3px;
}
.btn-primary { background: var(--accent); color: #080b0f; }
.btn-primary:hover { background: var(--accent3); transform: translateY(-1px); box-shadow: var(--glow); }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border2); }
.btn-secondary:hover { background: var(--bg3); border-color: var(--accent); color: var(--accent); }
.btn-ghost { background: transparent; color: var(--text2); }
.btn-ghost:hover { color: var(--text); background: var(--surface); }
.btn-warn { background: var(--warn); color: #fff; }
.btn-sm { padding: 6px 12px; font-size: 12px; }
.btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── Inputs ── */
.input, .select, .textarea {
  width: 100%; background: var(--bg3); border: 1px solid var(--border2);
  border-radius: var(--r2); padding: 10px 14px; color: var(--text);
  font-size: 13px; font-family: 'Syne', sans-serif; outline: none; transition: border-color .2s;
}
.input:focus, .select:focus, .textarea:focus { border-color: var(--accent); }
.input::placeholder, .textarea::placeholder { color: var(--text3); }
.textarea { resize: vertical; min-height: 80px; }
.select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 8L1 3h10z' fill='%238fa3bf'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }

.label { font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: .5px; }
.field { margin-bottom: 16px; }

/* ── Tags / Chips ── */
.tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  border: 1px solid; cursor: pointer; transition: all .2s;
}
.tag-active { background: rgba(0,229,160,.15); border-color: var(--accent); color: var(--accent); }
.tag-default { background: var(--surface2); border-color: var(--border2); color: var(--text2); }
.tag-warn { background: rgba(255,123,75,.15); border-color: var(--warn); color: var(--warn); }
.tag-info { background: rgba(77,184,255,.15); border-color: var(--info); color: var(--info); }

/* ── Progress ── */
.progress-bar { height: 6px; background: var(--bg3); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 3px; transition: width .6s ease; }
.fill-accent { background: linear-gradient(90deg, var(--accent2), var(--accent3)); }
.fill-warn { background: linear-gradient(90deg, var(--warn2), var(--warn)); }
.fill-info { background: linear-gradient(90deg, var(--info2), var(--info)); }
.fill-purple { background: linear-gradient(90deg, #8b5cf6, var(--purple)); }

/* ── Schedule blocks ── */
.schedule-row { display: flex; gap: 12px; margin-bottom: 8px; align-items: flex-start; }
.time-label { font-size: 11px; color: var(--text3); font-family: 'DM Mono', monospace;
  min-width: 44px; padding-top: 10px; text-align: right; flex-shrink: 0; }
.time-line { width: 1px; background: var(--border); flex-shrink: 0; margin: 10px 8px 0; min-height: 40px; }
.block {
  flex: 1; border-radius: var(--r2); padding: 10px 14px; cursor: pointer;
  border-left: 3px solid; transition: all .2s; position: relative;
}
.block:hover { transform: translateX(2px); filter: brightness(1.1); }
.block-title { font-size: 13px; font-weight: 600; }
.block-meta { font-size: 11px; opacity: .7; margin-top: 2px; font-family: 'DM Mono', monospace; }
.block-done { opacity: .5; }
.block-done .block-title { text-decoration: line-through; }

.block-study { background: rgba(77,184,255,.1); border-color: var(--info); }
.block-dsa { background: rgba(184,123,255,.1); border-color: var(--purple); }
.block-gym { background: rgba(0,229,160,.1); border-color: var(--accent); }
.block-break { background: rgba(255,123,75,.1); border-color: var(--warn); }
.block-sleep { background: rgba(30,40,60,.8); border-color: var(--border2); }
.block-work { background: rgba(255,210,60,.08); border-color: #ffd23c; }
.block-meal { background: rgba(100,220,100,.1); border-color: #5dbb63; }

/* ── Pomodoro ── */
.pomo-ring {
  width: 160px; height: 160px; border-radius: 50%; margin: 0 auto 20px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.pomo-svg { position: absolute; top: 0; left: 0; transform: rotate(-90deg); }
.pomo-time { font-size: 36px; font-weight: 800; font-family: 'DM Mono', monospace; }
.pomo-label { font-size: 11px; color: var(--text3); text-align: center; margin-top: 4px; }

/* ── AI Chat ── */
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-height: 0; }
.chat-bubble { max-width: 85%; padding: 12px 16px; border-radius: var(--r3); font-size: 13px; line-height: 1.6; }
.chat-user { background: rgba(0,229,160,.12); border: 1px solid rgba(0,229,160,.2); align-self: flex-end; color: var(--text); border-radius: var(--r3) var(--r3) 4px var(--r3); }
.chat-ai { background: var(--surface2); border: 1px solid var(--border2); align-self: flex-start; color: var(--text); border-radius: var(--r3) var(--r3) var(--r3) 4px; }
.chat-input-area { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--border); }

/* ── Stat changes ── */
.delta-up { color: var(--accent); font-size: 11px; }
.delta-down { color: var(--warn); font-size: 11px; }

/* ── Loading ── */
.spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(0,229,160,.2); border-top-color: var(--accent); border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.skeleton { background: linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Onboarding ── */
.onboard-step { animation: fadeUp .4s ease; }
@keyframes fadeUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }

/* ── Chart bars ── */
.bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
.bar { flex: 1; border-radius: 4px 4px 0 0; transition: height .6s ease; min-width: 8px; cursor: pointer; }
.bar:hover { filter: brightness(1.3); }

/* ── Burnout meter ── */
.burnout-track { display: flex; gap: 4px; }
.burnout-seg { flex: 1; height: 8px; border-radius: 4px; transition: background .3s; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .sidebar { transform: translateX(-220px); }
  .main { margin-left: 0; }
  .grid4 { grid-template-columns: 1fr 1fr; }
  .grid3 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .grid2, .grid3, .grid4 { grid-template-columns: 1fr; }
  .content { padding: 16px; }
}

.dot-pulse::after { content: '...'; animation: dots 1.2s infinite; }
@keyframes dots { 0%,20%{content:'.'} 40%{content:'..'} 60%,100%{content:'...'} }

.glow-text { color: var(--accent); text-shadow: 0 0 20px rgba(0,229,160,.4); }
.fade-in { animation: fadeIn .5s ease; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }

.week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.week-col { display: flex; flex-direction: column; gap: 4px; }
.week-head { font-size: 11px; font-weight: 700; color: var(--text3); text-align: center;
  padding: 6px 4px; text-transform: uppercase; letter-spacing: .5px; }
.week-block { border-radius: 6px; padding: 6px 8px; font-size: 10px; font-weight: 600;
  border-left: 2px solid; line-height: 1.4; }

.completion-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }

.analytics-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.analytics-row:last-child { border-bottom: none; }
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

async function callClaude(messages, system = "", maxTokens = 1000) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const now = new Date();
const fmtTime = (h, m = 0) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function CircularProgress({ value, size = 100, stroke = 8, color = "var(--accent)" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - dash}
        strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset .8s ease" }} />
    </svg>
  );
}

const SAMPLE_BLOCKS = [
  { id: 1, hour: 6, duration: 30, type: "gym", title: "Morning Workout", done: true },
  { id: 2, hour: 7, duration: 30, type: "meal", title: "Breakfast + Prep", done: true },
  { id: 3, hour: 8, duration: 90, type: "dsa", title: "DSA Practice (LeetCode)", done: true },
  { id: 4, hour: 9, duration: 30, type: "break", title: "Break / Walk", done: false },
  { id: 5, hour: 10, duration: 120, type: "study", title: "Core Study Block", done: false },
  { id: 6, hour: 12, duration: 60, type: "meal", title: "Lunch", done: false },
  { id: 7, hour: 13, duration: 90, type: "work", title: "Project / Assignments", done: false },
  { id: 8, hour: 14, duration: 30, type: "break", title: "Pomodoro Break", done: false },
  { id: 9, hour: 15, duration: 120, type: "study", title: "Deep Study / Research", done: false },
  { id: 10, hour: 17, duration: 30, type: "break", title: "Evening Walk", done: false },
  { id: 11, hour: 18, duration: 60, type: "dsa", title: "DSA Review + Theory", done: false },
  { id: 12, hour: 19, duration: 60, type: "meal", title: "Dinner + Rest", done: false },
  { id: 13, hour: 20, duration: 90, type: "study", title: "Revision Block", done: false },
  { id: 14, hour: 22, duration: 30, type: "break", title: "Wind Down", done: false },
  { id: 15, hour: 22, duration: 480, type: "sleep", title: "Sleep", done: false },
];

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("onboard");
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState(SAMPLE_BLOCKS);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [pomodoroState, setPomodoroState] = useState({ active: false, seconds: 25 * 60, mode: "focus", cycles: 0 });
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hey! I'm your AI planning assistant. Ask me anything like \"Plan my day\", \"When should I study DSA?\", or \"I'm feeling burned out today\"." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [productivity, setProductivity] = useState([72, 85, 61, 90, 78, 55, 88]);
  const [burnout, setBurnout] = useState(38);
  const [weekSchedule, setWeekSchedule] = useState(null);
  const [notification, setNotification] = useState(null);
  const timerRef = useRef(null);
  const chatEndRef = useRef(null);

  // Pomodoro timer
  useEffect(() => {
    if (pomodoroState.active) {
      timerRef.current = setInterval(() => {
        setPomodoroState(p => {
          if (p.seconds <= 1) {
            clearInterval(timerRef.current);
            const next = p.mode === "focus" ? "break" : "focus";
            const secs = next === "focus" ? 25 * 60 : 5 * 60;
            showNotif(next === "break" ? "Focus session done! Take a 5-min break 🎉" : "Break over! Back to focus 🚀");
            return { ...p, active: false, seconds: secs, mode: next, cycles: p.mode === "focus" ? p.cycles + 1 : p.cycles };
          }
          return { ...p, seconds: p.seconds - 1 };
        });
      }, 1000);
    } else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [pomodoroState.active]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const toggleBlock = (id) => {
    setSchedule(s => s.map(b => b.id === id ? { ...b, done: !b.done } : b));
  };

  const completedCount = schedule.filter(b => b.done && b.type !== "sleep").length;
  const totalCount = schedule.filter(b => b.type !== "sleep").length;
  const completionPct = Math.round((completedCount / totalCount) * 100);

  const generateSchedule = async (prof) => {
    setScheduleLoading(true);
    setPage("app");
    setActiveNav("schedule");
    try {
      const sys = `You are a life optimization AI. Generate a JSON daily schedule array. Each item: {id,hour,duration,type,title,done:false}. Types: study,dsa,gym,break,meal,sleep,work. Make it realistic and optimized for: ${JSON.stringify(prof)}. Return ONLY valid JSON array, no markdown.`;
      const raw = await callClaude([{ role: "user", content: `Create optimized daily schedule for: ${JSON.stringify(prof)}` }], sys, 1500);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setSchedule(parsed);
      showNotif("✨ AI-optimized schedule generated!");
    } catch {
      setSchedule(SAMPLE_BLOCKS);
      showNotif("Schedule generated (default template)");
    }
    setScheduleLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || aiLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatHistory(h => [...h, { role: "user", content: msg }]);
    setAiLoading(true);
    try {
      const sys = `You are an intelligent life optimization assistant. User profile: ${JSON.stringify(profile)}. Current schedule completion: ${completionPct}%. Burnout risk: ${burnout}%. Answer concisely and actionably. If asked to plan a day, provide a brief optimized schedule. Keep responses under 200 words.`;
      const messages = [...chatHistory, { role: "user", content: msg }].map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(messages, sys, 800);
      setChatHistory(h => [...h, { role: "assistant", content: reply }]);
    } catch {
      setChatHistory(h => [...h, { role: "assistant", content: "I'm having trouble connecting right now. Please try again!" }]);
    }
    setAiLoading(false);
  };

  const generateWeekPlan = async () => {
    setAiLoading(true);
    try {
      const sys = `Generate a weekly schedule overview as JSON. Format: {Mon:[{type,title,hour},...], Tue:[...], ...} for all 7 days. Each day 4-6 key blocks. Types: study,dsa,gym,break,meal,work. Return ONLY valid JSON, no markdown.`;
      const raw = await callClaude([{ role: "user", content: `Weekly plan for: ${JSON.stringify(profile)}` }], sys, 1500);
      const clean = raw.replace(/```json|```/g, "").trim();
      setWeekSchedule(JSON.parse(clean));
      showNotif("📅 Weekly plan generated!");
    } catch {
      setWeekSchedule({
        Mon: [{ type: "gym", title: "Gym", hour: 6 }, { type: "dsa", title: "DSA", hour: 8 }, { type: "study", title: "Study", hour: 10 }],
        Tue: [{ type: "study", title: "Study", hour: 8 }, { type: "dsa", title: "DSA", hour: 14 }, { type: "gym", title: "Gym", hour: 17 }],
        Wed: [{ type: "gym", title: "Gym", hour: 6 }, { type: "dsa", title: "DSA", hour: 8 }, { type: "study", title: "Study", hour: 10 }],
        Thu: [{ type: "study", title: "Deep Study", hour: 8 }, { type: "work", title: "Projects", hour: 13 }],
        Fri: [{ type: "gym", title: "Gym", hour: 6 }, { type: "dsa", title: "DSA Mock", hour: 9 }, { type: "study", title: "Revision", hour: 14 }],
        Sat: [{ type: "study", title: "Study", hour: 9 }, { type: "break", title: "Rest", hour: 15 }],
        Sun: [{ type: "break", title: "Rest & Recharge", hour: 10 }, { type: "study", title: "Light Review", hour: 16 }],
      });
    }
    setAiLoading(false);
  };

  const analyzeBurnout = async () => {
    setAiLoading(true);
    try {
      const sys = `You are a wellbeing analyst. Analyze the schedule and give a 2-sentence burnout assessment and 3 bullet-point recommendations. Be concise.`;
      const msg = `Schedule completion: ${completionPct}%. Daily blocks: ${schedule.length}. Burnout meter: ${burnout}%. Profile: ${JSON.stringify(profile)}`;
      const reply = await callClaude([{ role: "user", content: msg }], sys, 400);
      setChatHistory(h => [...h, { role: "assistant", content: `🔍 **Burnout Analysis:**\n\n${reply}` }]);
      setActiveNav("assistant");
    } catch { }
    setAiLoading(false);
  };

  if (page === "onboard") return <Onboarding onComplete={(p) => { setProfile(p); generateSchedule(p); }} />;

  const pomMin = String(Math.floor(pomodoroState.seconds / 60)).padStart(2, "0");
  const pomSec = String(pomodoroState.seconds % 60).padStart(2, "0");
  const pomPct = pomodoroState.mode === "focus"
    ? ((25 * 60 - pomodoroState.seconds) / (25 * 60)) * 100
    : ((5 * 60 - pomodoroState.seconds) / (5 * 60)) * 100;

  const renderPage = () => {
    switch (activeNav) {
      case "dashboard": return (
        <div className="fade-in">
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>Good {now.getHours() < 12 ? "Morning" : now.getHours() < 17 ? "Afternoon" : "Evening"}, {profile?.name || "Optimizer"} 👋</h1>
            <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 4 }}>{now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          <div className="grid4" style={{ marginBottom: 20 }}>
            {[
              { label: "Completion", value: `${completionPct}%`, meta: `${completedCount}/${totalCount} tasks`, color: "var(--accent)", fill: "fill-accent" },
              { label: "Focus Score", value: "87", meta: "Above avg today", color: "var(--info)", fill: "fill-info" },
              { label: "Streak", value: "12d", meta: "Personal best!", color: "var(--purple)", fill: "fill-purple" },
              { label: "Burnout Risk", value: `${burnout}%`, meta: burnout < 40 ? "Low – keep it up" : burnout < 70 ? "Moderate – take breaks" : "High – rest!", color: burnout > 60 ? "var(--warn)" : "var(--accent)", fill: burnout > 60 ? "fill-warn" : "fill-accent" },
            ].map(s => (
              <div key={s.label} className={`card ${s.color === "var(--accent)" ? "card-accent" : ""}`}>
                <div className="card-title" style={{ marginBottom: 12 }}>{s.label}</div>
                <div className="card-value" style={{ color: s.color }}>{s.value}</div>
                <div style={{ marginTop: 10 }}>
                  <div className="progress-bar">
                    <div className={`progress-fill ${s.fill}`} style={{ width: s.value.includes("%") ? s.value : "70%" }} />
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
                {[["🟢 Low", "< 40%"], ["🟡 Moderate", "40–70%"], ["🔴 High", "> 70%"]].map(([l, r]) => (
                  <div key={l} style={{ flex: 1, background: "var(--bg3)", borderRadius: 8, padding: "6px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700 }}>{l}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{r}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: 10, background: "var(--bg3)", borderRadius: 8, fontSize: 12, color: "var(--text2)" }}>
                💡 <strong>Tip:</strong> You've had 3 productive days in a row. Consider a lighter evening today.
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">AI Recommendations</span></div>
              {[
                { icon: "🧠", text: "Peak DSA focus: 8–10am (your historical best)", tag: "Cognitive", tagClass: "tag-info" },
                { icon: "💪", text: "Gym consistency: 6am workouts show 40% better completion", tag: "Habit", tagClass: "tag-active" },
                { icon: "😴", text: "Sleep debt detected. Aim for 10pm tonight", tag: "Recovery", tagClass: "tag-warn" },
                { icon: "🔥", text: "Pomodoro at 2pm boosts afternoon focus by 35%", tag: "Focus", tagClass: "tag-info" },
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

      case "schedule": return (
        <div className="fade-in">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>Today's Schedule</h1>
              <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Click tasks to mark complete • Drag to reschedule</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setBurnout(b => clamp(b + 5, 0, 100)); showNotif("Schedule adjusted — lighter version applied"); }}>
                🔄 Reschedule
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => profile && generateSchedule(profile)} disabled={scheduleLoading}>
                {scheduleLoading ? <><span className="spinner" /> Generating…</> : "✨ AI Regenerate"}
              </button>
            </div>
          </div>
          {scheduleLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 54, borderRadius: 10 }} />
              ))}
            </div>
          ) : (
            <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto", paddingRight: 4 }}>
              {schedule.map(b => (
                <div key={b.id} className="schedule-row">
                  <div className="time-label">{fmtTime(b.hour)}</div>
                  <div className="time-line" />
                  <div className={`block block-${b.type} ${b.done ? "block-done" : ""}`} onClick={() => toggleBlock(b.id)}
                    style={{ opacity: b.type === "sleep" ? .6 : 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div className="block-title">{b.title}</div>
                        <div className="block-meta">{b.duration} min · {b.type}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                        {b.done && <span style={{ fontSize: 16 }}>✅</span>}
                        {b.type === "dsa" && <span className="tag tag-info" style={{ fontSize: 10, padding: "2px 6px" }}>DSA</span>}
                        {b.type === "gym" && <span className="tag tag-active" style={{ fontSize: 10, padding: "2px 6px" }}>Fitness</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

      case "weekly": return (
        <div className="fade-in">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800 }}>Weekly Planner</h1>
              <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>7-day optimized view</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={generateWeekPlan} disabled={aiLoading}>
              {aiLoading ? <><span className="spinner" /> Generating…</> : "✨ Generate Week Plan"}
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
              <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No weekly plan yet</div>
              <div style={{ fontSize: 13, marginBottom: 20 }}>Click "Generate Week Plan" to get your AI-optimized weekly schedule</div>
              <button className="btn btn-primary" onClick={generateWeekPlan}>✨ Generate Week Plan</button>
            </div>
          )}
        </div>
      );

      case "pomodoro": return (
        <div className="fade-in" style={{ maxWidth: 400, margin: "0 auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Focus Mode</h1>
          <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 28 }}>Pomodoro timer for deep work sessions</p>

          <div className="card card-accent" style={{ textAlign: "center", padding: 32 }}>
            <div style={{ marginBottom: 8 }}>
              <span className={`tag ${pomodoroState.mode === "focus" ? "tag-active" : "tag-warn"}`}>
                {pomodoroState.mode === "focus" ? "🔥 Focus Session" : "☕ Break Time"}
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
                {pomodoroState.active ? "⏸ Pause" : "▶ Start"}
              </button>
              <button className="btn btn-secondary" onClick={() => setPomodoroState(p => ({ ...p, active: false, seconds: 25 * 60, mode: "focus" }))}>
                ↺ Reset
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
                  onClick={() => setPomodoroState(p => ({ ...p, active: false, seconds: f * 60, mode: "focus" }))}>
                  {l} min
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>Today's Focus Stats</div>
            {[
              { label: "Focus time", value: `${pomodoroState.cycles * 25} min`, color: "var(--accent)" },
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

      case "analytics": return (
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
                    {m.up ? "↑" : "↓"} {m.delta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      case "assistant": return (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800 }}>AI Assistant</h1>
            <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>Ask me to plan your day, analyze patterns, or optimize your schedule</p>
          </div>
          <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: 0 }}>
            <div className="chat-messages">
              {chatHistory.map((m, i) => (
                <div key={i} className={`chat-bubble chat-${m.role === "user" ? "user" : "ai"}`}>
                  {m.role === "assistant" && <div style={{ fontSize: 11, color: "var(--accent)", marginBottom: 4, fontWeight: 700 }}>✦ AI OPTIMIZER</div>}
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                </div>
              ))}
              {aiLoading && (
                <div className="chat-bubble chat-ai">
                  <div style={{ fontSize: 11, color: "var(--accent)", marginBottom: 4, fontWeight: 700 }}>✦ AI OPTIMIZER</div>
                  <span className="dot-pulse">Thinking</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-area">
              <input className="input" placeholder='Try: "Plan my day", "I missed my gym session", "Analyze my burnout"…'
                value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={sendChat} disabled={aiLoading || !chatInput.trim()}>
                {aiLoading ? <span className="spinner" /> : "Send"}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {["Plan my day", "Best time to study DSA?", "I'm feeling burned out", "Reschedule my afternoon"].map(q => (
              <button key={q} className="btn btn-secondary btn-sm" onClick={() => { setChatInput(q); }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: "var(--surface)", border: "1px solid var(--accent)",
          borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "var(--glow)", animation: "fadeUp .3s ease", color: "var(--text)",
          maxWidth: 320,
        }}>{notification}</div>
      )}
      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-dot">⚡</div>
            <span>LifeOS</span>
          </div>
          <nav className="nav">
            {[
              { id: "dashboard", icon: "⊞", label: "Dashboard" },
              { id: "schedule", icon: "◷", label: "Today", badge: schedule.filter(b => !b.done && b.type !== "sleep").length || null },
              { id: "weekly", icon: "▦", label: "Weekly" },
              { id: "pomodoro", icon: "◉", label: "Focus Mode" },
              { id: "analytics", icon: "↗", label: "Analytics" },
              { id: "assistant", icon: "✦", label: "AI Assistant" },
            ].map(n => (
              <div key={n.id} className={`nav-item ${activeNav === n.id ? "active" : ""}`}
                onClick={() => setActiveNav(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                <span>{n.label}</span>
                {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div style={{ padding: "8px 12px", background: "var(--bg3)", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>Profile</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{profile?.name || "User"}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{profile?.goals?.slice(0, 2).join(" · ") || "Optimizer"}</div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div>
              <div className="topbar-title">{activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}</div>
              <div className="topbar-sub">{now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {completionPct}% complete</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
              {pomodoroState.active && (
                <div style={{ background: "rgba(0,229,160,.1)", border: "1px solid var(--accent)", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "var(--accent)" }}>
                  🔥 {pomMin}:{pomSec}
                </div>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => setPage("onboard")}>↩ Setup</button>
            </div>
          </div>
          <div className="content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}

// ── Onboarding ────────────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
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
                  {form.goals.includes(g) ? "✓ " : ""}{g}
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
            <input className="input" placeholder="e.g. GATE exam in 60 days, Project due next Friday…" value={form.deadlines} onChange={e => setForm(f => ({ ...f, deadlines: e.target.value }))} />
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
              {[["morning", "☀️ Morning", "5am–12pm"], ["afternoon", "⛅ Afternoon", "12pm–5pm"], ["evening", "🌙 Evening", "5pm–12am"]].map(([v, l, t]) => (
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
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "8px 16px", marginBottom: 24 }}>
              <span style={{ color: "var(--accent)", fontSize: 20 }}>⚡</span>
              <span style={{ fontWeight: 800, letterSpacing: .5 }}>LifeOS</span>
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
            {step > 0 && <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>← Back</button>}
            <button className="btn btn-primary" style={{ flex: 1 }} disabled={!canNext}
              onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete(form)}>
              {step < steps.length - 1 ? "Continue →" : "✨ Generate My Schedule"}
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", marginTop: 14 }}>
            Powered by Claude AI · Your data stays private
          </p>
        </div>
      </div>
    </>
  );
}
