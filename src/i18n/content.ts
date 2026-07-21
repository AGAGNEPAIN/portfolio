import type { Lang, StackGroup, Translation } from "./types";

export const LANGS: Lang[] = ["fr", "en"];

export const STACK_GROUPS: StackGroup[] = [
  {
    key: "frontend",
    items: [
      { name: "TypeScript", level: "expert" },
      { name: "React / Next.js", level: "expert" },
      { name: "Vue / Nuxt", level: "advanced" },
      { name: "Design system", level: "advanced" },
    ],
  },
  {
    key: "backend",
    items: [
      { name: "PHP / Symfony", level: "expert" },
      { name: "TypeScript / NestJS", level: "expert" },
      { name: "PostgreSQL", level: "advanced" },
      { name: "Docker", level: "advanced" },
      { name: "GCP / AWS", level: "solid" },
    ],
  },
  {
    key: "monitoring",
    items: [
      { name: "Datadog", level: "advanced" },
      { name: "Sentry", level: "advanced" },
    ],
  },
  {
    key: "ai",
    items: [
      { name: "Claude Code", level: "expert" },
      { name: "AI Agents", level: "advanced" },
    ],
  },
];

export const TRANSLATIONS: Record<Lang, Translation> = {
  fr: {
    heroRole: "Lead Développeur Full-Stack",
    heroTag: "CV — 2026",
    heroAvail: "Disponible",
    heroSince: "Bordeaux",
    heroLangs: "Français / Anglais",
    heroPitch:
      "Je construis des produits qui durent et fais grandir les équipes qui les portent, avec une maîtrise de l'IA qui démultiplie nos résultats.",
    loadingLabel: "Chargement",
    expTitle: "Expériences",
    stackTitle: "Stack",
    contactLabel: "Contact",
    contactTitle: "Un produit à construire ?",
    contactSub:
      "Disponible pour un poste de Senior, Lead ou Staff Engineer. Réponse rapide garantie.",
    contactAvail: "Disponible",
    contactReply: "Réponse sous 24 h",
    cvLabel: "Télécharger le CV",
    copyLabel: "Copier",
    copiedLabel: "Copié ✓",
    localLabel: "Heure locale — Bordeaux",
    footerNote: "Conçu avec 💚 et Claude",
    groupLabels: {
      frontend: "Frontend",
      backend: "Backend",
      monitoring: "Monitoring",
      ai: "IA",
    },
    levelLabels: {
      expert: "Expert",
      advanced: "Avancé",
      solid: "Solide",
    },
    experiences: [
      {
        index: "01",
        company: "Little Worker",
        role: "Lead Développeur Full-Stack",
        place: "Bordeaux",
        period: "Juil. 2023 — Aujourd’hui",
        summary:
          "Architecte et référent technique sur la refonte de l'écosystème produit et des outils internes pour les professionnels de l'immobilier.",
        points: [
          {
            label: "Produits",
            text: "Conception et livraison technique de bout en bout des produits clés : Little Worker Pro, Studio (devis, contractualisation, matériaux chantier), Projection DPE (algorithme 3CL) et refonte complète du tunnel d'acquisition.",
          },
          {
            label: "Architecture",
            text: "Refonte complète de la stack en Domain-Driven Design + Event Pattern, migration sans interruption, design system transverse pour aligner l'écosystème.",
          },
          {
            label: "Standards & IA",
            text: "Définition des normes de dev de l'équipe + agent de pré-review automatisé pour les appliquer, réduction nette du temps de code review. Utilisation de frameworks de dev assisté par IA (Claude Code, agents) pour coder plus vite.",
          },
          {
            label: "Qualité",
            text: "Garant de la qualité logicielle : code review, mentorat technique, monitoring continu de la production et détection proactive des incidents.",
          },
        ],
      },
      {
        index: "02",
        company: "Consoneo",
        role: "Développeur Full-Stack",
        place: "Lormont",
        period: "Sept. 2021 — Juil. 2023",
        summary:
          "Développement produit et infra sur plusieurs applications BtoB et outils internes, full-stack et mobile.",
        points: [
          {
            label: "Produits",
            text: "bluspark.io, app de conciergerie pour mairies ; pilotage de la refonte complète de consoneo.com.",
          },
          {
            label: "Outils internes",
            text: "form-builder : app interne de génération de formulaires dynamiques pour les équipes métier.",
          },
          {
            label: "API",
            text: "Conception et implémentation d'APIs (Symfony / ApiPlatform) consommées par les front-ends web et mobile.",
          },
        ],
      },
      {
        index: "03",
        company: "Bordeaux Métropole Énergies",
        role: "Développeur Web",
        place: "Bordeaux",
        period: "2019 — Sept. 2021",
        summary:
          "Migration et modernisation d'applications métier pour un acteur public de l'énergie.",
        points: [],
      },
    ],
  },
  en: {
    heroRole: "Lead Full-Stack Developer",
    heroTag: "Resume — 2026",
    heroAvail: "Available",
    heroSince: "Bordeaux",
    heroLangs: "French / English",
    heroPitch:
      "I build products that last and grow the teams behind them, with a hands-on mastery of AI that multiplies our results.",
    loadingLabel: "Loading",
    expTitle: "Experience",
    stackTitle: "Stack",
    contactLabel: "Contact",
    contactTitle: "A product to build?",
    contactSub: "Available for a Senior, Lead or Staff Engineer role. Fast reply guaranteed.",
    contactAvail: "Available",
    contactReply: "Replies within 24h",
    cvLabel: "Download CV",
    copyLabel: "Copy",
    copiedLabel: "Copied ✓",
    localLabel: "Local time — Bordeaux",
    footerNote: "Built with 💚 and Claude",
    groupLabels: {
      frontend: "Frontend",
      backend: "Backend",
      monitoring: "Monitoring",
      ai: "AI",
    },
    levelLabels: {
      expert: "Expert",
      advanced: "Advanced",
      solid: "Solid",
    },
    experiences: [
      {
        index: "01",
        company: "Little Worker",
        role: "Lead Full-Stack Developer",
        place: "Bordeaux",
        period: "Jul. 2023 — Present",
        summary:
          "Architect and technical lead on the rebuild of the product ecosystem and internal tools for real-estate professionals.",
        points: [
          {
            label: "Products",
            text: "End-to-end ownership of key products: Little Worker Pro, Studio (quotes, contracting, on-site materials), DPE Projection (3CL algorithm) and full rebuild of the acquisition funnel.",
          },
          {
            label: "Architecture",
            text: "Full stack rebuild with Domain-Driven Design + Event Pattern, zero-downtime migration, cross-cutting design system to align the ecosystem.",
          },
          {
            label: "Standards & AI",
            text: "Defined the team's dev standards and built an automated pre-review agent to enforce them, significant cut in code-review time. Uses AI-assisted dev frameworks (Claude Code, agents) to ship faster.",
          },
          {
            label: "Quality",
            text: "Steward of software quality: code reviews, technical mentorship, continuous production monitoring and proactive incident detection.",
          },
        ],
      },
      {
        index: "02",
        company: "Consoneo",
        role: "Full-Stack Web Developer",
        place: "Lormont",
        period: "Sep. 2021 — Jul. 2023",
        summary:
          "Product and infrastructure work across multiple B2B apps and internal tools, full-stack and mobile.",
        points: [
          {
            label: "Products",
            text: "bluspark.io, a concierge app for city halls; led the full rebuild of consoneo.com.",
          },
          {
            label: "Internal tools",
            text: "form-builder: internal app for generating dynamic forms for business teams.",
          },
          {
            label: "API",
            text: "API design and implementation (Symfony / ApiPlatform) consumed by web and mobile front-ends.",
          },
        ],
      },
      {
        index: "03",
        company: "Bordeaux Métropole Énergies",
        role: "Web Developer",
        place: "Bordeaux",
        period: "2019 — Sep. 2021",
        summary:
          "Migration and modernization of business apps for a public-sector energy operator.",
        points: [],
      },
    ],
  },
};
