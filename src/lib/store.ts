import { useSyncExternalStore } from "react";
import type {
  AppState,
  AtsResult,
  Job,
  MatchAnalysis,
  Preferences,
  Resume,
} from "./types";

const KEY = "jobmatch:v1";

export const defaultPreferences: Preferences = {
  theme: "light",
  language: "pt-BR",
  resumeFontSize: "padrão",
  includeProjects: true,
  includeCertifications: true,
};

export const emptyState: AppState = {
  onboarded: false,
  demoActive: false,
  resumes: [],
  jobs: [],
  matches: [],
  ats: {},
  preferences: defaultPreferences,
};

let state: AppState = emptyState;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

export function hydrateStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      state = {
        ...emptyState,
        ...parsed,
        preferences: { ...defaultPreferences, ...(parsed.preferences ?? {}) },
      };
    }
  } catch {
    state = emptyState;
  }
  emit();
}

export function setState(updater: (prev: AppState) => AppState) {
  state = updater(state);
  persist();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => emptyState;

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false,
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const now = () => new Date().toISOString();

/* ---------------- actions ---------------- */

export function saveResume(resume: Resume) {
  setState((s) => {
    const exists = s.resumes.some((r) => r.id === resume.id);
    const next = { ...resume, updatedAt: now() };
    return {
      ...s,
      resumes: exists
        ? s.resumes.map((r) => (r.id === resume.id ? next : r))
        : [...s.resumes, next],
    };
  });
}

export function deleteResume(id: string) {
  setState((s) => ({ ...s, resumes: s.resumes.filter((r) => r.id !== id) }));
}

export function duplicateResume(id: string) {
  let newId = "";
  setState((s) => {
    const src = s.resumes.find((r) => r.id === id);
    if (!src) return s;
    newId = uid();
    const copy: Resume = {
      ...src,
      id: newId,
      isBase: false,
      name: `${src.name} (cópia)`,
      createdAt: now(),
      updatedAt: now(),
    };
    return { ...s, resumes: [...s.resumes, copy] };
  });
  return newId;
}

export function saveJob(job: Job) {
  setState((s) => {
    const exists = s.jobs.some((j) => j.id === job.id);
    return {
      ...s,
      jobs: exists ? s.jobs.map((j) => (j.id === job.id ? job : j)) : [job, ...s.jobs],
    };
  });
}

export function deleteJob(id: string) {
  setState((s) => ({
    ...s,
    jobs: s.jobs.filter((j) => j.id !== id),
    matches: s.matches.filter((m) => m.jobId !== id),
  }));
}

export function saveMatch(match: MatchAnalysis) {
  setState((s) => ({
    ...s,
    matches: [match, ...s.matches.filter((m) => m.jobId !== match.jobId)],
    jobs: s.jobs.map((j) => (j.id === match.jobId && j.status === "Nova" ? { ...j, status: "Analisada" } : j)),
  }));
}

export function saveAts(resumeId: string, result: AtsResult) {
  setState((s) => ({ ...s, ats: { ...s.ats, [resumeId]: result } }));
}

export function setPreferences(prefs: Partial<Preferences>) {
  setState((s) => ({ ...s, preferences: { ...s.preferences, ...prefs } }));
}

export function setOnboarded(value: boolean) {
  setState((s) => ({ ...s, onboarded: value }));
}

export function clearAllData() {
  setState(() => ({ ...emptyState, onboarded: true }));
}

export function loadDemo(data: { resumes: Resume[]; jobs: Job[]; matches: MatchAnalysis[] }) {
  setState((s) => ({
    ...s,
    onboarded: true,
    demoActive: true,
    resumes: [...data.resumes, ...s.resumes.filter((r) => !r.demo)],
    jobs: [...data.jobs, ...s.jobs.filter((j) => !j.demo)],
    matches: [...data.matches, ...s.matches],
  }));
}

export function removeDemo() {
  setState((s) => {
    const demoJobIds = s.jobs.filter((j) => j.demo).map((j) => j.id);
    return {
      ...s,
      demoActive: false,
      resumes: s.resumes.filter((r) => !r.demo),
      jobs: s.jobs.filter((j) => !j.demo),
      matches: s.matches.filter((m) => !demoJobIds.includes(m.jobId)),
    };
  });
}

export function exportData(state: AppState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jobmatch-dados.json";
  a.click();
  URL.revokeObjectURL(url);
}
