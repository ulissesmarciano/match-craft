import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Ajuda — JobMatch" },
      { name: "description", content: "Como funciona o Match Score, o ATS Check e a geração de currículos personalizados." },
      { property: "og:title", content: "Ajuda — JobMatch" },
      { property: "og:description", content: "Guia rápido do fluxo currículo, vaga, match e exportação em PDF." },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  {
    q: "Como o Match Score é calculado?",
    a: "A análise pondera skills técnicas (30%), experiência (25%), palavras-chave (20%), requisitos da vaga (15%) e formação/certificações (10%). O resultado é uma estimativa de compatibilidade — não uma garantia de contratação.",
  },
  {
    q: "O que significam as faixas de pontuação?",
    a: "90–100%: excelente compatibilidade. 75–89%: boa compatibilidade. 60–74%: compatibilidade moderada. 0–59%: baixa compatibilidade.",
  },
  {
    q: "A IA pode inventar experiências para melhorar meu match?",
    a: "Não. A IA só reorganiza, resume, reescreve e destaca informações que você já forneceu. Skills ausentes são sempre sinalizadas como ausentes.",
  },
  {
    q: "Por que o PDF é tão simples?",
    a: "Currículos com colunas, gráficos, fotos e barras de habilidade costumam quebrar em sistemas ATS. O documento final usa uma coluna, títulos tradicionais e texto puro para maximizar a leitura automatizada.",
  },
  {
    q: "Onde meus dados ficam salvos?",
    a: "Tudo é armazenado localmente no seu navegador. Não há login, conta ou envio dos seus dados para um servidor além da análise pontual feita pela IA.",
  },
];

function HelpPage() {
  return (
    <AppShell title="Ajuda">
      <PageHeader title="Ajuda" description="Entenda o fluxo do JobMatch e como interpretar seus resultados." />

      <Alert className="mb-6">
        <AlertTitle>Fluxo recomendado</AlertTitle>
        <AlertDescription>
          Criar currículo → Adicionar vaga → Analisar Match → Melhorar currículo → Exportar PDF.
        </AlertDescription>
      </Alert>

      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <Accordion type="single" collapsible>
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left text-sm font-medium">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/resume">Ir para meu currículo</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/jobs">Adicionar uma vaga</Link>
        </Button>
      </div>
    </AppShell>
  );
}
