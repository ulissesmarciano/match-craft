import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BriefcaseBusiness, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { ConfirmDialog, EmptyState } from "@/components/common";
import { JobCard, formatDate } from "@/components/job-card";
import { JobFormDialog } from "@/components/job-form";
import { MatchScoreBadge } from "@/components/match";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { runJobAnalysis } from "@/lib/actions";
import { deleteJob, saveJob, useAppState, useHydrated } from "@/lib/store";
import type { Job, JobStatus } from "@/lib/types";

const STATUSES: JobStatus[] = ["Nova", "Analisada", "Candidatura enviada", "Entrevista", "Encerrada"];

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Minhas Vagas — JobMatch" },
      { name: "description", content: "Gerencie as vagas adicionadas, status de candidatura e match de cada uma." },
      { property: "og:title", content: "Minhas Vagas — JobMatch" },
      { property: "og:description", content: "Organize vagas e acompanhe a compatibilidade do seu perfil." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const state = useAppState();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [toDelete, setToDelete] = useState<string | null>(null);

  const base = state.resumes.find((r) => r.isBase);
  const scores = new Map(state.matches.map((m) => [m.jobId, m.score]));

  const handleNewJob = async (job: Job) => {
    saveJob(job);
    toast.success("Vaga adicionada.");
    if (!base) {
      toast.info("Crie seu currículo-base para analisar esta vaga.");
      void navigate({ to: "/resume" });
      return;
    }
    const id = toast.loading("Analisando a vaga...");
    try {
      await runJobAnalysis(job, base);
      toast.success("Análise concluída.", { id });
      void navigate({ to: "/jobs/$jobId", params: { jobId: job.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir a análise.", { id });
    }
  };

  const addButton = (
    <JobFormDialog
      onSubmit={handleNewJob}
      trigger={
        <Button>
          <Plus /> Adicionar vaga
        </Button>
      }
    />
  );

  return (
    <AppShell title="Minhas Vagas">
      <PageHeader
        title="Minhas Vagas"
        description="Todas as vagas que você adicionou, com status e compatibilidade."
        actions={addButton}
      />

      {!hydrated ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : state.jobs.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="Você ainda não adicionou nenhuma vaga."
          description="Adicione uma vaga para descobrir quanto seu perfil combina com ela."
          action={addButton}
        />
      ) : (
        <>
          <Card className="hidden overflow-hidden shadow-soft md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Adicionada</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <Link to="/jobs/$jobId" params={{ jobId: job.id }} className="hover:underline">
                        {job.title}
                      </Link>
                    </TableCell>
                    <TableCell>{job.company || "—"}</TableCell>
                    <TableCell>{job.location || "—"}</TableCell>
                    <TableCell>{job.model}</TableCell>
                    <TableCell>{formatDate(job.createdAt)}</TableCell>
                    <TableCell>
                      {scores.has(job.id) ? (
                        <MatchScoreBadge score={scores.get(job.id)!} />
                      ) : (
                        <Badge variant="muted">—</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={job.status}
                        onValueChange={(value) => saveJob({ ...job, status: value as JobStatus })}
                      >
                        <SelectTrigger className="h-8 w-[168px]" aria-label={`Status da vaga ${job.title}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Excluir vaga ${job.title}`}
                        onClick={() => setToDelete(job.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 md:hidden">
            {state.jobs.map((job) => (
              <JobCard key={job.id} job={job} score={scores.get(job.id)} />
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir vaga?"
        description="A vaga e a análise de match associada serão removidas permanentemente."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          if (toDelete) deleteJob(toDelete);
          setToDelete(null);
          toast.success("Vaga excluída.");
        }}
      />
    </AppShell>
  );
}
