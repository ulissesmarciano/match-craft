export type WorkModel = "Remoto" | "Híbrido" | "Presencial";

export type JobStatus = "Nova" | "Analisada" | "Candidatura enviada" | "Entrevista" | "Encerrada";

export interface Personal {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  responsibilities: string;
  achievements: string;
}

export interface Education {
  id: string;
  institution: string;
  course: string;
  degree: string;
  start: string;
  end: string;
  ongoing: boolean;
}

export interface Skills {
  hard: string[];
  soft: string[];
  tools: string[];
  tech: string[];
  languages: string[];
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  date: string;
  link: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string;
  link: string;
  github: string;
}

export interface Resume {
  id: string;
  name: string;
  isBase: boolean;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  matchScore?: number;
  demo?: boolean;
  personal: Personal;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  model: WorkModel;
  description: string;
  status: JobStatus;
  demo?: boolean;
  createdAt: string;
}

export type RequirementStatus = "found" | "partial" | "missing";

export interface Requirement {
  name: string;
  status: RequirementStatus;
  evidence?: string;
}

export interface MatchBreakdownData {
  skills: number;
  experience: number;
  education: number;
  keywords: number;
  requirements: number;
}

export interface MatchAnalysis {
  id: string;
  jobId: string;
  score: number;
  breakdown: MatchBreakdownData;
  requirements: Requirement[];
  keywordsFound: string[];
  keywordsMissing: string[];
  explanation: string;
  recommendations: { title: string; detail: string }[];
  createdAt: string;
}

export interface AtsCategory {
  name: string;
  score: number;
}

export interface AtsResult {
  score: number;
  categories: AtsCategory[];
  recommendations: { title: string; detail: string }[];
  createdAt: string;
}

export interface Preferences {
  theme: "light" | "dark";
  language: "pt-BR" | "en-US";
  resumeFontSize: "compacto" | "padrão" | "amplo";
  includeProjects: boolean;
  includeCertifications: boolean;
}

export interface AppState {
  onboarded: boolean;
  demoActive: boolean;
  resumes: Resume[];
  jobs: Job[];
  matches: MatchAnalysis[];
  ats: Record<string, AtsResult>;
  preferences: Preferences;
}
