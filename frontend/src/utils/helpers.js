export const API_URL = "https://api.anthropic.com/v1/messages";
export const MODEL = "claude-sonnet-4-20250514";

export async function callClaude(messages, system = "", maxTokens = 1000) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const fmtTime = (h, m = 0) => `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const SAMPLE_BLOCKS = [
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
