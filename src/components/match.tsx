import { CheckCircle2, CircleSlash, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { scoreLabel } from "@/lib/resume-utils";
import type { MatchBreakdownData, Requirement } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MatchScore({ score, size = 160 }: { score: number; size?: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`Match score de ${score} por cento`}
      >
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={radius} className="fill-none stroke-muted" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="fill-none stroke-primary transition-[stroke-dashoffset] duration-700"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tracking-tight">{score}%</span>
          <span className="text-[11px] text-muted-foreground">Match Score</span>
        </div>
      </div>
      <p className="text-sm font-medium">{scoreLabel(score)}</p>
    </div>
  );
}

export function MatchScoreBadge({ score }: { score: number }) {
  const variant = score >= 90 ? "success" : score >= 75 ? "soft" : score >= 60 ? "warning" : "muted";
  return <Badge variant={variant}>{score}% match</Badge>;
}

const LABELS: Record<keyof MatchBreakdownData, string> = {
  skills: "Skills técnicas",
  experience: "Experiência",
  education: "Formação",
  keywords: "Palavras-chave",
  requirements: "Requisitos gerais",
};

export function MatchBreakdown({ breakdown }: { breakdown: MatchBreakdownData }) {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">Match por categoria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(Object.keys(LABELS) as (keyof MatchBreakdownData)[]).map((key) => (
          <div key={key}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{LABELS[key]}</span>
              <span className="font-medium">{breakdown[key]}%</span>
            </div>
            <Progress value={breakdown[key]} aria-label={LABELS[key]} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RequirementList({ requirements }: { requirements: Requirement[] }) {
  const found = requirements.filter((r) => r.status === "found");
  const partial = requirements.filter((r) => r.status === "partial");
  const missing = requirements.filter((r) => r.status === "missing");

  const group = (
    title: string,
    items: Requirement[],
    tone: "found" | "partial" | "missing",
    empty: string,
  ) => {
    const Icon = tone === "found" ? CheckCircle2 : tone === "partial" ? TriangleAlert : CircleSlash;
    return (
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">{empty}</p>
          ) : (
            <ul className="space-y-2.5">
              {items.map((r) => (
                <li key={r.name} className="flex gap-2.5 text-sm">
                  <Icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      tone === "found" && "text-success",
                      tone === "partial" && "text-warning",
                      tone === "missing" && "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium">{r.name}</span>
                    {r.evidence ? (
                      <span className="block text-xs text-muted-foreground">{r.evidence}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {group("Você atende", found, "found", "Nenhum requisito plenamente atendido foi identificado.")}
      {group(
        "Precisa ser evidenciado",
        partial,
        "partial",
        "Nenhum requisito parcialmente atendido.",
      )}
      {group("Não encontrado", missing, "missing", "Nenhum requisito ausente. Ótimo sinal!")}
    </div>
  );
}

export function KeywordLists({ found, missing }: { found: string[]; missing: string[] }) {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="text-base">Palavras-chave da vaga</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Encontradas no currículo</p>
          <div className="flex flex-wrap gap-1.5">
            {found.length ? (
              found.map((k) => (
                <Badge key={k} variant="success">
                  {k}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma palavra-chave encontrada.</p>
            )}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Ausentes do currículo</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.length ? (
              missing.map((k) => (
                <Badge key={k} variant="warning">
                  {k}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma palavra-chave ausente.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
