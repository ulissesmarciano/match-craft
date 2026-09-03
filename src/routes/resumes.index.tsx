import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Download, Eye, Files, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { ConfirmDialog, EmptyState } from "@/components/common";
import { formatDate } from "@/components/job-card";
import { MatchScoreBadge } from "@/components/match";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { exportResumePdf } from "@/lib/pdf";
import { deleteResume, duplicateResume, useAppState, useHydrated } from "@/lib/store";
import type { Resume } from "@/lib/types";

export const Route = createFileRoute("/resumes/")({
  head: () => ({
    meta: [
      { title: "Meus currículos — JobMatch" },
      { name: "description", content: "Gerencie versões de currículo criadas para cada vaga." },
      { property: "og:title", content: "Meus currículos — JobMatch" },
      { property: "og:description", content: "Versões ATS do seu currículo, uma para cada oportunidade." },
    ],
  }),
  component: ResumesPage,
});

function ResumesPage() {
  const state = useAppState();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [toDelete, setToDelete] = useState<string | null>(null);

  const tailored = state.resumes.filter((r) => !r.isBase);
  const base = state.resumes.find((r) => r.isBase);

  const exportPdf = (resume: Resume) => {
    try {
      exportResumePdf(resume);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível exportar o PDF.");
    }
  };

  const card = (resume: Resume) => (
    <Card key={resume.id} className="shadow-soft">
      <CardContent className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{resume.name}</h2>
            {resume.isBase ? <Badge variant="soft">Currículo principal</Badge> : null}
            {typeof resume.matchScore === "number" ? <MatchScoreBadge score={resume.matchScore} /> : null}
            {resume.demo ? <Badge variant="warning">Exemplo</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {resume.jobTitle ? `${resume.jobTitle} · ` : ""}
            {resume.company ? `${resume.company} · ` : ""}
            Criado em {formatDate(resume.createdAt)} · Atualizado em {formatDate(resume.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link
              to={resume.isBase ? "/resume" : "/resumes/$resumeId"}
              params={resume.isBase ? undefined : { resumeId: resume.id }}
            >
              <Pencil /> Editar
            </Link>
          </Button>
          {!resume.isBase ? (
            <Button size="sm" variant="outline" asChild>
              <Link to="/resumes/$resumeId" params={{ resumeId: resume.id }}>
                <Eye /> Visualizar
              </Link>
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const id = duplicateResume(resume.id);
              toast.success("Currículo duplicado.");
              if (id) void navigate({ to: "/resumes/$resumeId", params: { resumeId: id } });
            }}
          >
            <Copy /> Duplicar
          </Button>
          <Button size="sm" variant="outline" onClick={() => exportPdf(resume)}>
            <Download /> Exportar
          </Button>
          {!resume.isBase ? (
            <Button size="sm" variant="ghost" onClick={() => setToDelete(resume.id)}>
              <Trash2 /> Excluir
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell title="Meus currículos">
      <PageHeader
        title="Meus currículos"
        description="Uma versão para cada oportunidade, sempre baseada nas suas informações reais."
      />

      {!hydrated ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="space-y-4">
          {base ? card(base) : null}
          {tailored.length ? (
            tailored.map(card)
          ) : (
            <EmptyState
              icon={Files}
              title="Nenhum currículo personalizado ainda."
              description="Analise uma vaga e gere uma versão otimizada do seu currículo."
              action={
                <Button asChild>
                  <Link to="/jobs">Ver minhas vagas</Link>
                </Button>
              }
            />
          )}
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir currículo?"
        description="Esta versão do currículo será removida permanentemente."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          if (toDelete) deleteResume(toDelete);
          setToDelete(null);
          toast.success("Currículo excluído.");
        }}
      />
    </AppShell>
  );
}
