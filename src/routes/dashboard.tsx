import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  FilePlus2,
  Files,
  Gauge,
  Plus,
  ScanSearch,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState, StatCard } from "@/components/common";
import { JobCard } from "@/components/job-card";
import { JobFormDialog } from "@/components/job-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { runJobAnalysis } from "@/lib/actions";
import { saveJob, useAppState, useHydrated } from "@/lib/store";
import type { Job } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — JobMatch" },
      { name: "description", content: "Acompanhe vagas analisadas, match médio e currículos personalizados." },
      { property: "og:title", content: "Dashboard — JobMatch" },
      { property: "og:description", content: "Sua central de matches e currículos otimizados para ATS." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const state = useAppState();
  const hydrated = useHydrated();
  const navigate = useNavigate();

  const base = state.resumes.find((r) => r.isBase);
  const matchesByJob = new Map(state.matches.map((m) => [m.jobId, m]));
  const analyzed = state.matches.length;
  const bestMatch = state.matches.reduce((max, m) => Math.max(max, m.score), 0);
  const tailored = state.resumes.filter((r) => !r.isBase).length;
  const average = analyzed
    ? Math.round(state.matches.reduce((sum, m) => sum + m.score, 0) / analyzed)
    : 0;

  const topJobs = [...state.jobs]
    .sort((a, b) => (matchesByJob.get(b.id)?.score ?? -1) - (matchesByJob.get(a.id)?.score ?? -1))
    .slice(0, 3);

  const handleNewJob = async (job: Job) => {
    saveJob(job);
    toast.success("Vaga adicionada.");
    if (!base) {
      toast.info("Crie seu currículo-base para analisar esta vaga.");
      void navigate({ to: "/resume" });
      return;
    }
    const analysis = toast.loading("Analisando a vaga...");
    try {
      await runJobAnalysis(job, base);
      toast.success("Análise concluída.", { id: analysis });
      void navigate({ to: "/jobs/$jobId", params: { jobId: job.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir a análise.", {
        id: analysis,
      });
    }
  };

  const quickActions = [
    { label: "Criar meu currículo", icon: FilePlus2, to: "/resume" as const },
    { label: "Analisar uma vaga", icon: ScanSearch, to: "/jobs" as const },
    { label: "Currículos personalizados", icon: Files, to: "/resumes" as const },
  ];

  return (
    <AppShell title="Dashboard">
      <PageHeader
        title="Olá! Vamos encontrar sua próxima oportunidade."
        description="Compare seu perfil com vagas e crie currículos preparados para ATS."
        actions={
          <JobFormDialog
            onSubmit={handleNewJob}
            trigger={
              <Button>
                <Plus /> Adicionar vaga
              </Button>
            }
          />
        }
      />

      {!hydrated ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Vagas analisadas" value={String(analyzed)} icon={BriefcaseBusiness} />
            <StatCard label="Melhor Match" value={`${bestMatch}%`} icon={Trophy} />
            <StatCard label="Currículos personalizados" value={String(tailored)} icon={Files} />
            <StatCard label="Match médio" value={`${average}%`} icon={Gauge} />
          </div>

          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Melhores oportunidades</h2>
            {topJobs.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topJobs.map((job) => (
                  <JobCard key={job.id} job={job} score={matchesByJob.get(job.id)?.score} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BriefcaseBusiness}
                title="Você ainda não adicionou nenhuma vaga."
                description="Adicione uma vaga para descobrir quanto seu perfil combina com ela."
                action={
                  <JobFormDialog
                    onSubmit={handleNewJob}
                    trigger={
                      <Button>
                        <Plus /> Adicionar vaga
                      </Button>
                    }
                  />
                }
              />
            )}
          </section>

          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Ações rápidas</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {quickActions.map((action) => (
                <Card key={action.label} className="shadow-soft transition-shadow hover:shadow-lift">
                  <CardContent className="pt-6">
                    <Link to={action.to} className="flex items-center gap-3 text-sm font-medium">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <action.icon className="size-5" aria-hidden />
                      </span>
                      {action.label}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
