import { X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Skills } from "@/lib/types";

const GROUPS: { key: keyof Skills; label: string; placeholder: string }[] = [
  { key: "hard", label: "Hard skills", placeholder: "Ex.: APIs REST" },
  { key: "soft", label: "Soft skills", placeholder: "Ex.: Comunicação" },
  { key: "tools", label: "Ferramentas", placeholder: "Ex.: Git" },
  { key: "tech", label: "Tecnologias", placeholder: "Ex.: React" },
  { key: "languages", label: "Idiomas", placeholder: "Ex.: Inglês (avançado)" },
];

export function SkillsEditor({
  skills,
  onChange,
}: {
  skills: Skills;
  onChange: (skills: Skills) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const add = (key: keyof Skills) => {
    const value = (drafts[key] ?? "").trim();
    if (!value) return;
    if (skills[key].includes(value)) return;
    onChange({ ...skills, [key]: [...skills[key], value] });
    setDrafts({ ...drafts, [key]: "" });
  };

  const remove = (key: keyof Skills, value: string) =>
    onChange({ ...skills, [key]: skills[key].filter((s) => s !== value) });

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {GROUPS.map((group) => (
        <div key={group.key} className="grid gap-2">
          <Label htmlFor={`skill-${group.key}`}>{group.label}</Label>
          <Input
            id={`skill-${group.key}`}
            value={drafts[group.key] ?? ""}
            placeholder={`${group.placeholder} (Enter para adicionar)`}
            onChange={(e) => setDrafts({ ...drafts, [group.key]: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add(group.key);
              }
            }}
          />
          <div className="flex flex-wrap gap-1.5">
            {skills[group.key].map((value) => (
              <Badge key={value} variant="soft" className="gap-1 py-1">
                {value}
                <button
                  type="button"
                  aria-label={`Remover ${value}`}
                  onClick={() => remove(group.key, value)}
                  className="rounded-full p-0.5 hover:bg-background/60"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
