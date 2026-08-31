import { Download, Loader2, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AtsScorePanel } from "@/components/ats-score";
import { LoadingState } from "@/components/common";
import { ResumeEditor } from "@/components/resume-editor";
import { ResumePreview } from "@/components/resume-preview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { atsCheck } from "@/lib/ai.functions";
import { exportResumePdf } from "@/lib/pdf";
import { resumeToPlainText } from "@/lib/resume-utils";
import { now, saveAts, saveResume, useAppState } from "@/lib/store";
import type { Resume } from "@/lib/types";

export function ResumeWorkspace({
  resume,
  onDuplicate,
}: {
  resume: Resume;
  onDuplicate?: () => void;
}) {
  const state = useAppState();
  const [draft, setDraft] = useState<Resume>(resume);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setDraft(resume);
  }, [resume.id, resume.updatedAt]);

  const ats = state.ats[resume.id];

  const save = () => {
    saveResume({ ...draft, updatedAt: now() });
    toast.success("Currículo salvo com sucesso.");
  };

  const restore = () => {
    setDraft(resume);
    toast.info("Alterações não salvas descartadas.");
  };

  const runAts = async () => {
    setChecking(true);
    try {
      const result = await atsCheck({ data: { resumeText: resumeToPlainText(draft) } });
      saveAts(resume.id, { ...result, createdAt: now() });
      toast.success("Análise ATS concluída.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir a análise.");
    } finally {
      setChecking(false);
    }
  };

  const exportPdf = () => {
    try {
      exportResumePdf(draft);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível exportar o PDF.");
    }
  };

  const actions = (
    <div className="mb-5 flex flex-wrap gap-2">
      <Button onClick={save}>
        <Save /> Salvar versão
      </Button>
      <Button variant="outline" onClick={restore}>
        <RotateCcw /> Restaurar
      </Button>
      {onDuplicate ? (
        <Button variant="outline" onClick={onDuplicate}>
          Criar nova versão
        </Button>
      ) : null}
      <Button variant="outline" onClick={exportPdf}>
        <Download /> Exportar PDF
      </Button>
    </div>
  );

  return (
    <div>
      {actions}

      <div className="hidden gap-6 lg:grid lg:grid-cols-2">
        <div className="space-y-4">
          <ResumeEditor resume={draft} onChange={setDraft} />
        </div>
        <div className="space-y-4">
          <div className="sticky top-6 space-y-4">
            <ResumePreview resume={draft} />
            <AtsSection ats={ats} checking={checking} onRun={runAts} />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <Tabs defaultValue="edit">
          <TabsList className="w-full">
            <TabsTrigger value="edit" className="flex-1">
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
            <TabsTrigger value="ats" className="flex-1">
              ATS Check
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <ResumeEditor resume={draft} onChange={setDraft} />
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <ResumePreview resume={draft} />
          </TabsContent>
          <TabsContent value="ats" className="mt-4">
            <AtsSection ats={ats} checking={checking} onRun={runAts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AtsSection({
  ats,
  checking,
  onRun,
}: {
  ats?: { score: number; categories: { name: string; score: number }[]; recommendations: { title: string; detail: string }[]; createdAt: string };
  checking: boolean;
  onRun: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">ATS Check</h2>
        <Button variant="outline" size="sm" onClick={onRun} disabled={checking}>
          {checking ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
          Analisar currículo
        </Button>
      </div>
      {checking ? (
        <LoadingState message="Analisando o currículo para sistemas ATS..." />
      ) : ats ? (
        <AtsScorePanel result={ats} />
      ) : (
        <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          Rode o ATS Check para receber uma pontuação de 0 a 100 e recomendações práticas baseadas no
          conteúdo do seu currículo.
        </p>
      )}
    </div>
  );
}
