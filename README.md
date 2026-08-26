# Match & Craft

Prompt para o Lovable

Crie do zero uma aplicação web completa chamada JobMatch, focada em matchmaking entre candidatos e vagas de emprego e na criação de versões de currículo otimizadas para ATS para cada vaga.

A aplicação deve ser construída 100% dentro do Lovable, sem depender de desenvolvimento externo, e deve funcionar como um produto real e utilizável.

1. Objetivo do produto

O usuário deve conseguir:

Cadastrar seus dados profissionais.

Criar e manter um currículo-base.

Adicionar ou importar vagas de emprego.

Comparar o currículo com uma vaga.

Receber um Match Score entre 0 e 100%.

Identificar quais requisitos da vaga já estão presentes no currículo.

Identificar quais requisitos estão ausentes ou pouco evidenciados.

Gerar uma versão personalizada do currículo para aquela vaga, mantendo apenas informações verdadeiras fornecidas pelo usuário.

Otimizar o currículo para sistemas ATS.

Visualizar, editar e exportar o currículo final em PDF.

Manter diferentes versões do currículo para diferentes vagas.

Importante: não criar sistema de login, cadastro, autenticação, senha ou recuperação de senha. A aplicação deve funcionar imediatamente ao ser aberta.

2. Stack e arquitetura

Use uma arquitetura moderna e consistente com o ecossistema do Lovable.

Frontend

React

TypeScript

Tailwind CSS

shadcn/ui como Design System principal

Lucide Icons

Componentização reutilizável

Layout totalmente responsivo

Abordagem mobile-first

Backend / dados

Utilize as capacidades nativas disponíveis no Lovable para persistência de dados.

Não criar autenticação.

O usuário deve conseguir utilizar a aplicação sem login.

Se for necessário identificar os dados localmente, utilizar um identificador de sessão/local apropriado.

3. Design System

Utilize exclusivamente shadcn/ui como base do Design System.

Não criar componentes visuais completamente diferentes do padrão shadcn.

Utilize componentes como:

Button

Card

Badge

Input

Textarea

Select

Checkbox

Dialog

Drawer

Tabs

Accordion

Progress

Separator

Dropdown Menu

Tooltip

Alert

Toast/Sonner

Table

Sheet

Skeleton

Scroll Area

Crie componentes compostos reutilizáveis quando necessário.

Identidade visual

A interface deve transmitir:

tecnologia

confiança

empregabilidade

produtividade

simplicidade

profissionalismo

Paleta

Use principalmente:

Azul claro como cor primária

Branco como cor predominante de fundo

Amarelo claro como cor de destaque

Evite uma aparência excessivamente colorida.

A paleta deve ser suave e profissional.

Sugestão:

Primary: #60A5FA

Primary dark/hover: #3B82F6

Background: #FFFFFF

Secondary background: #F8FAFC

Accent yellow: #FEF3C7

Accent yellow strong: #F59E0B

Text primary: #0F172A

Text secondary: #64748B

Border: #E2E8F0

Utilize CSS variables/Tailwind tokens para que a identidade visual seja facilmente alterável.

Use bordas suaves, sombras discretas, bastante espaço em branco e cantos arredondados.

4. Estrutura principal da aplicação

Crie uma aplicação com sidebar no desktop e navegação adaptada para mobile.

Sidebar

Logo:

JobMatch

Subtítulo:

Seu currículo trabalhando para você.

Menu:

Dashboard

Meu Currículo

Minhas Vagas

Matches

Currículos Personalizados

Na parte inferior:

Configurações

Ajuda

Como não existe login, não mostrar avatar, conta, logout ou informações de usuário autenticado.

5. Dashboard

Criar um dashboard moderno e objetivo.

Header

Título:

Olá! Vamos encontrar sua próxima oportunidade.

Subtítulo:

Compare seu perfil com vagas e crie currículos preparados para ATS.

Adicionar botão principal:

+ Adicionar vaga

Cards de resumo

Mostrar:

Vagas analisadas

Melhor Match

Currículos personalizados

Média de compatibilidade

Exemplo:

12 Vagas analisadas

94% Melhor Match

7 Currículos personalizados

78% Match médio

Seção "Melhores oportunidades"

Mostrar cards das vagas com:

Cargo

Empresa

Localização

Tipo de trabalho

Match Score

Data da análise

Botão "Ver Match"

Seção "Ações rápidas"

Cards/botões:

Criar meu currículo

Adicionar vaga

Analisar uma vaga

Criar currículo personalizado

6. Meu Currículo

Criar uma área completa para criação e gerenciamento do currículo-base.

O currículo deve ser estruturado em seções.

Informações pessoais

Campos:

Nome completo

Cargo desejado

