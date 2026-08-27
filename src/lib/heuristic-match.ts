import type { MatchAnalysis, Requirement } from "./types";

const STOP = new Set(
  `a o e de da do das dos para com em no na nos nas um uma que se por como the and for with você sua seu nossa nosso será são ser ter tem mais menos sobre entre pelo pela anos ano experiência vaga empresa time equipe conhecimento conhecimentos desejável requisitos atividades`.split(
    /\s+/,
  ),
);

function tokens(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9+#.]+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

export function heuristicMatch(
  resumeText: string,
  jobDescription: string,
): Omit<MatchAnalysis, "id" | "jobId" | "createdAt"> {
  const resumeTokens = new Set(tokens(resumeText));
  const counts = new Map<string, number>();
  tokens(jobDescription).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1));

  const keywords = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([k]) => k);

  const keywordsFound = keywords.filter((k) => resumeTokens.has(k));
  const keywordsMissing = keywords.filter((k) => !resumeTokens.has(k));

  const ratio = keywords.length ? keywordsFound.length / keywords.length : 0;
  const base = Math.round(35 + ratio * 60);

  const requirements: Requirement[] = keywords.slice(0, 12).map((k) => ({
    name: k,
    status: resumeTokens.has(k) ? "found" : "missing",
    evidence: resumeTokens.has(k) ? "Termo localizado no currículo." : "Termo não localizado no currículo.",
  }));

  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  return {
    score: clamp(base),
    breakdown: {
      skills: clamp(base + 3),
      experience: clamp(base - 4),
      education: clamp(base - 2),
      keywords: clamp(ratio * 100),
      requirements: clamp(base),
    },
    requirements,
    keywordsFound,
    keywordsMissing,
    explanation:
      "Análise offline baseada na sobreposição de termos entre o currículo e a descrição da vaga. Os termos ausentes são oportunidades de evidenciar experiências reais que você já possui.",
    recommendations: [
      {
        title: "Evidencie os termos ausentes",
        detail: `Se você já trabalhou com ${keywordsMissing.slice(0, 4).join(", ") || "os requisitos da vaga"}, torne isso explícito nas suas experiências.`,
      },
    ],
  };
}
