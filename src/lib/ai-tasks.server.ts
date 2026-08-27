import { chatJson, clampScore } from "./ai.server";
import { heuristicMatch } from "./heuristic-match";
import type { AtsResult, MatchAnalysis, Requirement } from "./types";

type MatchPayload = Omit<MatchAnalysis, "id" | "jobId" | "createdAt">;

export async function analyzeMatchTask(input: {
  resumeText: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
}): Promise<MatchPayload> {
  const system = `Você é um especialista em recrutamento técnico e sistemas ATS.
Compare o currículo do candidato com a descrição da vaga e produza uma análise honesta.
Pesos do Match Score: skills técnicas 30%, experiência 25%, palavras-chave 20%, requisitos da vaga 15%, formação/certificações 10%.
Classifique cada requisito como "found" (evidência clara no currículo), "partial" (relacionado, mas pouco evidenciado) ou "missing" (ausente).
Formato JSON exato:
{"score":number,"breakdown":{"skills":number,"experience":number,"education":number,"keywords":number,"requirements":number},"requirements":[{"name":string,"status":"found"|"partial"|"missing","evidence":string}],"keywordsFound":[string],"keywordsMissing":[string],"explanation":string,"recommendations":[{"title":string,"detail":string}]}`;

  const user = `VAGA: ${input.jobTitle} — ${input.company}
DESCRIÇÃO DA VAGA:
${input.jobDescription}

CURRÍCULO DO CANDIDATO:
${input.resumeText}`;

  try {
    const raw = await chatJson<Partial<MatchPayload>>(system, user);
    const requirements: Requirement[] = Array.isArray(raw.requirements)
      ? raw.requirements
          .filter((r) => r && typeof r.name === "string")
          .map((r) => ({
            name: r.name,
            status: (["found", "partial", "missing"] as const).includes(r.status)
              ? r.status
              : "missing",
            evidence: typeof r.evidence === "string" ? r.evidence : undefined,
          }))
      : [];
    return {
      score: clampScore(raw.score),
      breakdown: {
        skills: clampScore(raw.breakdown?.skills),
        experience: clampScore(raw.breakdown?.experience),
        education: clampScore(raw.breakdown?.education),
        keywords: clampScore(raw.breakdown?.keywords),
        requirements: clampScore(raw.breakdown?.requirements),
      },
      requirements,
      keywordsFound: (raw.keywordsFound ?? []).filter((k): k is string => typeof k === "string"),
      keywordsMissing: (raw.keywordsMissing ?? []).filter((k): k is string => typeof k === "string"),
      explanation: raw.explanation ?? "",
      recommendations: (raw.recommendations ?? []).filter((r) => r && r.title),
    };
  } catch {
    return heuristicMatch(input.resumeText, input.jobDescription);
  }
}

export async function atsCheckTask(resumeText: string): Promise<Omit<AtsResult, "createdAt">> {
  const system = `Você é um auditor de currículos para sistemas ATS.
Avalie o currículo em 8 categorias: Estrutura, Palavras-chave, Clareza, Experiência, Skills, Formatação, Seções, Legibilidade (0 a 100 cada).
Dê uma nota geral de 0 a 100 e recomendações práticas e específicas.
Formato JSON exato:
{"score":number,"categories":[{"name":string,"score":number}],"recommendations":[{"title":string,"detail":string}]}`;

  try {
    const raw = await chatJson<Partial<AtsResult>>(system, `CURRÍCULO:\n${resumeText}`);
    const categories = (raw.categories ?? [])
      .filter((c) => c && typeof c.name === "string")
      .map((c) => ({ name: c.name, score: clampScore(c.score) }));
    return {
      score: clampScore(raw.score),
      categories: categories.length ? categories : fallbackCategories(resumeText),
      recommendations: (raw.recommendations ?? []).filter((r) => r && r.title),
    };
  } catch {
    const categories = fallbackCategories(resumeText);
    return {
      score: Math.round(categories.reduce((a, c) => a + c.score, 0) / categories.length),
      categories,
      recommendations: [
        {
          title: "Adicione resultados mensuráveis",
          detail: "Inclua números e impacto nas suas experiências para reforçar credibilidade.",
        },
        {
          title: "Reforce palavras-chave",
          detail: "Use os termos técnicos das vagas desejadas de forma natural no resumo e nas experiências.",
        },
      ],
    };
  }
}

