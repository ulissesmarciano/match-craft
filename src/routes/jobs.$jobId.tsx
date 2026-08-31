import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, FileSignature, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, LoadingState } from "@/components/common";
import { formatDate } from "@/components/job-card";
import { KeywordLists, MatchBreakdown, MatchScore, RequirementList } from "@/components/match";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createTailoredResume, runJobAnalysis } from "@/lib/actions";
import { useAppState, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/jobs/$jobId")({
  head: () => ({
    meta: [
      { title: "Análise de Match — JobMatch" },
      { name: "description", content: "Veja o Match Score, requisitos atendidos e lacunas para esta vaga." },
      { property: "og:title", content: "Análise de Match — JobMatch" },
      { property: "og:description", content: "Compatibilidade detalhada entre seu currículo e a vaga." },
    ],
  }),
  component: JobDetailPage,
});

function JobDetailPage() {
  const { jobId } = useParams({ from: "/jobs/$jobId" });
  const state = useAppState();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);

  const job = state.jobs.find((j) => j.id === jobId);
  const match = state.matches.find((m) => m.jobId === jobId);
  const base = state.resumes.find((r) => r.isBase);

  if (!hydrated) {
    return (
      <AppShell title="Análise de Match">
        <Skeleton className="h-96 w-full rounded-xl" />
      </AppShell>
    );
  }

  if (!job) {
    return (
      <AppShell title="Análise de Match">
        <EmptyState
          icon={FileSignature}
          title="Vaga não encontrada"
          description="Ela pode ter sido removida. Volte para a lista e escolha outra vaga."
          action={
            <Button asChild>
              <Link to="/jobs">Ver minhas vagas</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const analyze = async () => {
    if (!base) {
      toast.info("Crie seu currículo-base antes de analisar.");
      void navigate({ to: "/resume" });
      return;
    }
    setAnalyzing(true);
    try {
      await runJobAnalysis(job, base);
      toast.success("Análise concluída.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir a análise. Tente novamente.");
    } finally {
      setAnalyzing(false);
    }
  };

  const generate = async () => {
    if (!base) return;
    setGenerating(true);
    const id = toast.loading("Criando seu currículo personalizado...");
    try {
      const resume = await createTailoredResume(job, base, match?.score);
      toast.success("Currículo personalizado criado.", { id });
      void navigate({ to: "/resumes/$resumeId", params: { resumeId: resume.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível gerar o currículo.", { id });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppShell title={job.title}>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/jobs">
          <ArrowLeft /> Minhas Vagas
        </Link>
      </Button>

      <PageHeader
        title={job.title}
        description={`${job.company || "Empresa não informada"} · ${job.location || "Local não informado"} · ${job.model} · Adicionada em ${formatDate(job.createdAt)}`}
        actions={
          <>
            <Button variant="outline" onClick={analyze} disabled={analyzing}>
              {analyzing ? <Loader2 className="animate-spin" /> : <RefreshCw />}
              {match ? "Reanalisar" : "Analisar vaga"}
            </Button>
            <Button onClick={generate} disabled={generating || !base}>
              {generating ? <Loader2 className="animate-spin" /> : <FileSignature />}
              Criar currículo para esta vaga
            </Button>
          </>
        }
      />

      {analyzing ? (
        <LoadingState message="Comparando seu perfil com os requisitos..." />
      ) : !match ? (
        <EmptyState
          icon={RefreshCw}
          title="Esta vaga ainda não foi analisada"
          description="Rode a análise para descobrir seu Match Score, requisitos atendidos e lacunas."
          action={<Button onClick={analyze}>Analisar vaga</Button>}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Card className="shadow-soft">
              <CardContent className="flex flex-col items-center gap-2 py-8">
                <MatchScore score={match.score} />
                <p className="text-center text-xs text-muted-foreground">
                  Estimativa de compatibilidade — não é garantia de contratação.
                </p>
              </CardContent>
            </Card>
            <MatchBreakdown breakdown={match.breakdown} />
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Por que este Match?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">{match.explanation}</p>
              {match.recommendations.length ? (
                <div className="space-y-2">
                  <p className="font-medium">Melhorias recomendadas</p>
                  {match.recommendations.map((rec, index) => (
                    <div key={index} className="rounded-lg bg-muted p-3">
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-muted-foreground">{rec.detail}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <p className="text-xs text-muted-foreground">Análise gerada em {formatDate(match.createdAt)}</p>
            </CardContent>
          </Card>

          <RequirementList requirements={match.requirements} />
          <KeywordLists found={match.keywordsFound} missing={match.keywordsMissing} />

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Descrição da vaga</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="mb-3">
                {job.status}
              </Badge>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{job.description}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