E-mail

Telefone

Cidade

Estado

LinkedIn

GitHub

Portfólio

Website

Não exigir todos os campos.

Resumo profissional

Textarea com contador de caracteres.

Botão:

Melhorar com IA

A IA deve melhorar clareza, objetividade e impacto, mas nunca inventar informações.

Experiência profissional

Permitir adicionar múltiplas experiências.

Cada experiência deve conter:

Empresa

Cargo

Localização

Data de início

Data de término

Atual

Descrição

Principais responsabilidades

Resultados/conquistas

Permitir adicionar/remover experiências.

Formação acadêmica

Campos:

Instituição

Curso

Grau

Data inicial

Data final

Em andamento

Skills

Permitir cadastrar:

Hard skills

Soft skills

Ferramentas

Tecnologias

Idiomas

Utilizar componentes de tags/badges.

Certificações

Campos:

Nome

Instituição

Data

Link opcional

Projetos

Campos:

Nome

Descrição

Tecnologias

Link

GitHub

7. Currículo ATS

Criar uma seção chamada:

ATS Check

O usuário deve conseguir analisar o currículo-base.

Mostrar uma pontuação de 0 a 100.

Exemplo:

ATS Score: 82/100

Mostrar categorias:

Estrutura

Palavras-chave

Clareza

Experiência

Skills

Formatação

Seções

Legibilidade

Utilizar Progress e Cards do shadcn.

Mostrar recomendações práticas.

Exemplo:

Melhorias recomendadas

Adicionar palavras-chave

A vaga possui 5 competências técnicas importantes que não aparecem claramente no seu currículo.

Experiência

Inclua resultados mensuráveis quando possível.

Resumo profissional

Seu resumo pode ser mais específico para o cargo desejado.

8. Minhas Vagas

Criar uma área para gerenciamento das vagas.

Mostrar uma lista/tabela responsiva.

Cada vaga deve possuir:

Cargo

Empresa

Localização

Modelo de trabalho

Data adicionada

Match Score

Status

Status:

Nova

Analisada

Candidatura enviada

Entrevista

Encerrada

Adicionar botão:

+ Adicionar vaga

9. Adicionar vaga

Criar uma tela/modal para adicionar uma vaga.

Campos:

Cargo

Input.

Empresa

Input.

Localização

Input.

Modelo

Select:

Remoto

Híbrido

Presencial

Descrição da vaga

Textarea grande.

Placeholder:

"Cole aqui a descrição completa da vaga..."

Botão:

Analisar vaga

Após adicionar a vaga, iniciar automaticamente a análise quando possível.

10. Matchmaking

Essa é uma das funcionalidades principais do produto.

Criar uma tela:

Análise de Match

Mostrar:

Match Score

Um grande indicador visual:

87%

Texto:

Excelente compatibilidade

Usar Progress/Circular Progress ou um componente visual equivalente baseado em shadcn.

Dividir o Match em categorias

Mostrar:

Skills técnicas: 92%

Experiência: 85%

Formação: 90%

Palavras-chave: 81%

Requisitos gerais: 88%

"Você atende"

Lista de requisitos encontrados no currículo.

Exemplo:

✓ React
✓ TypeScript
✓ Git
✓ APIs REST
✓ Desenvolvimento Frontend

"Faltam ou precisam ser evidenciados"

Exemplo:

⚠ Docker
⚠ AWS
⚠ CI/CD

Importante:

Não afirmar que o usuário possui uma competência apenas porque ela aparece implicitamente.

Diferenciar:

Encontrado

Parcialmente encontrado

Não encontrado

11. Explicação do Match

Criar uma seção:

Por que este Match?

Explicar de forma simples por que a pontuação foi calculada.

Exemplo:

Seu currículo possui forte aderência às tecnologias exigidas pela vaga, especialmente React, TypeScript e APIs REST. A principal oportunidade de melhoria está em evidenciar experiência com CI/CD e Docker.

Mostrar também:

Palavras-chave da vaga

Listar as principais keywords encontradas.

Separar visualmente:

Encontradas no currículo

e

Ausentes do currículo

12. Currículo personalizado

Criar uma ação principal:

Criar currículo para esta vaga

Ao clicar, o sistema deve gerar uma nova versão do currículo especificamente para aquela vaga.

Nome:

Currículo — [Cargo] — [Empresa]

O currículo personalizado deve:

Reorganizar informações relevantes.

Destacar experiências relacionadas.

Priorizar skills relevantes.

Adaptar o resumo profissional.

Utilizar palavras-chave relevantes da vaga.

Melhorar bullets de experiência.

Manter estrutura simples.

Ser ATS-friendly.

Regra fundamental

