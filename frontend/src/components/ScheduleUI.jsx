import React from 'react';
import { fmtTime } from '../utils/helpers';
import { RefreshCw, Sparkles } from 'lucide-react';

export default function ScheduleUI({ schedule, scheduleLoading, toggleBlock, setBurnout, profile, generateSchedule, clamp, showNotif }) {
  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Today's Schedule</h1>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Click tasks to mark complete \u2022 Drag to reschedule</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { setBurnout(b => clamp(b + 5, 0, 100)); showNotif("Schedule adjusted \u2014 lighter version applied"); }}>
            <RefreshCw size={14} /> Reschedule
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => profile && generateSchedule(profile)} disabled={scheduleLoading}>
            {scheduleLoading ? <><span className="spinner" /> Generating\u2026</> : <><Sparkles size={14} /> AI Regenerate</>}
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
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {b.type !== "sleep" && (
                      <div className="checkbox-wrapper" onClick={(e) => { e.stopPropagation(); toggleBlock(b.id); }}>
                        <input type="checkbox" checked={b.done} onChange={() => {}} style={{ width: 18, height: 18, cursor: "pointer", accentColor: "var(--accent)", pointerEvents: "none" }} />
                      </div>
                    )}
                    <div>
                      <div className="block-title">{b.title}</div>
                      <div className="block-meta">{b.duration} min \u00B7 {b.type}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    {b.type === "dsa" && <span className="tag tag-info" style={{ fontSize: 11, padding: "3px 8px" }}>DSA</span>}
                    {b.type === "gym" && <span className="tag tag-active" style={{ fontSize: 11, padding: "3px 8px" }}>Fitness</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
