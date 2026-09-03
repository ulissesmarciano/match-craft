import { createFileRoute } from "@tanstack/react-router";
import { Download, Rocket, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { ConfirmDialog } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { buildDemoData } from "@/lib/demo-data";
import {
  clearAllData,
  exportData,
  loadDemo,
  removeDemo,
  setPreferences,
  useAppState,
} from "@/lib/store";
import type { Preferences } from "@/lib/types";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — JobMatch" },
      { name: "description", content: "Ajuste tema, idioma, preferências de currículo e gerencie seus dados." },
      { property: "og:title", content: "Configurações — JobMatch" },
      { property: "og:description", content: "Preferências do app e gerenciamento de dados locais." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const state = useAppState();
  const [confirmClear, setConfirmClear] = useState(false);
  const prefs = state.preferences;

  const update = (patch: Partial<Preferences>) => {
    setPreferences(patch);
    toast.success("Preferências atualizadas.");
  };

  return (
    <AppShell title="Configurações">
      <PageHeader title="Configurações" description="Preferências do aplicativo e gerenciamento dos seus dados." />

      <div className="space-y-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Preferências</CardTitle>
            <CardDescription>Ajuste como o JobMatch se comporta neste navegador.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="theme">Tema</Label>
              <Select value={prefs.theme} onValueChange={(v) => update({ theme: v as Preferences["theme"] })}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={prefs.language} onValueChange={(v) => update({ language: v as Preferences["language"] })}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="density">Densidade do currículo</Label>
              <Select
                value={prefs.resumeFontSize}
                onValueChange={(v) => update({ resumeFontSize: v as Preferences["resumeFontSize"] })}
              >
                <SelectTrigger id="density">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compacto">Compacto</SelectItem>
                  <SelectItem value="padrão">Padrão</SelectItem>
                  <SelectItem value="amplo">Amplo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Configurações de exportação</CardTitle>
            <CardDescription>Escolha o que entra no PDF ATS.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="inc-projects">Incluir projetos</Label>
              <Switch
                id="inc-projects"
                checked={prefs.includeProjects}
                onCheckedChange={(checked) => update({ includeProjects: checked })}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="inc-certs">Incluir certificações</Label>
              <Switch
                id="inc-certs"
                checked={prefs.includeCertifications}
                onCheckedChange={(checked) => update({ includeCertifications: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Dados de demonstração</CardTitle>
            <CardDescription>
              Dados fictícios (João Silva — Desenvolvedor Frontend) para explorar o produto.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {state.demoActive ? (
              <Button
                variant="outline"
                onClick={() => {
                  removeDemo();
                  toast.success("Dados de exemplo removidos.");
                }}
              >
                Remover exemplo
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  loadDemo(buildDemoData());
                  toast.success("Dados de exemplo carregados.");
                }}
              >
                <Rocket /> Usar exemplo
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Dados</CardTitle>
            <CardDescription>Tudo é salvo apenas neste navegador, sem conta nem login.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => exportData(state)}>
              <Download /> Exportar meus dados
            </Button>
            <Button variant="destructive" onClick={() => setConfirmClear(true)}>
              <Trash2 /> Limpar todos os dados
            </Button>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Limpar todos os dados?"
        description="Currículos, vagas e análises serão apagados deste navegador. Esta ação não pode ser desfeita."
        confirmLabel="Limpar tudo"
        destructive
        onConfirm={() => {
          clearAllData();
          setConfirmClear(false);
          toast.success("Todos os dados foram removidos.");
        }}
      />
    </AppShell>
  );
}