Nunca inventar experiência, tecnologia, certificação, formação, cargo, empresa, resultado ou competência que não esteja nos dados fornecidos pelo usuário.

A IA pode:

reorganizar

resumir

reescrever

melhorar linguagem

destacar informações existentes

adaptar palavras-chave quando semanticamente verdadeiras

A IA não pode fabricar informações.

13. Otimização ATS

O currículo personalizado deve seguir boas práticas de ATS.

Priorizar:

texto simples

hierarquia clara

títulos tradicionais

palavras-chave relevantes

bullets objetivos

datas consistentes

ausência de elementos visuais que prejudiquem parsing

ausência de tabelas complexas

ausência de múltiplas colunas no currículo final

ausência de barras de skills

ausência de gráficos

ausência de informações essenciais dentro de imagens

Não utilizar:

foto

rating visual de habilidades

gráficos

infográficos

duas colunas no PDF ATS

elementos decorativos dentro do currículo

O editor da aplicação pode ser visualmente bonito, mas o documento final deve ser extremamente simples e ATS-friendly.

14. Editor de currículo

Criar um editor dividido em duas partes no desktop:

Esquerda

Painel de edição.

Direita

Preview do currículo em tempo real.

No mobile, utilizar tabs:

Editar

Preview

Adicionar botões:

Salvar versão

Restaurar

Criar nova versão

Exportar PDF

15. Versões de currículo

Criar uma área:

Meus currículos

Cada currículo deve mostrar:

Nome

Vaga relacionada

Empresa

Match Score

Data de criação

Última atualização

Exemplo:

Frontend Developer — Empresa X

Match:

91%

Botões:

Editar

Visualizar

Duplicar

Exportar

Excluir

O currículo-base deve ser identificado como:

Currículo principal

16. Exportação PDF

Permitir exportar o currículo personalizado para PDF.

O PDF deve:

utilizar formato A4

possuir margens profissionais

possuir tipografia legível

ter apenas uma coluna

ser facilmente interpretável por ATS

não utilizar elementos gráficos desnecessários

manter a ordem correta do conteúdo

Nome sugerido do arquivo:

curriculo-[nome]-[empresa].pdf

17. Experiência de IA

A aplicação deve utilizar IA para:

Analisar a descrição da vaga.

Extrair requisitos.

Extrair palavras-chave.

Comparar requisitos com o currículo.

Calcular Match Score.

Sugerir melhorias.

Reescrever o resumo.

Melhorar bullets de experiência.

Criar currículo personalizado.

Fazer ATS Check.

A IA deve sempre seguir estas regras:

Regra 1 — Verdade

Nunca inventar informações.

Regra 2 — Evidência

Toda recomendação deve ser baseada no conteúdo fornecido pelo usuário ou na vaga analisada.

Regra 3 — Transparência

Quando uma skill não estiver presente, informar claramente.

Regra 4 — ATS

Priorizar relevância semântica e palavras-chave naturais.

Regra 5 — Não keyword stuffing

Não repetir palavras-chave artificialmente apenas para aumentar o Match Score.

18. Score de Match

Criar uma lógica consistente para o Match Score.

Sugestão de pesos:

Skills técnicas: 30%

Experiência: 25%

Palavras-chave: 20%

Requisitos da vaga: 15%

Formação/certificações: 10%

O score deve ser apresentado como uma estimativa de compatibilidade, não como garantia de contratação.

Criar também uma legenda:

90–100%: Excelente compatibilidade

75–89%: Boa compatibilidade

60–74%: Compatibilidade moderada

0–59%: Baixa compatibilidade

19. Empty states

Criar estados vazios bonitos e úteis.

Sem currículo

Crie seu currículo-base

"Comece adicionando suas experiências, habilidades e formação."

Botão:

Criar currículo

Sem vagas

Você ainda não adicionou nenhuma vaga.

"Adicione uma vaga para descobrir quanto seu perfil combina com ela."

Botão:

Adicionar vaga

Sem currículos personalizados

Nenhum currículo personalizado ainda.

"Analise uma vaga e gere uma versão otimizada do seu currículo."

20. Loading states

Utilizar Skeleton do shadcn.

Durante análise de vaga:

Analisando a vaga...

Durante Match:

Comparando seu perfil com os requisitos...

Durante geração:

Criando seu currículo personalizado...

Não deixar a interface parecer travada.

21. Feedback e erros

Utilizar Sonner/Toast.

Exemplos:

Currículo salvo com sucesso.

Vaga adicionada.

Análise concluída.

Currículo personalizado criado.

Para erros:

Não foi possível concluir a análise. Tente novamente.

Criar estados de erro claros e amigáveis.

22. Responsividade

A aplicação deve funcionar perfeitamente em:

