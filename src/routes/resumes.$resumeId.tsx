import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Files } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/common";
import { MatchScoreBadge } from "@/components/match";
import { ResumeWorkspace } from "@/components/resume-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { duplicateResume, useAppState, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/resumes/$resumeId")({
  head: () => ({
    meta: [
      { title: "Editor de currículo — JobMatch" },
      { name: "description", content: "Edite, pré-visualize e exporte sua versão de currículo otimizada para ATS." },
      { property: "og:title", content: "Editor de currículo — JobMatch" },
      { property: "og:description", content: "Editor com preview ATS em tempo real e exportação em PDF." },
    ],
  }),
  component: ResumeDetailPage,
});

function ResumeDetailPage() {
  const { resumeId } = useParams({ from: "/resumes/$resumeId" });
  const state = useAppState();
  const hydrated = useHydrated();
  const navigate = useNavigate();

  const resume = state.resumes.find((r) => r.id === resumeId);

  if (!hydrated) {
    return (
      <AppShell title="Currículo">
        <Skeleton className="h-96 w-full rounded-xl" />
      </AppShell>
    );
  }

  if (!resume) {
    return (
      <AppShell title="Currículo">
        <EmptyState
          icon={Files}
          title="Currículo não encontrado"
          description="Esta versão pode ter sido excluída."
          action={
            <Button asChild>
              <Link to="/resumes">Ver meus currículos</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  return (
    <AppShell title={resume.name}>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/resumes">
          <ArrowLeft /> Meus currículos
        </Link>
      </Button>

      <PageHeader
        title={resume.name}
        description={[resume.jobTitle, resume.company].filter(Boolean).join(" · ") || "Versão personalizada"}
        actions={
          <div className="flex gap-2">
            {resume.isBase ? <Badge variant="soft">Currículo principal</Badge> : null}
            {typeof resume.matchScore === "number" ? <MatchScoreBadge score={resume.matchScore} /> : null}
          </div>
        }
      />

      <ResumeWorkspace
        resume={resume}
        onDuplicate={() => {
          const id = duplicateResume(resume.id);
          toast.success("Nova versão criada.");
          if (id) void navigate({ to: "/resumes/$resumeId", params: { resumeId: id } });
        }}
      />
    </AppShell>
  );
}
