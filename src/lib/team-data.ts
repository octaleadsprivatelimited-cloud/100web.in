export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  department: string;
  location: string;
  bio: string;
  longBio: string;
  linkedin: string;
  email: string;
  experienceYears: number;
  skills: string[];
  experience: { company: string; title: string; period: string; description: string }[];
  education: { school: string; degree: string; period: string }[];
  achievements: string[];
  videoUrl?: string;
  avatarInitials: string;
  avatarUrl?: string;
  accent: string; // tailwind gradient classes
};

export const team: TeamMember[] = [
  {
    slug: "eswar",
    name: "Eswar",
    role: "Founder & CEO",
    department: "Leadership",
    location: "Hyderabad, India",
    bio: "Visionary founder leading 100 Web Technologies from idea to impact.",
    longBio:
      "Eswar founded 100 Web Technologies with a mission to make world-class digital solutions accessible to every business. He sets the company’s vision, builds strategic partnerships, and ensures every team delivers measurable value to clients.",
    linkedin: "https://www.linkedin.com/in/",
    email: "eswar@100web.in",
    experienceYears: 10,
    skills: ["Business Strategy", "Product Vision", "Client Relations", "Team Building"],
    experience: [
      { company: "100 Web Technologies", title: "Founder & CEO", period: "2018 — Present", description: "Built the agency from scratch and scaled it into a trusted technology partner for global clients." },
      { company: "Tech Startup", title: "Product Lead", period: "2014 — 2018", description: "Led product development and go-to-market strategy for a SaaS platform." },
      { company: "Digital Agency", title: "Business Analyst", period: "2012 — 2014", description: "Drove client discovery and solution design for enterprise web projects." },
    ],
    education: [
      { school: "Osmania University", degree: "B.Tech, Computer Science", period: "2008 — 2012" },
    ],
    achievements: [
      "Founded 100 Web Technologies",
      "Onboarded 100+ active clients",
      "Built a 50+ member delivery team",
    ],
    avatarInitials: "E",
    accent: "from-indigo-500 via-blue-500 to-cyan-500",
  },
  {
    slug: "ravi-sankar",
    name: "Ravi Sankar",
    role: "UI/UX Designer",
    department: "Design",
    location: "Hyderabad, India",
    bio: "Design thinker who turns complex products into simple, human experiences.",
    longBio:
      "Ravi Sankar leads the UI/UX practice at 100 Web Technologies. He creates user-centered interfaces for web apps, mobile apps and enterprise dashboards, making sure every screen is as usable as it is beautiful.",
    linkedin: "https://www.linkedin.com/in/",
    email: "ravi.sankar@100web.in",
    experienceYears: 7,
    skills: ["UI Design", "UX Research", "Wireframing", "Prototyping", "Design Systems"],
    experience: [
      { company: "100 Web Technologies", title: "UI/UX Designer", period: "2020 — Present", description: "Owns design standards and leads UX for 40+ client projects." },
      { company: "Product Studio", title: "Senior UI Designer", period: "2017 — 2020", description: "Designed interfaces for fintech and health-tech products." },
      { company: "Creative Agency", title: "Visual Designer", period: "2015 — 2017", description: "Crafted brand and web experiences for startups." },
    ],
    education: [
      { school: "JNTU Hyderabad", degree: "B.Tech, Computer Science", period: "2011 — 2015" },
    ],
    achievements: [
      "Built the 100W design system",
      "Improved client conversion rates by up to 35%",
      "Mentored 10+ junior designers",
    ],
    avatarInitials: "RS",
    accent: "from-fuchsia-500 via-pink-500 to-rose-500",
  },
  {
    slug: "dinesh",
    name: "Dinesh",
    role: "Full Stack Developer",
    department: "Engineering",
    location: "Hyderabad, India",
    bio: "Full stack engineer shipping end-to-end products from database to UI.",
    longBio:
      "Dinesh is a full stack developer who builds scalable web applications and APIs. He works across the modern JavaScript ecosystem, cloud services and databases, turning requirements into reliable production code.",
    linkedin: "https://www.linkedin.com/in/",
    email: "dinesh@100web.in",
    experienceYears: 6,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    experience: [
      { company: "100 Web Technologies", title: "Full Stack Developer", period: "2020 — Present", description: "Develops full-stack features for SaaS, e-commerce and enterprise apps." },
      { company: "Software House", title: "Backend Developer", period: "2018 — 2020", description: "Built REST APIs and microservices for logistics platforms." },
      { company: "Freelance", title: "Web Developer", period: "2016 — 2018", description: "Delivered custom websites and CMS solutions for small businesses." },
    ],
    education: [
      { school: "JNTU Kakinada", degree: "B.Tech, Information Technology", period: "2012 — 2016" },
    ],
    achievements: [
      "Shipped 30+ production applications",
      "Reduced API latency by 45% on a client platform",
      "AWS Certified Developer — Associate",
    ],
    avatarInitials: "D",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    slug: "navya",
    name: "Navya",
    role: "Full Stack Developer",
    department: "Engineering",
    location: "Hyderabad, India",
    bio: "Versatile developer who owns both frontend polish and backend performance.",
    longBio:
      "Navya is a full stack developer at 100 Web Technologies. She combines strong frontend craft with solid backend architecture, building fast, secure and user-friendly applications for clients across industries.",
    linkedin: "https://www.linkedin.com/in/",
    email: "navya@100web.in",
    experienceYears: 5,
    skills: ["Next.js", "React", "Python", "Django", "Tailwind CSS"],
    experience: [
      { company: "100 Web Technologies", title: "Full Stack Developer", period: "2021 — Present", description: "Leads development for CRM, education and healthcare platforms." },
      { company: "E-commerce Firm", title: "Frontend Developer", period: "2019 — 2021", description: "Optimized checkout flows and rebuilt the merchant dashboard." },
      { company: "Startup", title: "Junior Developer", period: "2018 — 2019", description: "Built MVPs and internal tools for operations teams." },
    ],
    education: [
      { school: "JNTU Hyderabad", degree: "B.Tech, Computer Science", period: "2014 — 2018" },
    ],
    achievements: [
      "Delivered 25+ full-stack projects",
      "Built reusable component libraries across teams",
      "Mentored interns and junior developers",
    ],
    avatarInitials: "N",
    accent: "from-orange-500 via-amber-500 to-yellow-500",
  },
  {
    slug: "sai-krishna",
    name: "Sai Krishna",
    role: "DevOps Engineer",
    department: "Cloud",
    location: "Hyderabad, India",
    bio: "Cloud automation specialist keeping systems reliable and scalable.",
    longBio:
      "Sai Krishna manages DevOps and cloud infrastructure at 100 Web Technologies. He automates deployments, monitors platform health, and ensures client applications run smoothly across AWS, Azure and GCP environments.",
    linkedin: "https://www.linkedin.com/in/",
    email: "sai.krishna@100web.in",
    experienceYears: 6,
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    experience: [
      { company: "100 Web Technologies", title: "DevOps Engineer", period: "2020 — Present", description: "Owns CI/CD pipelines, cloud cost optimization and SRE practices." },
      { company: "Cloud Services Firm", title: "Systems Engineer", period: "2017 — 2020", description: "Managed cloud migrations and monitoring for enterprise clients." },
      { company: "IT Services", title: "Linux Admin", period: "2015 — 2017", description: "Maintained servers and network infrastructure for banks." },
    ],
    education: [
      { school: "JNTU Anantapur", degree: "B.Tech, Electronics & Communication", period: "2011 — 2015" },
    ],
    achievements: [
      "Reduced deployment time by 70%",
      "Cut cloud spend by 30% across accounts",
      "AWS Certified Solutions Architect",
    ],
    avatarInitials: "SK",
    accent: "from-sky-500 via-blue-500 to-indigo-500",
  },
  {
    slug: "charan",
    name: "Charan",
    role: "Application Developer",
    department: "Engineering",
    location: "Hyderabad, India",
    bio: "Application developer focused on clean code and business logic.",
    longBio:
      "Charan builds custom applications and internal tools at 100 Web Technologies. He specializes in backend logic, database design and API integration, making sure every feature works reliably behind the scenes.",
    linkedin: "https://www.linkedin.com/in/",
    email: "charan@100web.in",
    experienceYears: 5,
    skills: ["Java", "Spring Boot", "SQL", "REST APIs", "Microservices"],
    experience: [
      { company: "100 Web Technologies", title: "Application Developer", period: "2021 — Present", description: "Develops business applications and third-party integrations for clients." },
      { company: "Enterprise ISV", title: "Software Engineer", period: "2018 — 2021", description: "Built inventory and ERP modules for mid-market clients." },
      { company: "Tech Services", title: "Associate Developer", period: "2016 — 2018", description: "Maintained enterprise applications and supported production." },
    ],
    education: [
      { school: "JNTU Hyderabad", degree: "B.Tech, Computer Science", period: "2012 — 2016" },
    ],
    achievements: [
      "Delivered 20+ application modules",
      "Improved system uptime to 99.9%",
      "Certified Java Developer",
    ],
    avatarInitials: "C",
    accent: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
  {
    slug: "murali",
    name: "Murali",
    role: "Business Development Manager",
    department: "Business Development",
    location: "Hyderabad, India",
    bio: "Growth-driven BDM connecting businesses with the right digital solutions.",
    longBio:
      "Murali drives new business at 100 Web Technologies. He identifies client needs, shapes proposals and builds long-term relationships that turn into successful partnerships across industries.",
    linkedin: "https://www.linkedin.com/in/",
    email: "murali@100web.in",
    experienceYears: 8,
    skills: ["Sales Strategy", "Client Acquisition", "Negotiation", "CRM", "Market Research"],
    experience: [
      { company: "100 Web Technologies", title: "BDM", period: "2019 — Present", description: "Generated pipeline and closed 50+ new client engagements." },
      { company: "B2B SaaS Firm", title: "Sales Manager", period: "2016 — 2019", description: "Grew enterprise revenue by 40% year over year." },
      { company: "Services Agency", title: "Business Associate", period: "2014 — 2016", description: "Qualified leads and managed proposal processes." },
    ],
    education: [
      { school: "Andhra University", degree: "MBA, Marketing", period: "2012 — 2014" },
    ],
    achievements: [
      "Closed 50+ new client accounts",
      "Built a 7-figure sales pipeline",
      "Top BDM for two consecutive years",
    ],
    avatarInitials: "M",
    accent: "from-rose-500 via-red-500 to-orange-500",
  },
  {
    slug: "pavani",
    name: "Pavani",
    role: "Business Development Manager",
    department: "Business Development",
    location: "Hyderabad, India",
    bio: "Client-focused BDM turning conversations into long-term partnerships.",
    longBio:
      "Pavani manages business development and client onboarding at 100 Web Technologies. She understands client goals, aligns them with the right service teams, and ensures a smooth start to every engagement.",
    linkedin: "https://www.linkedin.com/in/",
    email: "pavani@100web.in",
    experienceYears: 6,
    skills: ["Client Relations", "Sales Outreach", "Proposal Writing", "CRM", "Presentations"],
    experience: [
      { company: "100 Web Technologies", title: "BDM", period: "2020 — Present", description: "Owns mid-market sales and onboarding for new accounts." },
      { company: "Marketing Agency", title: "Account Executive", period: "2017 — 2020", description: "Sold digital marketing retainers to SMEs." },
      { company: "Retail Brand", title: "Customer Success Associate", period: "2015 — 2017", description: "Managed accounts and upsell campaigns." },
    ],
    education: [
      { school: "Osmania University", degree: "MBA, Marketing", period: "2013 — 2015" },
    ],
    achievements: [
      "Onboarded 30+ new clients",
      "Maintained 90%+ client retention",
      "Recognized for highest lead conversion rate",
    ],
    avatarInitials: "P",
    accent: "from-teal-500 via-emerald-500 to-green-500",
  },
  {
    slug: "shailaja",
    name: "Shailaja",
    role: "WordPress Developer",
    department: "Engineering",
    location: "Hyderabad, India",
    bio: "WordPress expert building fast, scalable and easy-to-manage websites.",
    longBio:
      "Shailaja specializes in WordPress development at 100 Web Technologies. She builds custom themes, optimizes performance, and creates flexible CMS solutions that let marketing teams move fast without touching code.",
    linkedin: "https://www.linkedin.com/in/",
    email: "shailaja@100web.in",
    experienceYears: 5,
    skills: ["WordPress", "PHP", "Elementor", "WooCommerce", "SEO"],
    experience: [
      { company: "100 Web Technologies", title: "WordPress Developer", period: "2021 — Present", description: "Built 60+ WordPress and WooCommerce sites for global clients." },
      { company: "Web Agency", title: "PHP Developer", period: "2018 — 2021", description: "Developed custom themes and plugins for business websites." },
      { company: "Freelance", title: "Web Designer", period: "2016 — 2018", description: "Created portfolio and brochure sites for small businesses." },
    ],
    education: [
      { school: "JNTU Hyderabad", degree: "B.Tech, Computer Science", period: "2012 — 2016" },
    ],
    achievements: [
      "Built 60+ WordPress sites",
      "Reduced average page load time by 40%",
      "WooCommerce expert certified",
    ],
    avatarInitials: "S",
    accent: "from-lime-500 via-green-500 to-emerald-500",
  },
  {
    slug: "satish-p",
    name: "Satish P",
    role: "Business Development Manager",
    department: "Business Development",
    location: "Hyderabad, India",
    bio: "Strategic BDM growing the agency footprint in new markets.",
    longBio:
      "Satish P focuses on expanding 100 Web Technologies into new geographies and verticals. He builds partner networks, runs outreach campaigns and structures deals that scale.",
    linkedin: "https://www.linkedin.com/in/",
    email: "satish.p@100web.in",
    experienceYears: 7,
    skills: ["Market Expansion", "Partnerships", "B2B Sales", "Lead Generation", "CRM"],
    experience: [
      { company: "100 Web Technologies", title: "BDM", period: "2019 — Present", description: "Drives market expansion and channel partnerships." },
      { company: "IT Services Firm", title: "Sales Executive", period: "2016 — 2019", description: "Sold software services to US and UK markets." },
      { company: "BPO", title: "Team Lead", period: "2013 — 2016", description: "Led client support and upsell teams for telecom accounts." },
    ],
    education: [
      { school: "Kakatiya University", degree: "MBA, Marketing", period: "2011 — 2013" },
    ],
    achievements: [
      "Opened 3 new market verticals",
      "Built a partner network of 15 agencies",
      "Exceeded quarterly targets 8 times in a row",
    ],
    avatarInitials: "SP",
    accent: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    slug: "rajesh-n",
    name: "Rajesh N",
    role: "DevOps Engineer",
    department: "Cloud",
    location: "Hyderabad, India",
    bio: "DevOps engineer automating deployments and hardening infrastructure.",
    longBio:
      "Rajesh N is a DevOps engineer who ensures reliable releases, secure environments and cost-efficient cloud setups. He builds pipelines, configures monitoring and keeps production systems healthy around the clock.",
    linkedin: "https://www.linkedin.com/in/",
    email: "rajesh.n@100web.in",
    experienceYears: 6,
    skills: ["AWS", "Azure", "Docker", "Jenkins", "Linux", "Security"],
    experience: [
      { company: "100 Web Technologies", title: "DevOps Engineer", period: "2020 — Present", description: "Manages CI/CD, security hardening and uptime monitoring." },
      { company: "Cloud Provider", title: "Cloud Support Engineer", period: "2017 — 2020", description: "Supported enterprise clients on AWS and Azure infrastructure." },
      { company: "Data Center", title: "System Administrator", period: "2015 — 2017", description: "Managed physical and virtual servers for enterprise apps." },
    ],
    education: [
      { school: "JNTU Kakinada", degree: "B.Tech, Computer Science", period: "2011 — 2015" },
    ],
    achievements: [
      "Achieved 99.95% uptime across client apps",
      "Automated 90% of manual deployments",
      "Microsoft Azure Administrator certified",
    ],
    avatarInitials: "RN",
    accent: "from-blue-500 via-indigo-500 to-violet-500",
  },
  {
    slug: "manikanta",
    name: "Manikanta",
    role: "HR Manager",
    department: "People & HR",
    location: "Hyderabad, India",
    bio: "People operations lead building a high-performance, caring culture.",
    longBio:
      "Manikanta manages human resources and talent operations at 100 Web Technologies. He handles recruitment, onboarding, employee engagement and performance programs that keep the team motivated and growing.",
    linkedin: "https://www.linkedin.com/in/",
    email: "manikanta@100web.in",
    experienceYears: 7,
    skills: ["Recruitment", "Employee Engagement", "Payroll", "Performance Management", "Culture Building"],
    experience: [
      { company: "100 Web Technologies", title: "HR Manager", period: "2019 — Present", description: "Scaled the team from 10 to 50+ members and built HR processes." },
      { company: "IT Services Firm", title: "HR Executive", period: "2016 — 2019", description: "Led campus hiring and employee relations." },
      { company: "Recruitment Agency", title: "Talent Acquisition Associate", period: "2014 — 2016", description: "Sourced and screened technical candidates." },
    ],
    education: [
      { school: "Osmania University", degree: "MBA, HR", period: "2012 — 2014" },
    ],
    achievements: [
      "Scaled team from 10 to 50+ members",
      "Reduced time-to-hire by 40%",
      "Launched company-wide learning program",
    ],
    avatarInitials: "M",
    accent: "from-pink-500 via-rose-500 to-orange-500",
  },
  {
    slug: "chaitanya",
    name: "Chaitanya",
    role: "Meta Ads Manager",
    department: "Performance Marketing",
    location: "Hyderabad, India",
    bio: "Meta ads specialist turning budgets into qualified leads and sales.",
    longBio:
      "Chaitanya runs Meta advertising campaigns at 100 Web Technologies. He crafts funnels, tests creatives and optimizes audiences to drive conversions for e-commerce, education and service-based clients.",
    linkedin: "https://www.linkedin.com/in/",
    email: "chaitanya@100web.in",
    experienceYears: 5,
    skills: ["Facebook Ads", "Instagram Ads", "Campaign Strategy", "Pixel Setup", "Creative Testing"],
    experience: [
      { company: "100 Web Technologies", title: "Meta Ads Manager", period: "2021 — Present", description: "Manages 50+ Meta ad accounts and scaled client ROAS." },
      { company: "D2C Brand", title: "Performance Marketing Executive", period: "2018 — 2021", description: "Scaled paid social revenue 3x for a consumer brand." },
      { company: "Agency", title: "Social Media Analyst", period: "2016 — 2018", description: "Managed organic and paid campaigns for SMEs." },
    ],
    education: [
      { school: "JNTU Hyderabad", degree: "BBA, Marketing", period: "2012 — 2016" },
    ],
    achievements: [
      "Scaled ad spend to $1M+ across accounts",
      "Achieved 4x average ROAS for clients",
      "Meta Certified Media Buying Professional",
    ],
    avatarInitials: "C",
    accent: "from-purple-500 via-violet-500 to-fuchsia-500",
  },
  {
    slug: "sai-lakshmi",
    name: "Sai Lakshmi",
    role: "Google Ads Manager",
    department: "Performance Marketing",
    location: "Hyderabad, India",
    bio: "Google Ads expert driving search, display and video conversions.",
    longBio:
      "Sai Lakshmi manages Google Ads accounts at 100 Web Technologies. She builds search, display and YouTube campaigns focused on lead quality, cost per acquisition and long-term revenue growth.",
    linkedin: "https://www.linkedin.com/in/",
    email: "sai.lakshmi@100web.in",
    experienceYears: 5,
    skills: ["Google Search Ads", "Display Ads", "YouTube Ads", "Keyword Strategy", "Conversion Tracking"],
    experience: [
      { company: "100 Web Technologies", title: "Google Ads Manager", period: "2021 — Present", description: "Runs paid search and video campaigns for 40+ clients." },
      { company: "Digital Agency", title: "PPC Specialist", period: "2018 — 2021", description: "Reduced CPA by 35% across B2B SaaS accounts." },
      { company: "E-commerce Firm", title: "Marketing Coordinator", period: "2016 — 2018", description: "Managed shopping campaigns and product feed optimization." },
    ],
    education: [
      { school: "Andhra University", degree: "BBA, Marketing", period: "2012 — 2016" },
    ],
    achievements: [
      "Managed $800K+ in Google Ads spend",
      "Reduced average CPA by 35%",
      "Google Ads Search Certification",
    ],
    avatarInitials: "SL",
    accent: "from-yellow-500 via-amber-500 to-orange-500",
  },
  {
    slug: "koti",
    name: "Koti",
    role: "Native Ads Manager",
    department: "Performance Marketing",
    location: "Hyderabad, India",
    bio: "Native ads strategist scaling campaigns through content-driven placements.",
    longBio:
      "Koti specializes in native advertising at 100 Web Technologies. He runs campaigns on Taboola, Outbrain and similar platforms, blending content strategy with performance targeting to generate leads at scale.",
    linkedin: "https://www.linkedin.com/in/",
    email: "koti@100web.in",
    experienceYears: 5,
    skills: ["Taboola", "Outbrain", "Content Ads", "Native Funnels", "A/B Testing"],
    experience: [
      { company: "100 Web Technologies", title: "Native Ads Manager", period: "2021 — Present", description: "Runs native campaigns for finance, health and education clients." },
      { company: "Ad Network", title: "Media Buyer", period: "2018 — 2021", description: "Managed native and programmatic campaigns across DSPs." },
      { company: "Content Agency", title: "Content Marketer", period: "2016 — 2018", description: "Created sponsored content and landing pages." },
    ],
    education: [
      { school: "JNTU Kakinada", degree: "BBA, Marketing", period: "2012 — 2016" },
    ],
    achievements: [
      "Scaled native ad spend to $500K+",
      "Built high-converting advertorial funnels",
      "Improved CTR by 60% through creative testing",
    ],
    avatarInitials: "K",
    accent: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    slug: "pavan-kumar",
    name: "Pavan Kumar",
    role: "Graphic Designer",
    department: "Design",
    location: "Hyderabad, India",
    bio: "Graphic designer creating bold visuals for brands and campaigns.",
    longBio:
      "Pavan Kumar crafts the visual identity for campaigns, social media and brand assets at 100 Web Technologies. He turns briefs into eye-catching designs that communicate clearly and convert effectively.",
    linkedin: "https://www.linkedin.com/in/",
    email: "pavan.kumar@100web.in",
    experienceYears: 5,
    skills: ["Adobe Photoshop", "Illustrator", "Brand Design", "Social Media Graphics", "Print Design"],
    experience: [
      { company: "100 Web Technologies", title: "Graphic Designer", period: "2021 — Present", description: "Designs brand assets, ad creatives and campaign visuals for clients." },
      { company: "Creative Agency", title: "Visual Designer", period: "2018 — 2021", description: "Created marketing collateral for retail and fintech brands." },
      { company: "Print Studio", title: "Junior Designer", period: "2016 — 2018", description: "Designed brochures, packaging and event branding." },
    ],
    education: [
      { school: "JNAFAU Hyderabad", degree: "BFA, Applied Arts", period: "2012 — 2016" },
    ],
    achievements: [
      "Designed 500+ creative assets",
      "Led rebranding for 10+ clients",
      "Adobe Certified Expert — Photoshop",
    ],
    avatarInitials: "PK",
    accent: "from-red-500 via-rose-500 to-pink-500",
  },
  {
    slug: "srikar",
    name: "Srikar",
    role: "Video Editor",
    department: "Creative",
    location: "Hyderabad, India",
    bio: "Video editor turning raw footage into compelling stories.",
    longBio:
      "Srikar leads video editing at 100 Web Technologies. He cuts, grades and polishes video content for ads, explainers, testimonials and social media, ensuring every frame supports the campaign goal.",
    linkedin: "https://www.linkedin.com/in/",
    email: "srikar@100web.in",
    experienceYears: 5,
    skills: ["Adobe Premiere Pro", "After Effects", "Color Grading", "Motion Graphics", "Storytelling"],
    experience: [
      { company: "100 Web Technologies", title: "Video Editor", period: "2021 — Present", description: "Edits video content for 60+ client campaigns." },
      { company: "Production House", title: "Assistant Editor", period: "2018 — 2021", description: "Worked on commercials, corporate films and event videos." },
      { company: "YouTube Channel", title: "Content Editor", period: "2016 — 2018", description: "Edited long-form and short-form content for creators." },
    ],
    education: [
      { school: "JNAFAU Hyderabad", degree: "BFA, Film & Video", period: "2012 — 2016" },
    ],
    achievements: [
      "Edited 100+ commercial videos",
      "Built a reusable video editing workflow",
      "Client videos with 5M+ combined views",
    ],
    avatarInitials: "S",
    accent: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    slug: "naveen",
    name: "Naveen",
    role: "Motion Graphics Designer",
    department: "Creative",
    location: "Hyderabad, India",
    bio: "Motion designer bringing brands to life through animation.",
    longBio:
      "Naveen creates motion graphics and animated explainers at 100 Web Technologies. He combines design, timing and storytelling to produce engaging videos that make complex products easy to understand.",
    linkedin: "https://www.linkedin.com/in/",
    email: "naveen@100web.in",
    experienceYears: 5,
    skills: ["After Effects", "Cinema 4D", "Motion Design", "2D Animation", "Lottie"],
    experience: [
      { company: "100 Web Technologies", title: "Motion Graphics Designer", period: "2021 — Present", description: "Creates animated explainers, UI motion and social animations." },
      { company: "Animation Studio", title: "Motion Designer", period: "2018 — 2021", description: "Produced explainer videos and ad animations for startups." },
      { company: "Media Agency", title: "Junior Animator", period: "2016 — 2018", description: "Created motion graphics for TV and digital campaigns." },
    ],
    education: [
      { school: "JNAFAU Hyderabad", degree: "BFA, Animation", period: "2012 — 2016" },
    ],
    achievements: [
      "Created 80+ motion graphics projects",
      "Built a library of reusable Lottie animations",
      "Won 2 client pitch videos through motion storytelling",
    ],
    avatarInitials: "N",
    accent: "from-cyan-500 via-teal-500 to-emerald-500",
  },
];

export const teamBySlug = (slug: string) => team.find((m) => m.slug === slug);
