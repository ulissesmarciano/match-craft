import { Link } from "@tanstack/react-router";
import { Building2, CalendarDays, MapPin } from "lucide-react";

import { MatchScoreBadge } from "@/components/match";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job } from "@/lib/types";

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

export function JobCard({ job, score }: { job: Job; score?: number }) {
  return (
    <Card className="flex h-full flex-col shadow-soft transition-shadow hover:shadow-lift">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-snug">{job.title}</CardTitle>
          {typeof score === "number" ? <MatchScoreBadge score={score} /> : <Badge variant="muted">Sem análise</Badge>}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 pb-3 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Building2 className="size-4 shrink-0" aria-hidden />
          {job.company || "—"}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {job.location || "—"} · {job.model}
        </p>
        <p className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" aria-hidden />
          Adicionada em {formatDate(job.createdAt)}
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="secondary">{job.status}</Badge>
          {job.demo ? <Badge variant="warning">Exemplo</Badge> : null}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
            Ver Match
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