function fallbackCategories(text: string) {
  const len = text.length;
  const base = Math.min(95, 45 + Math.round(len / 60));
  const has = (re: RegExp) => (re.test(text) ? 12 : -10);
  const cap = (n: number) => Math.max(20, Math.min(98, n));
  return [
    { name: "Estrutura", score: cap(base + has(/EXPERIÊNCIA/i)) },
    { name: "Palavras-chave", score: cap(base - 5) },
    { name: "Clareza", score: cap(base) },
    { name: "Experiência", score: cap(base + has(/\d{4}/)) },
    { name: "Skills", score: cap(base + has(/SKILLS/i)) },
    { name: "Formatação", score: cap(base + 8) },
    { name: "Seções", score: cap(base + has(/FORMAÇÃO/i)) },
    { name: "Legibilidade", score: cap(base + 4) },
  ];
}

export async function improveSummaryTask(input: {
  summary: string;
  resumeText: string;
  targetRole: string;
}): Promise<{ summary: string }> {
  const system = `Você reescreve resumos profissionais de currículo em português do Brasil.
Melhore clareza, objetividade e impacto usando APENAS informações já presentes no currículo.
Máximo de 4 frases, sem bullet, sem exageros, sem inventar dados.
Formato JSON exato: {"summary": string}`;

  const raw = await chatJson<{ summary?: string }>(
    system,
    `CARGO DESEJADO: ${input.targetRole}\nRESUMO ATUAL: ${input.summary || "(vazio)"}\n\nCURRÍCULO COMPLETO:\n${input.resumeText}`,
  );
  return { summary: (raw.summary ?? input.summary).trim() };
}

export interface TailoredResume {
  summary: string;
  skillsOrder: { hard: string[]; tech: string[]; tools: string[]; soft: string[]; languages: string[] };
  experiences: { id: string; description: string; responsibilities: string; achievements: string }[];
  notes: string;
}

export async function tailorResumeTask(input: {
  resumeJson: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
}): Promise<TailoredResume> {
  const system = `Você adapta currículos para uma vaga específica, mantendo ATS-friendly.
Você pode reorganizar, resumir, reescrever, destacar e adaptar palavras-chave quando semanticamente verdadeiras.
NUNCA adicione skills, empresas, cargos, datas, certificações ou resultados que não existam no currículo original.
Mantenha os mesmos ids de experiência recebidos. Bullets objetivos, uma linha por bullet iniciando com "- ".
Ordene as skills existentes por relevância para a vaga (não crie novas).
Formato JSON exato:
{"summary":string,"skillsOrder":{"hard":[string],"tech":[string],"tools":[string],"soft":[string],"languages":[string]},"experiences":[{"id":string,"description":string,"responsibilities":string,"achievements":string}],"notes":string}`;

  const user = `VAGA: ${input.jobTitle} — ${input.company}
DESCRIÇÃO:
${input.jobDescription}

CURRÍCULO (JSON):
${input.resumeJson}`;

  const raw = await chatJson<Partial<TailoredResume>>(system, user);
  return {
    summary: raw.summary ?? "",
    skillsOrder: {
      hard: raw.skillsOrder?.hard ?? [],
      tech: raw.skillsOrder?.tech ?? [],
      tools: raw.skillsOrder?.tools ?? [],
      soft: raw.skillsOrder?.soft ?? [],
      languages: raw.skillsOrder?.languages ?? [],
    },
    experiences: (raw.experiences ?? []).filter((e) => e && typeof e.id === "string"),
    notes: raw.notes ?? "",
  };
}
