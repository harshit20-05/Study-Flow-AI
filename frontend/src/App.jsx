import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

import { callClaude, DAYS, clamp, SAMPLE_BLOCKS } from './utils/helpers';
import Dashboard from './components/Dashboard';
import ScheduleUI from './components/ScheduleUI';
import Weekly from './components/Weekly';
import Pomodoro from './components/Pomodoro';
import Analytics from './components/Analytics';
import Assistant from './components/Assistant';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [page, setPage] = useState("onboard");
  const [profile, setProfile] = useState(null);
  const [schedule, setSchedule] = useState(SAMPLE_BLOCKS);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [pomodoroState, setPomodoroState] = useState({ active: false, seconds: 25 * 60, focusLength: 25, breakLength: 5, mode: "focus", cycles: 0 });
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: 'Hey! I\'m your AI planning assistant. Ask me anything like "Plan my day", "When should I study DSA?", or "I\'m feeling burned out today".' }
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
  
  const now = new Date();

  // Authentication Check on Load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('lifeos_token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:8000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('lifeos_token');
        }
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    showNotif(`Welcome back to StudyFlow, ${user.name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('lifeos_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPage("onboard");
  };

  // Pomodoro timer
  useEffect(() => {
    if (pomodoroState.active) {
      timerRef.current = setInterval(() => {
        setPomodoroState(p => {
          if (p.seconds <= 1) {
            clearInterval(timerRef.current);
            const next = p.mode === "focus" ? "break" : "focus";
            const secs = next === "focus" ? p.focusLength * 60 : p.breakLength * 60;
            showNotif(next === "break" ? "Focus session done! Take a break 🎉" : "Break over! Back to focus 🚀");
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
  const completionPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

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

  // Wait until local storage JWT checks resolve
  if (authLoading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><span className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }}></span></div>;

  // Render Gatekeeper Auth Module if unauthenticated
  if (!isAuthenticated) {
    return (
      <>
        {notification && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 999,
            background: "var(--surface)", border: "1px solid var(--accent)",
            borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600,
            boxShadow: "var(--glow)", animation: "fadeUp .3s ease", color: "var(--text)",
          }}>{notification}</div>
        )}
        <Auth onLogin={handleLogin} />
      </>
    );
  }

  if (page === "onboard") return <Onboarding onComplete={(p) => { setProfile(p); generateSchedule(p); }} />;

  const pomMin = String(Math.floor(pomodoroState.seconds / 60)).padStart(2, "0");
  const pomSec = String(pomodoroState.seconds % 60).padStart(2, "0");

  const renderPage = () => {
    switch (activeNav) {
      case "dashboard": 
        return <Dashboard profile={profile || currentUser} now={now} completionPct={completionPct} completedCount={completedCount} totalCount={totalCount} burnout={burnout} productivity={productivity} DAYS={DAYS} analyzeBurnout={analyzeBurnout} aiLoading={aiLoading} />;
      case "schedule": 
        return <ScheduleUI schedule={schedule} scheduleLoading={scheduleLoading} toggleBlock={toggleBlock} setBurnout={setBurnout} profile={profile || currentUser} generateSchedule={generateSchedule} clamp={clamp} showNotif={showNotif} />;
      case "weekly": 
        return <Weekly weekSchedule={weekSchedule} aiLoading={aiLoading} generateWeekPlan={generateWeekPlan} />;
      case "pomodoro": 
        return <Pomodoro pomodoroState={pomodoroState} setPomodoroState={setPomodoroState} />;
      case "analytics": 
        return <Analytics completionPct={completionPct} />;
      case "assistant": 
        return <Assistant chatHistory={chatHistory} chatEndRef={chatEndRef} aiLoading={aiLoading} chatInput={chatInput} setChatInput={setChatInput} sendChat={sendChat} />;
      default: 
        return null;
    }
  };

  return (
    <>
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: "var(--surface)", border: "1px solid var(--accent)",
          borderRadius: 10, padding: "12px 18px", fontSize: 13, fontWeight: 600,
          boxShadow: "var(--glow)", animation: "fadeUp .3s ease", color: "var(--text)",
          maxWidth: 320,
        }}>{notification}</div>
      )}
      <div className="shell fade-in">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-dot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={16} /></div>
            <span>StudyFlow AI</span>
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
              <div style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {profile?.name || currentUser?.name || "User"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", margin: "4px 0 8px" }}>
                {profile?.goals?.slice(0, 2).join(" · ") || currentUser?.email || "Optimizer"}
              </div>
              <button 
                onClick={handleLogout}
                style={{ width: "100%", background: "rgba(255, 90, 30, 0.1)", color: "var(--warn)", border: "1px solid rgba(255, 90, 30, 0.2)", borderRadius: 4, padding: "4px", fontSize: 11, cursor: "pointer", transition: "all 0.2s" }}
              >
                Sign Out
              </button>
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
