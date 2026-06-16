export const PROFILE = {
  name: "Anis Raut",
  alias: "Aljesh",
  initials: "A.R.",
  role: "Independent Software Craftsman",
  city: "Kathmandu, Nepal",
  region: "Asia / Kathmandu",
  email: "rautaljesh@gmail.com",
  phone: "9819963606",
  whatsapp: "9779819963606",
  github: "https://github.com/aljeshraut",
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
      "Multi-tenant apps with subscriptions, role-based access, and an API that runs at the edge.",
    deliverables: ["Tenancy & RBAC", "Stripe billing", "Edge-deployed API", "Audit & analytics"],
    icon: "saas",
  },
  {
    num: "02",
    title: "Business Dashboards",
    tag: "Realtime · KPI",
    summary:
      "Dashboards that pull from your real data sources and show the numbers you check every morning.",
    deliverables: ["Cohort & funnel views", "Streaming metrics", "Embedded BI", "Role-aware exports"],
    icon: "chart",
  },
  {
    num: "03",
    title: "Automation Systems",
    tag: "Workflows · Pipelines",
    summary:
      "Scripts, pipelines and scheduled jobs that take work off someone's daily list.",
    deliverables: ["ETL & sync jobs", "Webhook routing", "Notification fabric", "Headless agents"],
    icon: "loop",
  },
  {
    num: "04",
    title: "E-commerce Platforms",
    tag: "Storefront · Checkout",
    summary:
      "Storefronts with Stripe checkout, inventory and order tracking. Fast on mobile, fast on slow connections.",
    deliverables: ["Composable storefront", "Inventory & fulfilment", "Payments & tax", "Conversion lab"],
    icon: "bag",
  },
  {
    num: "05",
    title: "Client Web Applications",
    tag: "Brand · Interactive",
    summary:
      "Brand sites and marketing pages. Heavy on typography, light on JavaScript.",
    deliverables: ["Design systems", "Motion craft", "CMS pipelines", "Lighthouse 95+"],
    icon: "globe",
  },
  {
    num: "06",
    title: "Admin Panels",
    tag: "RBAC · Audit",
    summary:
      "Internal tools for your team — CRUD, permissions, audit logs, bulk actions.",
    deliverables: ["Permission matrices", "Approval flows", "Activity timelines", "Bulk operations"],
    icon: "grid",
  },
  {
    num: "07",
    title: "API Systems",
    tag: "REST · tRPC · Edge",
    summary:
      "REST and tRPC APIs on Cloudflare Workers. Typed end-to-end, deployed close to your users.",
    deliverables: ["OpenAPI / tRPC", "Rate-limit & queues", "Versioning strategy", "SDK generation"],
    icon: "node",
  },
];

export const PROCESS = [
  {
    num: "I",
    label: "Discovery",
    body: "A 30-minute call to figure out who uses it, what it has to do, and the thing that makes the project worth doing.",
  },
  {
    num: "II",
    label: "Architecture",
    body: "I write a one-page brief covering the stack, data model, integrations and edges. We both sign off before any code is written.",
  },
  {
    num: "III",
    label: "Build",
    body: "Daily commits to a private staging URL. You can check progress whenever you want; I'll demo on Friday.",
  },
  {
    num: "IV",
    label: "Polish",
    body: "Motion, microcopy, edge cases, performance. The part that takes a working app and makes it feel finished.",
  },
  {
    num: "V",
    label: "Handover",
    body: "Docs, runbooks, deploy keys, and a walkthrough call so your team can actually maintain it after I'm gone.",
  },
];

