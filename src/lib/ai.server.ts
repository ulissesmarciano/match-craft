const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";

export const AI_RULES = `Regras invioláveis:
1. VERDADE: nunca invente experiência, tecnologia, certificação, formação, cargo, empresa, resultado ou competência que não esteja nos dados fornecidos pelo usuário.
2. EVIDÊNCIA: toda recomendação deve se basear no currículo fornecido ou na vaga analisada.
3. TRANSPARÊNCIA: quando uma skill não estiver presente, diga claramente que está ausente.
4. ATS: priorize relevância semântica e palavras-chave naturais, texto simples, títulos tradicionais.
5. SEM KEYWORD STUFFING: não repita palavras-chave artificialmente.
Responda SEMPRE em português do Brasil e SEMPRE com JSON válido, sem markdown.`;

export async function chatJson<T>(system: string, user: string): Promise<T> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI indisponível: chave ausente.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: `${system}\n\n${AI_RULES}` },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (res.status === 429) throw new Error("Limite de requisições atingido. Tente novamente em instantes.");
  if (res.status === 402) throw new Error("Créditos de IA esgotados. Adicione créditos ao workspace.");
  if (!res.ok) throw new Error(`Falha na análise (${res.status}).`);

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";
  return parseJson<T>(content);
}

function parseJson<T>(content: string): T {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1)) as T;
    throw new Error("Resposta da IA em formato inesperado.");
  }
}

export function clampScore(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}
