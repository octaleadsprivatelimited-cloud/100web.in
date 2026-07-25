import cloudArt from "../assets/cloud-infra-art.jpg";
import aiArt from "../assets/ai-ml-art.jpg";
import dataArt from "../assets/data-eng-art.jpg";
import websiteArt from "../assets/website-dev-art.jpg";
import mobileArt from "../assets/mobile-app-art.jpg";
import crmArt from "../assets/crm-art.jpg";
import seoArt from "../assets/seo-art.jpg";
import marketingArt from "../assets/digital-marketing-art.jpg";
import devopsArt from "../assets/cloud-devops-art.jpg";

export type Service = {
  slug: string;
  badge: string;
  image: string;
  title: string;
  desc: string;
  tagline: string;
  overview: string;
  benefits: { title: string; desc: string }[];
  offerings: string[];
  challenges?: { title: string; desc: string }[];
  process?: { step: string; title: string; desc: string }[];
  deliverables?: string[];
  techStack?: string[];
  stats?: { value: string; label: string }[];
  faqs?: { q: string; a: string }[];
  idealFor?: string[];
};

export const services: Service[] = [
  {
    slug: "cloud-infrastructure",
    badge: "Cloud",
    image: cloudArt,
    title: "Cloud Infrastructure: Scale without limits",
    desc: "Build secure, resilient environments on AWS, Azure, and GCP — designed for performance, cost, and uptime.",
    tagline: "Enterprise-grade cloud, engineered for scale.",
    overview:
      "We architect, migrate and operate cloud platforms on AWS, Azure and Google Cloud — with security, resilience and cost efficiency built in from day one.",
    benefits: [
      { title: "99.99% uptime", desc: "Multi-region, self-healing architectures with automated failover." },
      { title: "Cost optimized", desc: "Right-sized workloads, reserved capacity and continuous FinOps reviews." },
      { title: "Secure by default", desc: "Zero-trust networking, encryption everywhere and continuous compliance." },
      { title: "Global reach", desc: "Deploy in 30+ regions with low-latency edge delivery." },
    ],
    offerings: [
      "Cloud migration & modernization",
      "Landing zone & multi-account setup",
      "Kubernetes & container platforms",
      "Disaster recovery & backup",
      "24×7 managed cloud operations",
    ],
    idealFor: ["Enterprises modernizing legacy data centers", "SaaS platforms scaling globally", "Regulated industries needing compliance"],
    challenges: [
      { title: "Runaway cloud spend", desc: "Idle resources, oversized instances and untagged workloads inflate bills by 30–60%." },
      { title: "Fragile deployments", desc: "Manual changes and snowflake servers cause outages and painful rollbacks." },
      { title: "Security drift", desc: "Public buckets, open ports and stale IAM policies expand the attack surface silently." },
      { title: "Vendor lock-in", desc: "Proprietary services make future migrations expensive and slow." },
    ],
    process: [
      { step: "01", title: "Assess", desc: "Cloud readiness audit, workload inventory and TCO baseline across your current stack." },
      { step: "02", title: "Architect", desc: "Well-Architected landing zone, network topology, security guardrails and cost budgets." },
      { step: "03", title: "Migrate", desc: "Wave-based lift-shift-optimize with automated tooling and zero-downtime cutovers." },
      { step: "04", title: "Operate", desc: "24×7 monitoring, incident response, FinOps reviews and continuous optimization." },
    ],
    deliverables: [
      "Cloud architecture blueprint & runbooks",
      "Terraform/CloudFormation IaC repository",
      "Landing zone with security guardrails",
      "Cost & performance dashboards",
      "Disaster recovery plan with tested RTO/RPO",
      "Handover documentation & team training",
    ],
    techStack: ["AWS", "Azure", "Google Cloud", "Terraform", "Kubernetes", "Docker", "Ansible", "Datadog", "CloudWatch"],
    stats: [
      { value: "40%", label: "Average cloud cost saved" },
      { value: "99.99%", label: "Uptime SLA delivered" },
      { value: "3×", label: "Faster provisioning" },
      { value: "50+", label: "Migrations shipped" },
    ],
    faqs: [
      { q: "Which cloud provider is right for us?", a: "We're multi-cloud certified and recommend based on your workloads, existing contracts and compliance needs — not vendor bias." },
      { q: "Can you migrate without downtime?", a: "Yes. We use blue/green cutovers, database replication and wave-based migration to keep production live throughout." },
      { q: "Do you handle post-launch operations?", a: "We offer 24×7 managed operations with defined SLAs, incident response and monthly FinOps reviews." },
      { q: "How quickly can we see cost savings?", a: "Most clients see 20–30% reduction within the first 60 days through right-sizing and reserved capacity." },
    ],
  },
  {
    slug: "ai-ml",
    badge: "AI & Machine Learning",
    image: aiArt,
    title: "AI & ML: Power intelligent applications",
    desc: "Deploy custom models, LLM integrations, and AI agents that turn your data into a competitive advantage.",
    tagline: "Turn your data into intelligent products.",
    overview:
      "From LLM copilots to computer vision and forecasting, we design and deploy AI systems that deliver measurable business outcomes — safely and at scale.",
    benefits: [
      { title: "Custom LLM apps", desc: "RAG, agents and copilots grounded in your private data." },
      { title: "Faster decisions", desc: "Forecasting and recommendations that beat human baselines." },
      { title: "Responsible AI", desc: "Guardrails, evaluation and governance built into every model." },
      { title: "Production ready", desc: "MLOps pipelines for training, deployment and monitoring." },
    ],
    offerings: [
      "LLM & generative AI applications",
      "Predictive analytics & forecasting",
      "Computer vision & document AI",
      "MLOps & model monitoring",
      "AI strategy & proof-of-concept",
    ],
    idealFor: ["Teams sitting on unused data", "Product leaders adding AI features", "Ops teams automating manual review"],
    challenges: [
      { title: "Hallucinations & hype", desc: "Off-the-shelf LLMs invent facts without grounding, retrieval and evaluation in place." },
      { title: "Data readiness gaps", desc: "Models fail without clean, labelled and access-controlled training data." },
      { title: "Pilot purgatory", desc: "POCs stall because there's no MLOps path to production." },
      { title: "Cost & latency", desc: "Naive LLM calls balloon costs and slow user experiences." },
    ],
    process: [
      { step: "01", title: "Discover", desc: "Use-case workshops, feasibility scoring and ROI modelling before a line of code." },
      { step: "02", title: "Prototype", desc: "2–4 week POC with real data, evaluation harness and stakeholder demo." },
      { step: "03", title: "Productionize", desc: "MLOps pipeline, guardrails, monitoring, human-in-the-loop and A/B testing." },
      { step: "04", title: "Improve", desc: "Continuous evaluation, retraining and prompt/model iteration on live traffic." },
    ],
    deliverables: [
      "AI opportunity map & prioritized roadmap",
      "Production-ready model or LLM application",
      "Evaluation & red-teaming harness",
      "MLOps pipeline (training → deploy → monitor)",
      "Prompt / model version registry",
      "Governance policy & responsible-AI playbook",
    ],
    techStack: ["OpenAI", "Anthropic", "Llama", "LangChain", "LlamaIndex", "Pinecone", "PyTorch", "TensorFlow", "MLflow", "SageMaker"],
    stats: [
      { value: "60%", label: "Manual work automated" },
      { value: "4×", label: "Faster time-to-insight" },
      { value: "30+", label: "AI systems shipped" },
      { value: "95%", label: "Model uptime" },
    ],
    faqs: [
      { q: "Do we need our own data to start?", a: "Helpful but not required — many use cases start with public or synthetic data and layer in your data via RAG." },
      { q: "How do you prevent hallucinations?", a: "Retrieval grounding, structured outputs, evaluation datasets and human-in-the-loop checks for critical flows." },
      { q: "Will our data be used to train public models?", a: "No. We use enterprise APIs with data-usage opt-outs, or deploy open-source models in your own cloud." },
      { q: "What's a realistic AI POC timeline?", a: "2–4 weeks for a validated prototype, 8–12 weeks to a production rollout for most scoped use cases." },
    ],
  },
  {
    slug: "data-engineering",
    badge: "Data Engineering",
    image: dataArt,
    title: "Data Engineering: Insight-ready pipelines",
    desc: "Modern data lakes, warehouses, and real-time pipelines that deliver clean, actionable data for every team.",
    tagline: "Clean, trusted data for every decision.",
    overview:
      "We build modern data platforms — lakes, warehouses and streaming pipelines — that unify your data and make it insight-ready across the organization.",
    benefits: [
      { title: "Single source of truth", desc: "Unified data models across every business system." },
      { title: "Real-time streams", desc: "Sub-second pipelines for operational analytics." },
      { title: "Governed & compliant", desc: "Lineage, quality checks and access controls throughout." },
      { title: "Self-serve BI", desc: "Empower every team with reliable dashboards." },
    ],
    offerings: [
      "Data lake & warehouse (Snowflake, BigQuery, Databricks)",
      "ETL / ELT pipelines",
      "Real-time streaming (Kafka, Kinesis)",
      "Data governance & quality",
      "BI & analytics enablement",
    ],
    idealFor: ["Companies with data in 10+ tools", "Analytics teams blocked on data", "Product teams needing event pipelines"],
    challenges: [
      { title: "Conflicting numbers", desc: "Every team reports a different revenue figure because definitions and sources disagree." },
      { title: "Brittle pipelines", desc: "Overnight jobs break silently and dashboards are stale by morning." },
      { title: "No lineage", desc: "Nobody can trace where a metric came from or who changed it." },
      { title: "Slow analytics", desc: "Queries take hours; analysts wait on engineers for every request." },
    ],
    process: [
      { step: "01", title: "Map", desc: "Source inventory, data-flow diagram and metric dictionary agreed with the business." },
      { step: "02", title: "Model", desc: "Warehouse schema, dbt models and semantic layer for a single source of truth." },
      { step: "03", title: "Pipeline", desc: "Ingestion, transformation, testing and orchestration with alerts and SLAs." },
      { step: "04", title: "Enable", desc: "BI dashboards, self-serve tooling and team training so analytics scales." },
    ],
    deliverables: [
      "Modern data platform (lake + warehouse)",
      "dbt models with tests and documentation",
      "Orchestrated ETL/ELT pipelines",
      "Real-time streaming where required",
      "Governance, lineage & access controls",
      "Executive & operational dashboards",
    ],
    techStack: ["Snowflake", "BigQuery", "Databricks", "dbt", "Airflow", "Kafka", "Fivetran", "Airbyte", "Looker", "Tableau"],
    stats: [
      { value: "10×", label: "Faster reporting cycles" },
      { value: "99%", label: "Pipeline reliability" },
      { value: "80%", label: "Less analyst wait time" },
      { value: "100+", label: "Data sources integrated" },
    ],
    faqs: [
      { q: "Warehouse or lakehouse?", a: "It depends on data volume, ML needs and existing skills — we recommend after a short assessment, no dogma." },
      { q: "Do we need real-time data?", a: "Only for use cases that act on it. We start with batch and add streaming where it moves a real KPI." },
      { q: "How do you ensure data quality?", a: "dbt tests, freshness checks, anomaly detection and clear ownership per dataset." },
      { q: "Can you work with our existing BI tools?", a: "Yes — we integrate with Looker, Tableau, Power BI, Metabase and Superset." },
    ],
  },
  {
    slug: "website-development",
    badge: "Website Development",
    image: websiteArt,
    title: "Website Development: Fast, modern web experiences",
    desc: "Responsive, high-performance websites and web apps built with modern frameworks and clean architecture.",
    tagline: "Websites that load fast and convert better.",
    overview:
      "We design and engineer modern, responsive websites and web apps using React, Next.js and headless CMS platforms — optimized for speed, SEO and conversions.",
    benefits: [
      { title: "Lightning fast", desc: "Sub-second load times with Core Web Vitals in the green." },
      { title: "Fully responsive", desc: "Beautiful across mobile, tablet and desktop." },
      { title: "SEO ready", desc: "Semantic markup, structured data and clean URLs baked in." },
      { title: "Easy to update", desc: "Headless CMS so your team owns content, not tickets." },
    ],
    offerings: [
      "Marketing websites & landing pages",
      "Web applications & portals",
      "Headless CMS integration",
      "E-commerce storefronts",
      "Website redesign & migration",
    ],
    idealFor: ["Brands relaunching a marketing site", "Startups shipping their first web app", "Businesses migrating off WordPress/Wix"],
    challenges: [
      { title: "Slow page speed", desc: "Heavy themes and unoptimized images tank Core Web Vitals and search rankings." },
      { title: "Design-dev gap", desc: "Beautiful mockups ship as pixel-imperfect builds that break on mobile." },
      { title: "Content bottleneck", desc: "Every copy tweak needs a developer, so the site goes stale fast." },
      { title: "Poor conversions", desc: "Traffic doesn't convert because pages aren't built for the funnel." },
    ],
    process: [
      { step: "01", title: "Discover", desc: "Goals, audience, brand and competitor teardown — plus a conversion audit if you have live traffic." },
      { step: "02", title: "Design", desc: "Wireframes, high-fidelity mockups and a component-based design system in Figma." },
      { step: "03", title: "Build", desc: "Next.js/React build with headless CMS, accessibility and SEO baked in from commit one." },
      { step: "04", title: "Launch & iterate", desc: "QA, migration, launch and post-launch A/B testing for continuous conversion lifts." },
    ],
    deliverables: [
      "Responsive marketing site or web app",
      "Component-based design system in Figma",
      "Headless CMS setup with editor training",
      "SEO foundation (schema, sitemap, meta, redirects)",
      "Analytics & conversion tracking",
      "Post-launch support and iteration plan",
    ],
    techStack: ["React", "Next.js", "TypeScript", "Tailwind", "Sanity", "Contentful", "Shopify", "Vercel", "Cloudflare"],
    stats: [
      { value: "0.9s", label: "Median load time" },
      { value: "90+", label: "Lighthouse score" },
      { value: "2×", label: "Conversion lift vs. legacy" },
      { value: "150+", label: "Sites shipped" },
    ],
    faqs: [
      { q: "How long does a website project take?", a: "Marketing sites: 4–8 weeks. Web apps: 10–16 weeks. We share weekly demos so you always see progress." },
      { q: "Do you provide copywriting?", a: "Yes — we have in-house strategists and copywriters, or we collaborate with your team." },
      { q: "Can we edit the site ourselves?", a: "Absolutely. We ship a headless CMS with clear editor training and a component library." },
      { q: "What about SEO and Core Web Vitals?", a: "Both are non-negotiables in our builds — we ship in the green on every project." },
    ],
  },
  {
    slug: "mobile-app-development",
    badge: "Mobile App Development",
    image: mobileArt,
    title: "Mobile Apps: iOS, Android & cross-platform",
    desc: "Native and cross-platform mobile apps engineered for performance, engagement, and scalable growth.",
    tagline: "Mobile products your users love to open.",
    overview:
      "We build native iOS, Android and cross-platform apps with React Native and Flutter — from prototype to App Store, with the backend, analytics and DevOps to match.",
    benefits: [
      { title: "Native performance", desc: "Smooth 60fps experiences on every device." },
      { title: "One codebase", desc: "Ship iOS and Android in parallel with React Native / Flutter." },
      { title: "Offline-first", desc: "Reliable sync and caching for real-world networks." },
      { title: "Store-ready", desc: "We handle submission, review and post-launch updates." },
    ],
    offerings: [
      "iOS & Android native apps",
      "React Native & Flutter apps",
      "Backend APIs & realtime sync",
      "In-app analytics & experimentation",
      "App store launch & maintenance",
    ],
    idealFor: ["Startups launching an MVP", "Enterprises building internal apps", "D2C brands adding a mobile channel"],
    challenges: [
      { title: "Two codebases, two teams", desc: "Separate iOS and Android teams double cost and slow every feature." },
      { title: "App store rejections", desc: "Guideline violations and privacy issues stall launches by weeks." },
      { title: "Poor retention", desc: "Users install once, never return — onboarding, push and analytics are missing." },
      { title: "Backend afterthought", desc: "APIs and sync layers built late become the biggest bottleneck." },
    ],
    process: [
      { step: "01", title: "Define", desc: "Product discovery, user journeys and technical architecture before a single screen is built." },
      { step: "02", title: "Design", desc: "Native-feel UX/UI following iOS HIG and Material guidelines, prototyped in Figma." },
      { step: "03", title: "Build", desc: "React Native or native builds, backend APIs, CI/CD and TestFlight/Play internal testing." },
      { step: "04", title: "Launch & grow", desc: "Store submission, review support, crash monitoring and monthly release trains." },
    ],
    deliverables: [
      "Published iOS and Android app",
      "Backend APIs with realtime sync",
      "Design system & component library",
      "Analytics & crash reporting",
      "Push notifications & deep linking",
      "App store optimization assets",
    ],
    techStack: ["React Native", "Flutter", "Swift", "Kotlin", "Expo", "PostgreSQL", "Sentry", "AppsFlyer"],
    stats: [
      { value: "60fps", label: "Smooth on entry devices" },
      { value: "4.7★", label: "Average store rating" },
      { value: "40%", label: "Higher day-30 retention" },
      { value: "80+", label: "Apps in the stores" },
    ],
    faqs: [
      { q: "React Native or native?", a: "React Native for 90% of apps — faster and cheaper. Native when you need heavy hardware, AR/VR or extreme performance." },
      { q: "Do you handle store submission?", a: "Yes — end-to-end, including review responses, screenshots, ASO copy and post-launch updates." },
      { q: "How do you handle backend?", a: "We design and build the backend alongside the app—usually with PostgreSQL and a custom Node or Go service layer." },
      { q: "What about ongoing maintenance?", a: "Monthly retainers cover OS updates, bug fixes, small features and store compliance." },
    ],
  },
  {
    slug: "crm-solutions",
    badge: "CRM Solutions",
    image: crmArt,
    title: "CRM Solutions: Customer relationships at scale",
    desc: "Custom CRM platforms, integrations, and automation that streamline sales, support, and retention.",
    tagline: "One view of every customer, everywhere.",
    overview:
      "We implement, customize and integrate CRM platforms — Salesforce, HubSpot, Zoho and custom builds — so sales, marketing and support work from one shared source of truth.",
    benefits: [
      { title: "360° customer view", desc: "Unify every touchpoint across sales, support and marketing." },
      { title: "Automated workflows", desc: "Cut manual work with rules, playbooks and AI assist." },
      { title: "Deep integrations", desc: "Connect billing, telephony, email and your data warehouse." },
      { title: "Actionable reporting", desc: "Pipeline, retention and forecast dashboards that leaders trust." },
    ],
    offerings: [
      "Salesforce, HubSpot & Zoho implementation",
      "Custom CRM development",
      "Sales & marketing automation",
      "Third-party & telephony integrations",
      "CRM migration & data cleanup",
    ],
    idealFor: ["Sales teams outgrowing spreadsheets", "Companies consolidating multiple CRMs", "Ops leaders automating repetitive work"],
    challenges: [
      { title: "Dirty data", desc: "Duplicates, missing fields and stale contacts kill trust in the CRM." },
      { title: "Low adoption", desc: "Reps skip logging activity because the CRM is slower than a spreadsheet." },
      { title: "Disconnected tools", desc: "Marketing, sales and support each work from different systems." },
      { title: "Reporting blind spots", desc: "Leaders can't forecast because pipeline data is inconsistent." },
    ],
    process: [
      { step: "01", title: "Audit", desc: "Current-state review of tools, data, workflows and reporting gaps." },
      { step: "02", title: "Design", desc: "Object model, sales stages, automation rules and integration blueprint." },
      { step: "03", title: "Implement", desc: "Configure or build, migrate cleaned data, connect systems and train users." },
      { step: "04", title: "Optimize", desc: "Iterate on adoption, automation and dashboards with monthly reviews." },
    ],
    deliverables: [
      "Configured CRM tailored to your process",
      "Cleaned & migrated customer data",
      "Sales & marketing automation workflows",
      "Integrations with billing, email, telephony",
      "Pipeline & forecast dashboards",
      "User training & enablement kit",
    ],
    techStack: ["Salesforce", "HubSpot", "Zoho", "Pipedrive", "Zapier", "Segment", "Twilio", "Slack", "Outreach"],
    stats: [
      { value: "3×", label: "Faster deal cycles" },
      { value: "90%", label: "Rep adoption rate" },
      { value: "25%", label: "Higher win rate" },
      { value: "60+", label: "CRM rollouts" },
    ],
    faqs: [
      { q: "Which CRM should we use?", a: "Depends on team size, deal complexity and budget — we recommend after a short discovery, no vendor bias." },
      { q: "Can you migrate from our current CRM?", a: "Yes — we've migrated from Salesforce, HubSpot, Zoho, Pipedrive and homegrown systems with zero data loss." },
      { q: "Do you build custom CRMs?", a: "When off-the-shelf doesn't fit, we build custom on modern stacks with the same automation and reporting depth." },
      { q: "How do you drive adoption?", a: "Rep-first design, weekly office hours, dashboards leadership actually uses and automation that saves time from day one." },
    ],
  },
  {
    slug: "seo",
    badge: "SEO",
    image: seoArt,
    title: "SEO: Rank higher, get found faster",
    desc: "Technical SEO audits, content strategy, and analytics that improve visibility and drive qualified traffic.",
    tagline: "Organic traffic that compounds every month.",
    overview:
      "We combine technical SEO, content strategy and authority building to grow qualified organic traffic — with transparent reporting on rankings, traffic and revenue.",
    benefits: [
      { title: "Technical foundation", desc: "Fast, crawlable sites with clean architecture and schema." },
      { title: "Content that ranks", desc: "Topic clusters mapped to real search intent." },
      { title: "Authority building", desc: "Ethical link outreach and digital PR." },
      { title: "Clear reporting", desc: "Rankings, traffic and revenue impact — no vanity metrics." },
    ],
    offerings: [
      "Technical SEO audits",
      "On-page optimization",
      "Content & keyword strategy",
      "Link building & digital PR",
      "Local & international SEO",
    ],
    idealFor: ["Sites hit by algorithm updates", "B2B SaaS scaling content", "Local businesses competing in maps"],
    challenges: [
      { title: "Flat organic traffic", desc: "Rankings plateau and paid channels swallow the entire growth budget." },
      { title: "Technical debt", desc: "Crawl errors, duplicate content and slow pages block search visibility." },
      { title: "Thin content", desc: "Pages don't match search intent, so they never rank or convert." },
      { title: "Weak authority", desc: "Few quality backlinks and no digital PR to build domain trust." },
    ],
    process: [
      { step: "01", title: "Audit", desc: "Technical, on-page, content and backlink audit with a prioritized fix list." },
      { step: "02", title: "Strategy", desc: "Keyword universe, topic clusters and content calendar aligned to revenue." },
      { step: "03", title: "Execute", desc: "Ship technical fixes, publish content, build links and monitor weekly." },
      { step: "04", title: "Report", desc: "Monthly rankings, traffic, leads and revenue dashboards — no vanity metrics." },
    ],
    deliverables: [
      "Full technical SEO audit",
      "Keyword & topic-cluster map",
      "Content briefs & editorial calendar",
      "On-page & schema optimization",
      "Backlink & digital PR outreach",
      "Monthly performance dashboard",
    ],
    techStack: ["Ahrefs", "Semrush", "Google Search Console", "GA4", "Screaming Frog", "Surfer", "Clearscope", "Looker Studio"],
    stats: [
      { value: "3×", label: "Organic traffic in 6 months" },
      { value: "70%", label: "Keywords on page 1" },
      { value: "5×", label: "Return vs. paid channels" },
      { value: "120+", label: "SEO engagements" },
    ],
    faqs: [
      { q: "How long until we see results?", a: "Technical wins land in weeks. Content and links typically show meaningful ranking lift in 3–6 months." },
      { q: "Do you guarantee rankings?", a: "No credible agency guarantees rankings — Google forbids it. We do commit to process, transparency and revenue impact." },
      { q: "White-hat only?", a: "Always. We build the kind of authority that survives every core update." },
      { q: "Can you work alongside our content team?", a: "Yes — we can execute end-to-end or provide briefs and edits for your writers." },
    ],
  },
  {
    slug: "digital-marketing",
    badge: "Digital Marketing",
    image: marketingArt,
    title: "Digital Marketing: Growth that converts",
    desc: "Data-driven campaigns across search, social, and paid channels to generate leads and revenue.",
    tagline: "Campaigns measured in pipeline, not clicks.",
    overview:
      "Full-funnel digital marketing across paid search, social, display and email — designed, launched and optimized to hit real revenue targets.",
    benefits: [
      { title: "Full-funnel strategy", desc: "From awareness to conversion, optimized end-to-end." },
      { title: "Performance driven", desc: "Every dollar tied to a CPA, ROAS or pipeline number." },
      { title: "Creative that works", desc: "Ad creative and landing pages tested continuously." },
      { title: "Unified attribution", desc: "Know which channels actually drive revenue." },
    ],
    offerings: [
      "Paid search (Google, Bing)",
      "Paid social (Meta, LinkedIn, TikTok)",
      "Email & lifecycle marketing",
      "Conversion rate optimization",
      "Analytics & attribution",
    ],
    idealFor: ["Brands scaling paid acquisition", "B2B teams generating pipeline", "E-commerce chasing profitable ROAS"],
    challenges: [
      { title: "Rising CAC", desc: "Ad costs climb while conversion rates flatten across every channel." },
      { title: "Attribution chaos", desc: "iOS 14, cookie loss and multi-touch journeys blur what's actually working." },
      { title: "Creative fatigue", desc: "Ads stop performing after 2 weeks without a fresh creative pipeline." },
      { title: "Leaky funnels", desc: "Traffic lands on generic pages and bounces before converting." },
    ],
    process: [
      { step: "01", title: "Baseline", desc: "Account audit, funnel analysis and revenue model before any spend changes." },
      { step: "02", title: "Plan", desc: "Channel mix, creative brief, landing pages and measurement plan." },
      { step: "03", title: "Launch", desc: "Campaigns live, creative in rotation, A/B tests running and daily monitoring." },
      { step: "04", title: "Scale", desc: "Weekly optimization sprints, creative refresh and budget shifting to winners." },
    ],
    deliverables: [
      "Full-funnel campaign strategy",
      "Creative assets (static, video, UGC)",
      "Optimized landing pages",
      "Server-side tracking & attribution model",
      "Weekly optimization & reporting cadence",
      "Monthly executive readout",
    ],
    techStack: ["Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads", "GA4", "Segment", "HubSpot", "Klaviyo", "Hotjar"],
    stats: [
      { value: "2.5×", label: "Blended ROAS lift" },
      { value: "-35%", label: "Cost per lead" },
      { value: "200+", label: "Campaigns managed" },
      { value: "$20M+", label: "Ad spend optimized" },
    ],
    faqs: [
      { q: "What's the minimum ad budget?", a: "We typically start engagements at $10K/mo in ad spend to gather statistically meaningful signals." },
      { q: "Do you produce creative?", a: "Yes — static, video and UGC creative production is included in most retainers." },
      { q: "How do you report performance?", a: "Live dashboard plus a weekly written recap and monthly executive readout tied to revenue." },
      { q: "Which channels first?", a: "Whichever hits your CAC and payback targets — usually a mix of intent (Search) and demand-gen (Meta/LinkedIn)." },
    ],
  },
  {
    slug: "cloud-devops",
    badge: "Cloud DevOps",
    image: devopsArt,
    title: "Cloud DevOps: Ship faster with confidence",
    desc: "CI/CD pipelines, infrastructure as code, and observability that accelerate releases and reduce incidents.",
    tagline: "Ship more, break less.",
    overview:
      "We build the CI/CD, infrastructure-as-code and observability stack your engineering team needs to ship faster, safer and with fewer incidents.",
    benefits: [
      { title: "Faster releases", desc: "From weekly to many-times-a-day with automated pipelines." },
      { title: "Infra as code", desc: "Terraform and Pulumi for reproducible environments." },
      { title: "Full observability", desc: "Logs, metrics and traces unified across services." },
      { title: "Fewer incidents", desc: "SLOs, runbooks and on-call practices that actually work." },
    ],
    offerings: [
      "CI/CD pipeline engineering",
      "Kubernetes & container platforms",
      "Infrastructure as code (Terraform)",
      "Observability (logs, metrics, traces)",
      "SRE & incident response",
    ],
    idealFor: ["Engineering teams shipping weekly (or slower)", "Startups scaling past 10 engineers", "Enterprises adopting Kubernetes"],
    challenges: [
      { title: "Slow releases", desc: "Manual deploys, long QA cycles and release-day fire drills." },
      { title: "Environment drift", desc: "Staging and prod diverge, so 'works on staging' means little." },
      { title: "Alert fatigue", desc: "Noisy monitors bury the signals that actually matter." },
      { title: "No on-call playbook", desc: "Every incident is a fresh scramble instead of a rehearsed response." },
    ],
    process: [
      { step: "01", title: "Assess", desc: "Delivery, infra and observability audit with DORA metrics baseline." },
      { step: "02", title: "Automate", desc: "CI/CD pipelines, IaC and reproducible environments across the SDLC." },
      { step: "03", title: "Observe", desc: "Unified logs, metrics, traces and SLOs tied to user experience." },
      { step: "04", title: "Operate", desc: "On-call rotations, runbooks and blameless postmortems that compound reliability." },
    ],
    deliverables: [
      "CI/CD pipelines with automated tests",
      "Terraform / Pulumi IaC repository",
      "Kubernetes / container platform",
      "Observability stack with SLOs & alerts",
      "On-call rotation & incident runbooks",
      "DORA metrics dashboard",
    ],
    techStack: ["Terraform", "Kubernetes", "GitHub Actions", "ArgoCD", "Helm", "Datadog", "Grafana", "Prometheus", "PagerDuty"],
    stats: [
      { value: "10×", label: "Deploy frequency" },
      { value: "-70%", label: "Change failure rate" },
      { value: "<15m", label: "Mean time to recover" },
      { value: "40+", label: "Platforms built" },
    ],
    faqs: [
      { q: "Do we need Kubernetes?", a: "Only if your workloads justify it. We often start with managed containers (ECS, Cloud Run) and adopt K8s when scale requires." },
      { q: "Can you work with our existing tools?", a: "Yes — we're pragmatic about GitHub/GitLab, Jenkins, ArgoCD, Datadog, New Relic and more." },
      { q: "How fast can we improve deploy frequency?", a: "Most teams move from weekly to daily deploys within 8–12 weeks of pipeline work." },
      { q: "Do you provide on-call coverage?", a: "Yes — 24×7 SRE-as-a-service is available as a retainer with defined SLAs." },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
