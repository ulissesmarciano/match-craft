import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/common";
import { ResumeWorkspace } from "@/components/resume-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { emptyResume } from "@/lib/resume-utils";
import { saveResume, useAppState, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Meu Currículo — JobMatch" },
      { name: "description", content: "Crie e mantenha seu currículo-base com verificação ATS integrada." },
      { property: "og:title", content: "Meu Currículo — JobMatch" },
      { property: "og:description", content: "Editor de currículo com preview ATS em tempo real." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const state = useAppState();
  const hydrated = useHydrated();
  const base = state.resumes.find((r) => r.isBase);

  const create = () => {
    saveResume(emptyResume());
    toast.success("Currículo-base criado. Preencha suas informações.");
  };

  return (
    <AppShell title="Meu Currículo">
      <PageHeader
        title="Meu Currículo"
        description="Este é o seu currículo principal — a base de todas as versões personalizadas."
        actions={base?.demo ? <Badge variant="warning">Dados de exemplo</Badge> : undefined}
      />

      {!hydrated ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : base ? (
        <ResumeWorkspace resume={base} />
      ) : (
        <EmptyState
          icon={FileText}
          title="Crie seu currículo-base"
          description="Comece adicionando suas experiências, habilidades e formação."
          action={<Button onClick={create}>Criar currículo</Button>}
        />
      )}
    </AppShell>
  );
}
