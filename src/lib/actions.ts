import { analyzeMatch, tailorResume } from "./ai.functions";
import { resumeToPlainText } from "./resume-utils";
import { now, saveMatch, saveResume, uid } from "./store";
import type { Job, MatchAnalysis, Resume, Skills } from "./types";

export async function runJobAnalysis(job: Job, resume: Resume): Promise<MatchAnalysis> {
  const payload = await analyzeMatch({
    data: {
      resumeText: resumeToPlainText(resume),
      jobTitle: job.title,
      company: job.company,
      jobDescription: job.description,
    },
  });
  const match: MatchAnalysis = {
    ...payload,
    id: uid(),
    jobId: job.id,
    createdAt: now(),
  };
  saveMatch(match);
  return match;
}

function reorder(original: string[], preferred: string[]): string[] {
  const set = new Set(original.map((s) => s.toLowerCase()));
  const head = preferred.filter((s) => set.has(s.toLowerCase()));
  const headSet = new Set(head.map((s) => s.toLowerCase()));
  const tail = original.filter((s) => !headSet.has(s.toLowerCase()));
  return [...original.filter((s) => headSet.has(s.toLowerCase())).sort(
    (a, b) =>
      head.findIndex((h) => h.toLowerCase() === a.toLowerCase()) -
      head.findIndex((h) => h.toLowerCase() === b.toLowerCase()),
  ), ...tail];
}

export async function createTailoredResume(
  job: Job,
  base: Resume,
  score?: number,
): Promise<Resume> {
  const tailored = await tailorResume({
    data: {
      resumeJson: JSON.stringify({
        personal: base.personal,
        summary: base.summary,
        experiences: base.experiences,
        education: base.education,
        skills: base.skills,
        certifications: base.certifications,
        projects: base.projects,
      }),
      jobTitle: job.title,
      company: job.company,
      jobDescription: job.description,
    },
  });

  const skills: Skills = {
    hard: reorder(base.skills.hard, tailored.skillsOrder.hard),
    tech: reorder(base.skills.tech, tailored.skillsOrder.tech),
    tools: reorder(base.skills.tools, tailored.skillsOrder.tools),
    soft: reorder(base.skills.soft, tailored.skillsOrder.soft),
    languages: reorder(base.skills.languages, tailored.skillsOrder.languages),
  };

  const experiences = base.experiences.map((exp) => {
    const patch = tailored.experiences.find((e) => e.id === exp.id);
    if (!patch) return exp;
    return {
      ...exp,
      description: patch.description || exp.description,
      responsibilities: patch.responsibilities || exp.responsibilities,
      achievements: patch.achievements || exp.achievements,
    };
  });

  const resume: Resume = {
    ...base,
    id: uid(),
    isBase: false,
    demo: false,
    name: `Currículo — ${job.title}${job.company ? " — " + job.company : ""}`,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    matchScore: score,
    summary: tailored.summary || base.summary,
    skills,
    experiences,
    createdAt: now(),
    updatedAt: now(),
  };

  saveResume(resume);
  return resume;
}
