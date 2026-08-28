import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Job, WorkModel } from "@/lib/types";
import { now, uid } from "@/lib/store";

export interface JobDraft {
  title: string;
  company: string;
  location: string;
  model: WorkModel;
  description: string;
}

const EMPTY: JobDraft = { title: "", company: "", location: "", model: "Remoto", description: "" };

export function JobFormDialog({
  trigger,
  onSubmit,
  open: controlledOpen,
  onOpenChange,
}: {
  trigger?: ReactNode;
  onSubmit: (job: Job) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [draft, setDraft] = useState<JobDraft>(EMPTY);
  const [error, setError] = useState("");

  const submit = () => {
    if (!draft.title.trim() || !draft.description.trim()) {
      setError("Informe pelo menos o cargo e a descrição da vaga.");
      return;
    }
    setError("");
    onSubmit({
      id: uid(),
      title: draft.title.trim(),
      company: draft.company.trim(),
      location: draft.location.trim(),
      model: draft.model,
      description: draft.description.trim(),
      status: "Nova",
      createdAt: now(),
    });
    setDraft(EMPTY);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar vaga</DialogTitle>
          <DialogDescription>
            Cole a descrição completa da vaga para que a análise identifique requisitos e palavras-chave.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="job-title">Cargo</Label>
            <Input
              id="job-title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Frontend Developer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="job-company">Empresa</Label>
            <Input
              id="job-company"
              value={draft.company}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
              placeholder="Tech Solutions"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="job-location">Localização</Label>
            <Input
              id="job-location"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              placeholder="São Paulo, SP"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="job-model">Modelo</Label>
            <Select
              value={draft.model}
              onValueChange={(value) => setDraft({ ...draft, model: value as WorkModel })}
            >
              <SelectTrigger id="job-model">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remoto">Remoto</SelectItem>
                <SelectItem value="Híbrido">Híbrido</SelectItem>
                <SelectItem value="Presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="job-description">Descrição da vaga</Label>
            <Textarea
              id="job-description"
              rows={10}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Cole aqui a descrição completa da vaga..."
            />
          </div>
        </div>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>Analisar vaga</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
