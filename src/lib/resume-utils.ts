import type { Resume } from "./types";
import { uid, now } from "./store";

export function emptyResume(partial?: Partial<Resume>): Resume {
  return {
    id: uid(),
    name: "Currículo principal",
    isBase: true,
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      linkedin: "",
      github: "",
      portfolio: "",
      website: "",
    },
    summary: "",
    experiences: [],
    education: [],
    skills: { hard: [], soft: [], tools: [], tech: [], languages: [] },
    certifications: [],
    projects: [],
    createdAt: now(),
    updatedAt: now(),
    ...partial,
  };
}

export function resumeToPlainText(resume: Resume): string {
  const p = resume.personal;
  const lines: string[] = [];
  lines.push(p.fullName, p.headline);
  lines.push([p.email, p.phone, [p.city, p.state].filter(Boolean).join("/")].filter(Boolean).join(" | "));
  lines.push([p.linkedin, p.github, p.portfolio, p.website].filter(Boolean).join(" | "));
  if (resume.summary) lines.push("\nRESUMO PROFISSIONAL\n" + resume.summary);
  if (resume.experiences.length) {
    lines.push("\nEXPERIÊNCIA PROFISSIONAL");
    resume.experiences.forEach((e) => {
      lines.push(
        `${e.role} — ${e.company} (${e.location}) | ${e.start} - ${e.current ? "Atual" : e.end}`,
      );
      if (e.description) lines.push(e.description);
      if (e.responsibilities) lines.push(e.responsibilities);
      if (e.achievements) lines.push(e.achievements);
    });
  }
  if (resume.education.length) {
    lines.push("\nFORMAÇÃO ACADÊMICA");
    resume.education.forEach((e) =>
      lines.push(`${e.degree} em ${e.course} — ${e.institution} | ${e.start} - ${e.ongoing ? "Em andamento" : e.end}`),
    );
  }
  const s = resume.skills;
  lines.push("\nSKILLS");
  lines.push(`Hard skills: ${s.hard.join(", ")}`);
  lines.push(`Tecnologias: ${s.tech.join(", ")}`);
  lines.push(`Ferramentas: ${s.tools.join(", ")}`);
  lines.push(`Soft skills: ${s.soft.join(", ")}`);
  lines.push(`Idiomas: ${s.languages.join(", ")}`);
  if (resume.certifications.length) {
    lines.push("\nCERTIFICAÇÕES");
    resume.certifications.forEach((c) => lines.push(`${c.name} — ${c.institution} (${c.date})`));
  }
  if (resume.projects.length) {
    lines.push("\nPROJETOS");
    resume.projects.forEach((pr) => lines.push(`${pr.name}: ${pr.description} [${pr.tech}]`));
  }
  return lines.filter(Boolean).join("\n");
}

export function resumeIsEmpty(resume?: Resume | null) {
  if (!resume) return true;
  return (
    !resume.personal.fullName &&
    !resume.summary &&
    resume.experiences.length === 0 &&
    resume.skills.hard.length === 0
  );
}

export function scoreLabel(score: number) {
  if (score >= 90) return "Excelente compatibilidade";
  if (score >= 75) return "Boa compatibilidade";
  if (score >= 60) return "Compatibilidade moderada";
  return "Baixa compatibilidade";
}

export function scoreTone(score: number): "success" | "primary" | "warning" | "destructive" {
  if (score >= 90) return "success";
  if (score >= 75) return "primary";
  if (score >= 60) return "warning";
  return "destructive";
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