Desktop

Notebook

Tablet

Mobile

No desktop:

Sidebar fixa + conteúdo.

No mobile:

Sidebar transformada em menu/drawer.

Cards devem se adaptar automaticamente.

Tabelas devem virar cards/listas quando necessário.

O editor de currículo deve ser especialmente bem adaptado para telas pequenas.

23. UX

A experiência deve ser extremamente simples.

O fluxo principal deve ser:

Criar currículo → Adicionar vaga → Analisar Match → Melhorar currículo → Exportar PDF

Sempre deixar a próxima ação clara.

Os principais CTAs devem ser visualmente destacados.

Não sobrecarregar a tela com informações.

24. Página inicial / onboarding

Como não haverá login, na primeira utilização mostrar um onboarding simples.

Título:

Encontre vagas que combinam com você.

Subtítulo:

Analise seu currículo, descubra seu nível de compatibilidade e crie uma versão otimizada para cada oportunidade.

CTA:

Começar agora

Depois:

Etapa 1

Crie seu currículo-base

Etapa 2

Cole uma vaga

Etapa 3

Descubra seu Match

Etapa 4

Gere seu currículo ATS

Não criar cadastro.

25. Navegação

Criar as seguintes rotas/telas:

/

/dashboard

/resume

/jobs

/jobs/:id

/matches

/resumes

/resumes/:id

/settings

A navegação deve funcionar corretamente entre todas as telas.

26. Configurações

Como não existe autenticação, não criar configurações de conta.

Criar apenas:

Preferências

Tema

Idioma

Preferências de currículo

Configurações de exportação

Dados

Exportar meus dados

Limpar todos os dados

Antes de limpar dados, mostrar Dialog de confirmação.

27. Dados de demonstração

Na primeira abertura, não deixar a aplicação visualmente vazia.

Criar uma experiência de demonstração opcional com dados fictícios claramente identificados como exemplo.

Exemplo:

João Silva — Desenvolvedor Frontend

Vaga fictícia:

Frontend Developer — Tech Solutions

Isso deve permitir que o usuário veja imediatamente como funciona o produto.

Adicionar opção:

Usar exemplo

e

Começar do zero

Os dados de demonstração devem ser claramente fictícios e nunca misturados com dados reais do usuário.

28. Componentização

Organizar o projeto em componentes reutilizáveis.

Criar componentes como:

AppSidebar

DashboardHeader

StatCard

JobCard

MatchScore

MatchBreakdown

SkillBadge

ResumeEditor

ResumePreview

ResumeSection

ExperienceEditor

EducationEditor

SkillsEditor

JobForm

JobAnalysis

ATSScore

ATSRecommendation

EmptyState

LoadingState

ConfirmDialog

Evitar componentes gigantes.

29. Acessibilidade

Seguir boas práticas de acessibilidade:

labels em inputs

navegação por teclado

foco visível

contraste adequado

aria-label quando necessário

botões semanticamente corretos

mensagens de erro acessíveis

Utilizar os padrões de acessibilidade do shadcn/ui.

30. Qualidade visual

A aplicação deve parecer um SaaS profissional moderno, não um protótipo.

Priorizar:

excelente espaçamento

tipografia consistente

cards elegantes

hierarquia visual clara

microinterações discretas

transições suaves

estados hover

skeleton loading

feedback visual

responsividade

Não exagerar em gradientes, glassmorphism ou efeitos decorativos.

O produto deve parecer confiável e profissional, especialmente porque está relacionado a emprego e carreira.

31. Regra de implementação

Construa a aplicação completa e funcional, não apenas as telas.

Todos os botões importantes devem possuir comportamento real.

Todos os formulários devem funcionar.

A navegação deve funcionar.

O CRUD de currículos e vagas deve funcionar.

O Match deve funcionar.

A geração de currículo personalizado deve funcionar.

A persistência dos dados deve funcionar.

A exportação PDF deve funcionar.

Utilize dados mock apenas quando necessário para estados de demonstração.

Não deixar TODOs ou botões sem função.

32. Prioridade do produto

A prioridade de implementação deve ser:

Fluxo de currículo-base

Cadastro de vaga

Análise da vaga

Match Score

Recomendações

Geração de currículo personalizado

Editor + Preview

Exportação PDF

Dashboard

Histórico de versões

Refinamentos visuais

O resultado final deve ser uma aplicação JobMatch funcional, responsiva, moderna e pronta para ser utilizada, com shadcn/ui como Design System, identidade visual em azul claro, branco e amarelo claro, sem autenticação e com foco central em matching de vagas + geração de currículos ATS personalizados.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5c5f2a9f-bf7e-4c5e-b24b-ab33fc011220).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