// Live deployed projects. Update `url` if domains change.
export const WORK = [
  {
    num: "01",
    client: "Northfield Cafe & Jesse James Bar",
    type: "Cafe · Bar · Live Music",
    year: "2026",
    url: "https://northfield-cafe.rautaljesh.workers.dev/",
    image: "/work/northfield.png",
    summary: "Editorial site for a Thamel cafe & bar — garden courtyard, menu, live-music calendar and WhatsApp reservation flow.",
    stack: ["React", "Tailwind", "Cloudflare Workers"],
  },
  {
    num: "02",
    client: "Atlantic Seafood & Bar",
    type: "Restaurant · Reservations",
    year: "2026",
    url: "https://atlantic-seafood.rautaljesh.workers.dev/",
    image: "/work/atlantic.png",
    summary: "Premium seafood restaurant site — photographic gallery, menu, location and table reservation via WhatsApp.",
    stack: ["React", "Tailwind", "Cloudflare Workers"],
  },
  {
    num: "03",
    client: "Roadhouse",
    type: "Italian Restaurant · Branches",
    year: "2026",
    url: "https://roadhouse-cafe.rautaljesh.workers.dev/",
    image: "/work/roadhouse.png",
    summary: "Wood-fired pizza & Italian cuisine — multi-branch site with branch selector, menu, online ordering and cart.",
    stack: ["React", "Tailwind", "Cloudflare Workers"],
  },
  {
    num: "04",
    client: "Nepali Chulo",
    type: "Heritage Dining · Cultural Show",
    year: "2026",
    url: "https://nepali-chulo.rautaljesh.workers.dev/",
    image: "/work/nepali-chulo.png",
    summary: "200-year-old Rana palace dining experience — candlelit haveli, cultural shows, story chapter and reservations.",
    stack: ["React", "Tailwind", "Cloudflare Workers"],
  },
  {
    num: "05",
    client: "Athlete Land",
    type: "Premium Fitness · Gym",
    year: "2026",
    url: "https://athlete-land.rautaljesh.workers.dev/",
    image: "/work/athlete-land.png",
    summary: "Premium Kathmandu gym — membership tiers, transformation stories, trainer profiles and class booking.",
    stack: ["React", "Tailwind", "Cloudflare Workers"],
  },
  {
    num: "06",
    client: "SkinCura",
    type: "Skincare · Brand & Consults",
    year: "2026",
    url: "https://skincura.pages.dev/",
    image: "/work/skincura.png",
    summary: "Editorial skincare brand site — expert dermatology and aesthetic care, product catalogue and consultation booking flow.",
    stack: ["React", "Tailwind", "Cloudflare Pages"],
  },
  {
    num: "07",
    client: "Angel Hair Braids",
    type: "Salon · Booking",
    year: "2026",
    url: "https://angelhairbraids.pages.dev/",
    image: "/work/angelhairbraids.png",
    summary: "The art of braiding — salon brand site with services, hair-care guide, gallery, testimonials and online appointment booking.",
    stack: ["React", "Tailwind", "Cloudflare Pages"],
  },
  {
    num: "08",
    client: "Fitness Durbar",
    type: "Premium Fitness · Gym",
    year: "2026",
    url: "https://fitnessdurbar.com.np/",
    image: "/work/fitnessdurbar.png",
    summary: "Premium Hattiban gym — membership tiers, certified coaching, group classes (HIIT, boxing, Zumba, yoga) and a free intro session via WhatsApp.",
    stack: ["React", "Tailwind", "Cloudflare Pages"],
  },
  {
    num: "09",
    client: "Shakti X Gym & Fitness",
    type: "Strength & Conditioning · Gym",
    year: "2026",
    url: "https://shaktixgym.com.np/",
    image: "/work/shaktixgym.png",
    summary: "Results-driven Gongabu strength gym — programs, founder-coach profiles, transformation gallery, membership plans and free consultation booking.",
    stack: ["React", "Tailwind", "Cloudflare Pages"],
  },
];

export const STATS = [
  { num: "12+", label: "Projects shipped & live" },
  { num: "2026", label: "Freelancing since" },
  { num: "Solo / Team", label: "Open to either" },
  { num: "BCA · TU", label: "Bachelor in Computer Application" },
];

export const FAQS = [
  {
    q: "How do we start?",
    a: "A 30-minute discovery call — free, no pitch. If we're a fit, you receive a one-page proposal within 48 hours: scope, milestones, deliverables, timeline and a fixed price. No surprises, no padded retainers.",
  },
  {
    q: "What does a typical engagement look like?",
    a: "Two to ten weeks, depending on scope. Daily commits to a private staging URL so you watch the product grow in real time. A Friday demo each week. A single Slack or WhatsApp thread for the whole engagement — no scattered emails, no status meetings that should have been a Loom.",
  },
  {
    q: "How do meetings work?",
    a: "Lightweight by design. One 30-minute kick-off, then weekly 20-minute Friday demos over Google Meet or Zoom. Mid-week communication is async — Loom videos, screenshots, and a single thread. If something is genuinely blocking, we hop on a call within hours; otherwise async wins.",
  },
  {
    q: "What documentation do I receive?",
    a: "Everything you need to own the product after handover: a one-page architecture brief, an environment & deployment runbook, a credentials handover (1Password / Bitwarden), an admin walkthrough video, and inline code comments where decisions were non-obvious. Your team should never feel they inherited a black box.",
  },
  {
    q: "How do payments work — pre-pay or post-pay?",
    a: "A simple split. 50% on signed proposal (kicks off the build), 50% on handover before deploy keys transfer. For longer engagements (6+ weeks) we move to milestone-based: 30% kick-off, 40% mid-build demo, 30% on handover. Invoices via Stripe, Wise, or bank transfer (NPR / USD / EUR).",
  },
  {
    q: "Do you take equity instead of cash?",
    a: "Occasionally — for a narrow class of pre-seed founders solving a problem I find serious, with a credible team. Approach with context: deck, founding team, what's been built, why now. Most engagements remain straightforward fee-for-work.",
  },
  {
    q: "Do you work solo, or with a team?",
    a: "Both. I freelance independently and as part of Bitmicrosys LLC — taking on engineering work for international clients. SEO, AEO, GEO and original blog writing are my own craft, published live at 1kReach.com. For most product builds I lead end-to-end as the responsible developer; for bigger scopes I bring in trusted designers and a copywriter from the bench. You get a single point of accountability either way.",
  },
  {
    q: "Where are you based, and what hours?",
    a: "Kathmandu, Nepal (UTC+5:45). I overlap comfortably with EU mornings and US evenings, and reply within hours — typically minutes during business windows. Status: Open · 24/7 means urgent issues get an answer the same day, not the next business day.",
  },
];
