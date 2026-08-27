import type { Job, MatchAnalysis, Resume } from "./types";

const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export function buildDemoData(): { resumes: Resume[]; jobs: Job[]; matches: MatchAnalysis[] } {
  const resume: Resume = {
    id: "demo-resume",
    name: "Currículo principal (exemplo)",
    isBase: true,
    demo: true,
    personal: {
      fullName: "João Silva",
      headline: "Desenvolvedor Frontend",
      email: "joao.silva@exemplo.com",
      phone: "(11) 99999-0000",
      city: "São Paulo",
      state: "SP",
      linkedin: "linkedin.com/in/joaosilva-exemplo",
      github: "github.com/joaosilva-exemplo",
      portfolio: "joaosilva.exemplo.dev",
      website: "",
    },
    summary:
      "Desenvolvedor Frontend com 5 anos de experiência em React e TypeScript, atuando na construção de interfaces acessíveis e performáticas para produtos SaaS. Experiência em integração com APIs REST e colaboração próxima com design e produto.",
    experiences: [
      {
        id: "demo-exp-1",
        company: "Tech Nova",
        role: "Desenvolvedor Frontend Pleno",
        location: "São Paulo, SP",
        start: "2022-03",
        end: "",
        current: true,
        description: "Desenvolvimento do painel administrativo de um produto SaaS B2B.",
        responsibilities:
          "- Implementação de interfaces em React e TypeScript\n- Integração com APIs REST\n- Revisão de código e mentoria de estagiários",
        achievements:
          "- Redução de 35% no tempo de carregamento do painel\n- Cobertura de testes elevada de 20% para 65%",
      },
      {
        id: "demo-exp-2",
        company: "Estúdio Web",
        role: "Desenvolvedor Frontend Júnior",
        location: "São Paulo, SP",
        start: "2020-01",
        end: "2022-02",
        current: false,
        description: "Criação de sites institucionais e e-commerces responsivos.",
        responsibilities: "- Desenvolvimento com HTML, CSS, JavaScript e React\n- Otimização de SEO técnico",
        achievements: "- Entrega de 18 projetos com prazo médio reduzido em 2 semanas",
      },
    ],
    education: [
      {
        id: "demo-edu-1",
        institution: "Universidade Exemplo",
        course: "Sistemas de Informação",
        degree: "Bacharelado",
        start: "2016-02",
        end: "2019-12",
        ongoing: false,
      },
    ],
    skills: {
      hard: ["Desenvolvimento Frontend", "APIs REST", "Testes automatizados", "Acessibilidade"],
      soft: ["Comunicação", "Trabalho em equipe", "Autonomia"],
      tools: ["Git", "Figma", "Jira", "Vite"],
      tech: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Next.js"],
      languages: ["Português (nativo)", "Inglês (avançado)"],
    },
    certifications: [
      {
        id: "demo-cert-1",
        name: "React Avançado",
        institution: "Escola Exemplo",
        date: "2023-05",
        link: "",
      },
    ],
    projects: [
      {
        id: "demo-proj-1",
        name: "Design System Aurora",
        description: "Biblioteca de componentes acessíveis usada em três produtos internos.",
        tech: "React, TypeScript, Storybook",
        link: "",
        github: "github.com/joaosilva-exemplo/aurora",
      },
    ],
    createdAt: iso(30),
    updatedAt: iso(2),
  };

  const job: Job = {
    id: "demo-job",
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "São Paulo, SP",
    model: "Híbrido",
    status: "Analisada",
    demo: true,
    createdAt: iso(3),
    description: `Buscamos uma pessoa desenvolvedora Frontend para atuar em produtos web de alta escala.

Requisitos:
- Experiência sólida com React e TypeScript
- Consumo de APIs REST
- Versionamento com Git
- Boas práticas de acessibilidade e performance

Desejável:
- Docker
- AWS
- CI/CD`,
  };

  const match: MatchAnalysis = {
    id: "demo-match",
    jobId: "demo-job",
    score: 87,
    breakdown: { skills: 92, experience: 85, education: 90, keywords: 81, requirements: 88 },
    requirements: [
      { name: "React", status: "found", evidence: "5 anos de uso em produtos SaaS." },
      { name: "TypeScript", status: "found", evidence: "Citado nas duas últimas experiências." },
      { name: "APIs REST", status: "found", evidence: "Integrações no painel administrativo." },
      { name: "Git", status: "found", evidence: "Listado em ferramentas." },
      { name: "Acessibilidade", status: "partial", evidence: "Mencionada, mas sem resultados mensuráveis." },
      { name: "Docker", status: "missing" },
      { name: "AWS", status: "missing" },
      { name: "CI/CD", status: "missing" },
    ],
    keywordsFound: ["React", "TypeScript", "APIs REST", "Git", "Frontend", "Performance"],
    keywordsMissing: ["Docker", "AWS", "CI/CD", "Kubernetes"],
    explanation:
      "Seu currículo possui forte aderência às tecnologias exigidas pela vaga, especialmente React, TypeScript e APIs REST. A principal oportunidade de melhoria está em evidenciar experiência com CI/CD e Docker.",
    recommendations: [
      {
        title: "Adicionar palavras-chave",
        detail: "A vaga cita competências de infraestrutura que não aparecem claramente no seu currículo.",
      },
      {
        title: "Experiência",
        detail: "Inclua resultados mensuráveis na experiência mais recente relacionada a performance.",
      },
    ],
    createdAt: iso(3),
  };

  return { resumes: [resume], jobs: [job], matches: [match] };
}
