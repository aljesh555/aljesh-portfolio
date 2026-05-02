export const PROFILE = {
  name: "Aljesh Raut",
  initials: "A.R.",
  role: "Independent Software Craftsman",
  city: "Kathmandu, Nepal",
  region: "Asia / Kathmandu",
  email: "rautaljesh@gmail.com",
  phone: "9819963606",
  whatsapp: "9779819963606",
  schedule: "https://cal.com/aljesh",
  github: "https://github.com/aljeshraut",
  // The "scheduled call" link can be swapped to any cal/calendly when ready.
};

export const NAV = [
  { label: "Index", to: "#hero", num: "00" },
  { label: "Practice", to: "#services", num: "01" },
  { label: "Method", to: "#process", num: "02" },
  { label: "Selected", to: "#work", num: "03" },
  { label: "Atelier", to: "#about", num: "04" },
  { label: "Commission", to: "#contact", num: "05" },
];

export const CAPABILITIES = [
  "TypeScript", "React", "Next.js", "Node.js", "Cloudflare Workers",
  "Pages", "D1", "R2", "KV", "Hono", "Postgres", "tRPC", "Prisma",
  "Tailwind", "Framer Motion", "GSAP", "Three.js", "Stripe", "Auth.js",
  "OpenAI", "n8n", "Zapier", "Supabase", "Drizzle", "Vite", "Astro",
];

export const SERVICES = [
  {
    num: "01",
    title: "SaaS Platforms",
    tag: "Multi-tenant · Subscriptions",
    summary:
      "End-to-end software-as-a-service products with multi-tenant architecture, subscription management, and scalable infrastructure.",
    deliverables: ["Tenancy & RBAC", "Stripe billing", "Edge-deployed API", "Audit & analytics"],
    icon: "saas",
  },
  {
    num: "02",
    title: "Business Dashboards",
    tag: "Realtime · KPI",
    summary:
      "Real-time analytics dashboards that transform raw data into actionable insights with interactive charts and KPI tracking.",
    deliverables: ["Cohort & funnel views", "Streaming metrics", "Embedded BI", "Role-aware exports"],
    icon: "chart",
  },
  {
    num: "03",
    title: "Automation Systems",
    tag: "Workflows · Pipelines",
    summary:
      "Workflow automation that eliminates repetitive tasks — from data pipelines and notifications to complete business process orchestration.",
    deliverables: ["ETL & sync jobs", "Webhook routing", "Notification fabric", "Headless agents"],
    icon: "loop",
  },
  {
    num: "04",
    title: "E-commerce Platforms",
    tag: "Storefront · Checkout",
    summary:
      "Custom storefronts with inventory management, payment processing, order tracking, and conversion-optimized checkout flows.",
    deliverables: ["Composable storefront", "Inventory & fulfilment", "Payments & tax", "Conversion lab"],
    icon: "bag",
  },
  {
    num: "05",
    title: "Client Web Applications",
    tag: "Brand · Interactive",
    summary:
      "High-performance web applications designed to represent brands, engage users, and convert visitors into customers.",
    deliverables: ["Design systems", "Motion craft", "CMS pipelines", "Lighthouse 95+"],
    icon: "globe",
  },
  {
    num: "06",
    title: "Admin Panels",
    tag: "RBAC · Audit",
    summary:
      "Comprehensive content and user management systems with role-based access, audit logging, and intuitive workflows.",
    deliverables: ["Permission matrices", "Approval flows", "Activity timelines", "Bulk operations"],
    icon: "grid",
  },
  {
    num: "07",
    title: "API Systems",
    tag: "REST · GraphQL · Edge",
    summary:
      "Resilient APIs designed at the edge — typed contracts, observable runtimes, and predictable performance under load.",
    deliverables: ["OpenAPI / tRPC", "Rate-limit & queues", "Versioning strategy", "SDK generation"],
    icon: "node",
  },
];

export const PROCESS = [
  {
    num: "I",
    label: "Discovery",
    body: "We map the territory — users, constraints, business shape — and pin down the one outcome that justifies the build.",
  },
  {
    num: "II",
    label: "Architecture",
    body: "Stack, data, edges. I write a one-page architecture brief so the next six weeks have no surprises.",
  },
  {
    num: "III",
    label: "Build",
    body: "Daily commits to a staging URL. You see the product growing, not a Gantt chart pretending to.",
  },
  {
    num: "IV",
    label: "Polish",
    body: "Motion, microcopy, edge cases, performance. The 20% that turns a working app into a product people quote.",
  },
  {
    num: "V",
    label: "Handover",
    body: "Docs, runbooks, deploy keys, and one final session so your team owns it — not just inherits it.",
  },
];

export const WORK = [
  {
    num: "01",
    client: "Anis · Personal",
    type: "Brand & Folio",
    year: "2026",
    summary: "Editorial single-page folio for a creative — cinematic scroll, R3F vignette, CMS-light content.",
    stack: ["Next.js", "Framer", "R3F"],
  },
  {
    num: "02",
    client: "Atlantic Seafood",
    type: "E-commerce",
    year: "2025",
    summary: "Wholesale catalogue and order portal for a regional importer. Tiered pricing, bulk PDFs, edge cache.",
    stack: ["Cloudflare Pages", "D1", "Stripe"],
  },
  {
    num: "03",
    client: "Athlete Land",
    type: "Training Platform",
    year: "2025",
    summary: "Programme builder for coaches with athlete dashboards, video drills and weekly compliance scoring.",
    stack: ["React", "Hono", "R2"],
  },
  {
    num: "04",
    client: "Nepali Chulo",
    type: "Restaurant Site",
    year: "2025",
    summary: "Hospitality site with reservation flow, photographic editorial menus and a multilingual story chapter.",
    stack: ["Astro", "Tailwind", "Workers"],
  },
];

export const STATS = [
  { num: "06+", label: "Years writing software" },
  { num: "20+", label: "Products shipped" },
  { num: "100%", label: "Built solo, end-to-end" },
  { num: "TU", label: "B.Sc. CSIT, in progress" },
];

export const FAQS = [
  {
    q: "How do we start?",
    a: "A 30-minute call. If we're a fit, I send a one-page proposal within 48 hours — scope, milestones, fixed price.",
  },
  {
    q: "What does a typical engagement look like?",
    a: "Two to ten weeks. Daily commits to a staging URL, a Friday demo, and a single Slack/WhatsApp thread for everything.",
  },
  {
    q: "Do you take equity instead of cash?",
    a: "Sometimes — for a specific class of early-stage founders solving a problem I find serious. Ask, with context.",
  },
  {
    q: "Why work alone, not as an agency?",
    a: "Because the best products I've used were built by one or two people who could hold the whole thing in their head.",
  },
  {
    q: "Where are you based?",
    a: "Kathmandu, Nepal (UTC+5:45). I work with founders and teams locally, nationally and globally — overlapping comfortably with EU mornings and US evenings.",
  },
];
