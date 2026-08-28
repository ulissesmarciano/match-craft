import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SkillsEditor } from "@/components/skills-editor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { improveSummary } from "@/lib/ai.functions";
import { resumeToPlainText } from "@/lib/resume-utils";
import { uid } from "@/lib/store";
import type { Certification, Education, Experience, Project, Resume } from "@/lib/types";

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function ResumeEditor({
  resume,
  onChange,
}: {
  resume: Resume;
  onChange: (resume: Resume) => void;
}) {
  const [improving, setImproving] = useState(false);

  const setPersonal = (key: keyof Resume["personal"], value: string) =>
    onChange({ ...resume, personal: { ...resume.personal, [key]: value } });

  const updateList = <T extends { id: string }>(
    key: "experiences" | "education" | "certifications" | "projects",
    id: string,
    patch: Partial<T>,
  ) =>
    onChange({
      ...resume,
      [key]: (resume[key] as T[]).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });

  const removeItem = (
    key: "experiences" | "education" | "certifications" | "projects",
    id: string,
  ) =>
    onChange({
      ...resume,
      [key]: (resume[key] as { id: string }[]).filter((item) => item.id !== id),
    });

  const handleImprove = async () => {
    setImproving(true);
    try {
      const result = await improveSummary({
        data: {
          summary: resume.summary,
          resumeText: resumeToPlainText(resume),
          targetRole: resume.personal.headline || "",
        },
      });
      onChange({ ...resume, summary: result.summary });
      toast.success("Resumo aprimorado com base nas suas informações.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível melhorar o resumo.");
    } finally {
      setImproving(false);
    }
  };

  return (
    <Accordion type="multiple" defaultValue={["personal", "summary", "experience"]} className="space-y-3">
      <AccordionItem value="personal" className="rounded-xl border bg-card px-4">
        <AccordionTrigger className="text-sm font-semibold">Informações pessoais</AccordionTrigger>
        <AccordionContent className="grid gap-4 pb-4 sm:grid-cols-2">
          <Field id="p-name" label="Nome completo" value={resume.personal.fullName} onChange={(v) => setPersonal("fullName", v)} />
          <Field id="p-headline" label="Cargo desejado" value={resume.personal.headline} onChange={(v) => setPersonal("headline", v)} />
          <Field id="p-email" label="E-mail" type="email" value={resume.personal.email} onChange={(v) => setPersonal("email", v)} />
          <Field id="p-phone" label="Telefone" value={resume.personal.phone} onChange={(v) => setPersonal("phone", v)} />
          <Field id="p-city" label="Cidade" value={resume.personal.city} onChange={(v) => setPersonal("city", v)} />
          <Field id="p-state" label="Estado" value={resume.personal.state} onChange={(v) => setPersonal("state", v)} />
          <Field id="p-linkedin" label="LinkedIn" value={resume.personal.linkedin} onChange={(v) => setPersonal("linkedin", v)} />
          <Field id="p-github" label="GitHub" value={resume.personal.github} onChange={(v) => setPersonal("github", v)} />
          <Field id="p-portfolio" label="Portfólio" value={resume.personal.portfolio} onChange={(v) => setPersonal("portfolio", v)} />
          <Field id="p-website" label="Website" value={resume.personal.website} onChange={(v) => setPersonal("website", v)} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="summary" className="rounded-xl border bg-card px-4">
        <AccordionTrigger className="text-sm font-semibold">Resumo profissional</AccordionTrigger>
        <AccordionContent className="grid gap-3 pb-4">
          <Label htmlFor="summary" className="sr-only">
            Resumo profissional
          </Label>
          <Textarea
            id="summary"
            rows={6}
            value={resume.summary}
            maxLength={1200}
            onChange={(e) => onChange({ ...resume, summary: e.target.value })}
            placeholder="Descreva sua experiência, especialidades e o valor que você entrega."
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">{resume.summary.length}/1200 caracteres</span>
            <Button variant="outline" size="sm" onClick={handleImprove} disabled={improving}>
              {improving ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Melhorar com IA
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="experience" className="rounded-xl border bg-card px-4">
        <AccordionTrigger className="text-sm font-semibold">Experiência profissional</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          {resume.experiences.map((exp) => (
            <Card key={exp.id} className="shadow-none">
              <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
                <Field id={`e-company-${exp.id}`} label="Empresa" value={exp.company} onChange={(v) => updateList<Experience>("experiences", exp.id, { company: v })} />
                <Field id={`e-role-${exp.id}`} label="Cargo" value={exp.role} onChange={(v) => updateList<Experience>("experiences", exp.id, { role: v })} />
                <Field id={`e-loc-${exp.id}`} label="Localização" value={exp.location} onChange={(v) => updateList<Experience>("experiences", exp.id, { location: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Field id={`e-start-${exp.id}`} label="Início" type="month" value={exp.start} onChange={(v) => updateList<Experience>("experiences", exp.id, { start: v })} />
                  <Field id={`e-end-${exp.id}`} label="Término" type="month" value={exp.end} onChange={(v) => updateList<Experience>("experiences", exp.id, { end: v })} />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Checkbox
                    id={`e-current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) =>
                      updateList<Experience>("experiences", exp.id, { current: checked === true })
                    }
                  />
                  <Label htmlFor={`e-current-${exp.id}`}>Trabalho atual</Label>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor={`e-desc-${exp.id}`}>Descrição</Label>
                  <Textarea id={`e-desc-${exp.id}`} rows={2} value={exp.description} onChange={(e) => updateList<Experience>("experiences", exp.id, { description: e.target.value })} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor={`e-resp-${exp.id}`}>Principais responsabilidades</Label>
                  <Textarea id={`e-resp-${exp.id}`} rows={3} value={exp.responsibilities} placeholder="- Uma responsabilidade por linha" onChange={(e) => updateList<Experience>("experiences", exp.id, { responsibilities: e.target.value })} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor={`e-ach-${exp.id}`}>Resultados / conquistas</Label>
                  <Textarea id={`e-ach-${exp.id}`} rows={3} value={exp.achievements} placeholder="- Um resultado por linha" onChange={(e) => updateList<Experience>("experiences", exp.id, { achievements: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Button variant="ghost" size="sm" onClick={() => removeItem("experiences", exp.id)}>
                    <Trash2 /> Remover experiência
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              onChange({
                ...resume,
                experiences: [
                  ...resume.experiences,
                  {
                    id: uid(),
                    company: "",
                    role: "",
                    location: "",
                    start: "",
                    end: "",
                    current: false,
                    description: "",
                    responsibilities: "",
                    achievements: "",
                  },
                ],
              })
            }
          >
            <Plus /> Adicionar experiência
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="education" className="rounded-xl border bg-card px-4">
        <AccordionTrigger className="text-sm font-semibold">Formação acadêmica</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          {resume.education.map((edu) => (
            <Card key={edu.id} className="shadow-none">
              <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
                <Field id={`ed-inst-${edu.id}`} label="Instituição" value={edu.institution} onChange={(v) => updateList<Education>("education", edu.id, { institution: v })} />
                <Field id={`ed-course-${edu.id}`} label="Curso" value={edu.course} onChange={(v) => updateList<Education>("education", edu.id, { course: v })} />
                <Field id={`ed-degree-${edu.id}`} label="Grau" value={edu.degree} onChange={(v) => updateList<Education>("education", edu.id, { degree: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Field id={`ed-start-${edu.id}`} label="Início" type="month" value={edu.start} onChange={(v) => updateList<Education>("education", edu.id, { start: v })} />
                  <Field id={`ed-end-${edu.id}`} label="Fim" type="month" value={edu.end} onChange={(v) => updateList<Education>("education", edu.id, { end: v })} />
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Checkbox
                    id={`ed-ongoing-${edu.id}`}
                    checked={edu.ongoing}
                    onCheckedChange={(checked) => updateList<Education>("education", edu.id, { ongoing: checked === true })}
                  />
                  <Label htmlFor={`ed-ongoing-${edu.id}`}>Em andamento</Label>
                </div>
                <div className="sm:col-span-2">
                  <Button variant="ghost" size="sm" onClick={() => removeItem("education", edu.id)}>
                    <Trash2 /> Remover formação
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              onChange({
                ...resume,
                education: [
                  ...resume.education,
                  { id: uid(), institution: "", course: "", degree: "", start: "", end: "", ongoing: false },
                ],
              })
            }
          >
            <Plus /> Adicionar formação
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="skills" className="rounded-xl border bg-card px-4">
        <AccordionTrigger className="text-sm font-semibold">Skills</AccordionTrigger>
        <AccordionContent className="pb-4">
          <SkillsEditor skills={resume.skills} onChange={(skills) => onChange({ ...resume, skills })} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="certifications" className="rounded-xl border bg-card px-4">
        <AccordionTrigger className="text-sm font-semibold">Certificações</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          {resume.certifications.map((cert) => (
            <Card key={cert.id} className="shadow-none">
              <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
                <Field id={`c-name-${cert.id}`} label="Nome" value={cert.name} onChange={(v) => updateList<Certification>("certifications", cert.id, { name: v })} />
                <Field id={`c-inst-${cert.id}`} label="Instituição" value={cert.institution} onChange={(v) => updateList<Certification>("certifications", cert.id, { institution: v })} />
                <Field id={`c-date-${cert.id}`} label="Data" type="month" value={cert.date} onChange={(v) => updateList<Certification>("certifications", cert.id, { date: v })} />
                <Field id={`c-link-${cert.id}`} label="Link (opcional)" value={cert.link} onChange={(v) => updateList<Certification>("certifications", cert.id, { link: v })} />
                <div className="sm:col-span-2">
                  <Button variant="ghost" size="sm" onClick={() => removeItem("certifications", cert.id)}>
                    <Trash2 /> Remover certificação
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              onChange({
                ...resume,
                certifications: [
                  ...resume.certifications,
                  { id: uid(), name: "", institution: "", date: "", link: "" },
                ],
              })
            }
          >
            <Plus /> Adicionar certificação
          </Button>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="projects" className="rounded-xl border bg-card px-4">
        <AccordionTrigger className="text-sm font-semibold">Projetos</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          {resume.projects.map((project) => (
            <Card key={project.id} className="shadow-none">
              <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
                <Field id={`pr-name-${project.id}`} label="Nome" value={project.name} onChange={(v) => updateList<Project>("projects", project.id, { name: v })} />
                <Field id={`pr-tech-${project.id}`} label="Tecnologias" value={project.tech} onChange={(v) => updateList<Project>("projects", project.id, { tech: v })} />
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor={`pr-desc-${project.id}`}>Descrição</Label>
                  <Textarea id={`pr-desc-${project.id}`} rows={2} value={project.description} onChange={(e) => updateList<Project>("projects", project.id, { description: e.target.value })} />
                </div>
                <Field id={`pr-link-${project.id}`} label="Link" value={project.link} onChange={(v) => updateList<Project>("projects", project.id, { link: v })} />
                <Field id={`pr-github-${project.id}`} label="GitHub" value={project.github} onChange={(v) => updateList<Project>("projects", project.id, { github: v })} />
                <div className="sm:col-span-2">
                  <Button variant="ghost" size="sm" onClick={() => removeItem("projects", project.id)}>
                    <Trash2 /> Remover projeto
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Separator />
          <Button
            variant="outline"
            onClick={() =>
              onChange({
                ...resume,
                projects: [
                  ...resume.projects,
                  { id: uid(), name: "", description: "", tech: "", link: "", github: "" },
                ],
              })
            }
          >
            <Plus /> Adicionar projeto
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
