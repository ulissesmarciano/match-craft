import { createFileRoute, Link } from "@tanstack/react-router";
import { Target } from "lucide-react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/common";
import { formatDate } from "@/components/job-card";
import { MatchScoreBadge } from "@/components/match";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { scoreLabel } from "@/lib/resume-utils";
import { useAppState, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Matches — JobMatch" },
      { name: "description", content: "Compare o resultado das suas análises de compatibilidade com vagas." },
      { property: "og:title", content: "Matches — JobMatch" },
      { property: "og:description", content: "Histórico de análises de compatibilidade currículo x vaga." },
    ],
  }),
  component: MatchesPage,
});

function MatchesPage() {
  const state = useAppState();
  const hydrated = useHydrated();

  const rows = state.matches
    .map((match) => ({ match, job: state.jobs.find((j) => j.id === match.jobId) }))
    .filter((row) => row.job)
    .sort((a, b) => b.match.score - a.match.score);

  return (
    <AppShell title="Matches">
      <PageHeader
        title="Matches"
        description="Todas as análises realizadas, ordenadas pela maior compatibilidade."
      />

      {!hydrated ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhuma análise ainda"
          description="Adicione uma vaga e rode a análise para ver seu Match Score aqui."
          action={
            <Button asChild>
              <Link to="/jobs">Ir para minhas vagas</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {rows.map(({ match, job }) => (
            <Card key={match.id} className="shadow-soft">
              <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate font-semibold">{job!.title}</h2>
                    <MatchScoreBadge score={match.score} />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {job!.company || "—"} · {scoreLabel(match.score)} · {formatDate(match.createdAt)}
                  </p>
                  <Progress value={match.score} className="mt-3" aria-label={`Match de ${job!.title}`} />
                </div>
                <Button asChild variant="outline">
                  <Link to="/jobs/$jobId" params={{ jobId: job!.id }}>
                    Ver análise
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
