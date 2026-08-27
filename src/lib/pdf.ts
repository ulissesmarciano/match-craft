import type { Resume } from "./types";
import { slugify } from "./resume-utils";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);

function bullets(text: string) {
  const items = text
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  if (!items.length) return "";
  return `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
}

function section(title: string, body: string) {
  return body ? `<h2>${title}</h2>${body}` : "";
}

export function resumeToAtsHtml(resume: Resume): string {
  const p = resume.personal;
  const contact = [p.email, p.phone, [p.city, p.state].filter(Boolean).join(" - ")]
    .filter(Boolean)
    .join(" | ");
  const links = [p.linkedin, p.github, p.portfolio, p.website].filter(Boolean).join(" | ");

  const experiences = resume.experiences
    .map(
      (e) => `<div class="item">
        <p class="item-title">${escapeHtml(e.role || "")}${e.company ? " — " + escapeHtml(e.company) : ""}</p>
        <p class="item-meta">${[escapeHtml(e.location || ""), `${escapeHtml(e.start || "")}${e.start ? " - " : ""}${e.current ? "Atual" : escapeHtml(e.end || "")}`]
          .filter(Boolean)
          .join(" | ")}</p>
        ${e.description ? `<p>${escapeHtml(e.description)}</p>` : ""}
        ${bullets(e.responsibilities)}
        ${bullets(e.achievements)}
      </div>`,
    )
    .join("");

  const education = resume.education
    .map(
      (e) => `<div class="item">
        <p class="item-title">${escapeHtml([e.degree, e.course].filter(Boolean).join(" em "))}</p>
        <p class="item-meta">${[escapeHtml(e.institution || ""), `${escapeHtml(e.start || "")}${e.start ? " - " : ""}${e.ongoing ? "Em andamento" : escapeHtml(e.end || "")}`].filter(Boolean).join(" | ")}</p>
      </div>`,
    )
    .join("");

  const skillLine = (label: string, values: string[]) =>
    values.length ? `<p><strong>${label}:</strong> ${escapeHtml(values.join(", "))}</p>` : "";

  const skills =
    skillLine("Hard skills", resume.skills.hard) +
    skillLine("Tecnologias", resume.skills.tech) +
    skillLine("Ferramentas", resume.skills.tools) +
    skillLine("Soft skills", resume.skills.soft) +
    skillLine("Idiomas", resume.skills.languages);

  const certifications = resume.certifications
    .map(
      (c) =>
        `<p>${escapeHtml(c.name)}${c.institution ? " — " + escapeHtml(c.institution) : ""}${c.date ? " (" + escapeHtml(c.date) + ")" : ""}</p>`,
    )
    .join("");

  const projects = resume.projects
    .map(
      (pr) => `<div class="item">
        <p class="item-title">${escapeHtml(pr.name)}</p>
        ${pr.description ? `<p>${escapeHtml(pr.description)}</p>` : ""}
        ${pr.tech ? `<p class="item-meta">Tecnologias: ${escapeHtml(pr.tech)}</p>` : ""}
        ${pr.link || pr.github ? `<p class="item-meta">${escapeHtml([pr.link, pr.github].filter(Boolean).join(" | "))}</p>` : ""}
      </div>`,
    )
    .join("");

  return `<article class="ats-doc">
    <header>
      <h1>${escapeHtml(p.fullName || "Seu nome")}</h1>
      ${p.headline ? `<p class="headline">${escapeHtml(p.headline)}</p>` : ""}
      ${contact ? `<p class="contact">${escapeHtml(contact)}</p>` : ""}
      ${links ? `<p class="contact">${escapeHtml(links)}</p>` : ""}
    </header>
    ${section("RESUMO PROFISSIONAL", resume.summary ? `<p>${escapeHtml(resume.summary)}</p>` : "")}
    ${section("EXPERIÊNCIA PROFISSIONAL", experiences)}
    ${section("FORMAÇÃO ACADÊMICA", education)}
    ${section("COMPETÊNCIAS", skills)}
    ${section("CERTIFICAÇÕES", certifications)}
    ${section("PROJETOS", projects)}
  </article>`;
}

const PRINT_CSS = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 11pt; line-height: 1.45; margin: 0; }
  .ats-doc { max-width: 100%; }
  h1 { font-size: 18pt; margin: 0 0 2mm; }
  .headline { margin: 0 0 2mm; font-size: 12pt; }
  .contact { margin: 0; font-size: 10pt; }
  h2 { font-size: 11.5pt; margin: 6mm 0 2mm; border-bottom: 1px solid #999; padding-bottom: 1mm; letter-spacing: .04em; }
  .item { margin-bottom: 4mm; page-break-inside: avoid; }
  .item-title { margin: 0; font-weight: bold; }
  .item-meta { margin: 0 0 1mm; font-size: 10pt; color: #333; }
  p { margin: 0 0 1.5mm; }
  ul { margin: 0 0 2mm; padding-left: 5mm; }
  li { margin-bottom: 1mm; }
`;

export function exportResumePdf(resume: Resume) {
  const filename = `curriculo-${slugify(resume.personal.fullName || "candidato")}${
    resume.company ? "-" + slugify(resume.company) : ""
  }`;
  const win = window.open("", "_blank", "width=900,height=1100");
  if (!win) throw new Error("Permita pop-ups para exportar o PDF.");
  win.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
    <title>${filename}</title><style>${PRINT_CSS}</style></head>
    <body>${resumeToAtsHtml(resume)}</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 350);
}
