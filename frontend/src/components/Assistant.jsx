import React from 'react';

export default function Assistant({ chatHistory, chatEndRef, aiLoading, chatInput, setChatInput, sendChat }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>AI Assistant</h1>
        <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>Ask me to plan your day, analyze patterns, or optimize your schedule</p>
      </div>
      <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: 0 }}>
        <div className="chat-messages">
          {chatHistory.map((m, i) => (
            <div key={i} className={`chat-bubble chat-${m.role === "user" ? "user" : "ai"}`}>
              {m.role === "assistant" && <div style={{ fontSize: 11, color: "var(--accent)", marginBottom: 4, fontWeight: 700 }}>\u2726 AI OPTIMIZER</div>}
              <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
            </div>
          ))}
          {aiLoading && (
            <div className="chat-bubble chat-ai">
              <div style={{ fontSize: 11, color: "var(--accent)", marginBottom: 4, fontWeight: 700 }}>\u2726 AI OPTIMIZER</div>
              <span className="dot-pulse">Thinking</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input-area">
          <input className="input" placeholder='Try: "Plan my day", "I missed my gym session", "Analyze my burnout"\u2026'
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
}
