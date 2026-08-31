import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, FileText, Rocket, ScanSearch, Sparkles, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildDemoData } from "@/lib/demo-data";
import { loadDemo, setOnboarded } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JobMatch — Match de vagas e currículos otimizados para ATS" },
      {
        name: "description",
        content:
          "Compare seu currículo com vagas, descubra seu Match Score e gere versões otimizadas para ATS em minutos. Sem cadastro.",
      },
      { property: "og:title", content: "JobMatch — Seu currículo trabalhando para você" },
      {
        property: "og:description",
        content: "Analise vagas, calcule compatibilidade e exporte currículos ATS-friendly em PDF.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { icon: FileText, title: "Etapa 1", text: "Crie seu currículo-base" },
  { icon: ScanSearch, title: "Etapa 2", text: "Cole uma vaga" },
  { icon: Target, title: "Etapa 3", text: "Descubra seu Match" },
  { icon: Sparkles, title: "Etapa 4", text: "Gere seu currículo ATS" },
];

function Landing() {
  const navigate = useNavigate();

  const start = () => {
    setOnboarded(true);
    void navigate({ to: "/resume" });
  };

  const useDemo = () => {
    loadDemo(buildDemoData());
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-semibold">JobMatch</p>
            <p className="text-xs text-muted-foreground">Seu currículo trabalhando para você.</p>
          </div>
        </div>
        <Button variant="ghost" asChild>
          <Link to="/dashboard">Ir para o app</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="py-12 text-center sm:py-20">
          <Badge variant="warning" className="mb-5">
            Sem cadastro · Seus dados ficam no seu navegador
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Encontre vagas que combinam com você.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Analise seu currículo, descubra seu nível de compatibilidade e crie uma versão otimizada
            para cada oportunidade.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={start}>
              Começar agora <ArrowRight />
            </Button>
            <Button size="lg" variant="outline" onClick={useDemo}>
              <Rocket /> Usar exemplo
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            O exemplo usa dados fictícios (João Silva) e pode ser removido a qualquer momento.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Card key={step.title} className="shadow-soft">
              <CardContent className="space-y-3 pt-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {step.title}
                </p>
                <p className="text-sm font-medium">{step.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
