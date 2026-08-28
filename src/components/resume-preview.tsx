import { Card } from "@/components/ui/card";
import { resumeToAtsHtml } from "@/lib/pdf";
import type { Resume } from "@/lib/types";

export function ResumePreview({ resume }: { resume: Resume }) {
  return (
    <Card className="overflow-hidden shadow-soft">
      <div className="border-b bg-muted px-4 py-2 text-xs text-muted-foreground">
        Preview ATS — coluna única, sem gráficos, pronto para leitura automatizada
      </div>
      <div className="max-h-[70vh] overflow-y-auto bg-background p-6">
        <div
          className="ats-preview mx-auto max-w-[720px] text-[13px] leading-relaxed text-foreground"
          dangerouslySetInnerHTML={{ __html: resumeToAtsHtml(resume) }}
        />
      </div>
      <style>{`
        .ats-preview h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: .25rem; }
        .ats-preview .headline { font-weight: 500; }
        .ats-preview .contact { color: var(--muted-foreground); font-size: .8rem; }
        .ats-preview h2 { font-size: .8rem; font-weight: 700; letter-spacing: .08em; margin: 1.25rem 0 .5rem; padding-bottom: .25rem; border-bottom: 1px solid var(--border); }
        .ats-preview .item { margin-bottom: .85rem; }
        .ats-preview .item-title { font-weight: 600; }
        .ats-preview .item-meta { color: var(--muted-foreground); font-size: .78rem; }
        .ats-preview ul { list-style: disc; padding-left: 1.1rem; margin: .25rem 0; }
        .ats-preview li { margin-bottom: .15rem; }
        .ats-preview p { margin-bottom: .2rem; }
      `}</style>
    </Card>
  );
}
