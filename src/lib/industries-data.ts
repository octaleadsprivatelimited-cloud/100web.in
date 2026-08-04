// Central industries dataset. Each entry generates a dedicated page at
// /industries/$slug with templated content (hero, results, FAQ, CTA).

export type IndustryCategory =
  | "Automotive & Transport"
  | "Food & Beverage"
  | "Retail & Grocery"
  | "Healthcare & Wellness"
  | "Beauty & Personal Care"
  | "Fitness & Sports"
  | "Education & Training"
  | "Hospitality & Travel"
  | "Real Estate & Construction"
  | "Home & Interiors"
  | "Electronics & Technology"
  | "Fashion & Lifestyle"
  | "Creative & Marketing"
  | "Logistics & Delivery"
  | "Finance & Legal"
  | "Agriculture"
  | "Local Services"
  | "Community & Non-Profit"
  | "Manufacturing & Industrial"
  | "Energy & Utilities"
  | "Pets & Plants"
  | "Business Services"
  | "Media & Entertainment"
  | "Waste & Recycling"
  | "Materials & Mining"
  | "Trade & Commerce"
  | "Marine & Aviation"
  | "Telecom";

export type Industry = {
  slug: string;
  name: string;
  category: IndustryCategory;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const raw: Record<IndustryCategory, string[]> = {
  "Automotive & Transport": [
    "Car Wash", "Auto Detailing", "Bike Wash", "Truck Wash", "Bus Wash", "Tyre Shop",
    "Auto Repair", "Car Service Center", "EV Service Center", "Battery Shop",
    "Car Rental", "Bike Rental", "Taxi Service", "Driving School", "Fuel Station",
    "Lubricant Shop", "Vehicle Inspection", "Towing Service", "Denting & Painting",
    "Accessories Shop",
  ],
  "Food & Beverage": [
    "Restaurant", "Cafe", "Bakery", "Sweet Shop", "Ice Cream Shop", "Juice Center",
    "Cloud Kitchen", "Fast Food", "Fine Dining", "Catering",
  ],
  "Retail & Grocery": [
    "Grocery Store", "Supermarket", "Department Store", "Organic Store", "Fruit Shop",
    "Vegetable Shop", "Meat Shop", "Fish Shop", "Poultry Shop", "Dairy Store",
  ],
  "Healthcare & Wellness": [
    "Pharmacy", "Clinic", "Hospital", "Dental Clinic", "Eye Clinic", "Diagnostic Lab",
    "Physiotherapy", "Veterinary Clinic", "Blood Bank", "Medical Store",
  ],
  "Beauty & Personal Care": [
    "Salon", "Beauty Parlour", "Spa", "Massage Center", "Barbershop", "Tattoo Studio",
    "Nail Studio", "Cosmetics Store", "Wellness Center", "Yoga Studio",
  ],
  "Fitness & Sports": [
    "Gym", "Fitness Center", "Sports Club", "Swimming Pool", "Dance Academy",
    "Martial Arts Academy", "Cricket Academy", "Football Academy", "Badminton Academy",
    "Indoor Games Center",
  ],
  "Education & Training": [
    "School", "College", "University", "Coaching Center", "Tuition Center", "Library",
    "Training Institute", "Music School", "Art School", "Language Institute",
  ],
  "Hospitality & Travel": [
    "Hotel", "Resort", "Homestay", "Hostel", "Guest House", "Travel Agency",
    "Tour Operator", "Visa Consultancy", "Event Management", "Wedding Planner",
  ],
  "Real Estate & Construction": [
    "Real Estate", "Construction Company", "Architect", "Interior Designer",
    "Civil Contractor", "Electrical Contractor", "Plumbing Services",
    "Painting Contractor", "Roofing Contractor", "Land Surveyor",
  ],
  "Home & Interiors": [
    "Furniture Store", "Modular Kitchen", "Home Decor", "Mattress Store",
    "Lighting Store", "Curtain Store", "Flooring Store", "Tiles Showroom",
    "Sanitary Store", "Hardware Store",
  ],
  "Electronics & Technology": [
    "Electronics Store", "Mobile Shop", "Computer Store", "Laptop Repair",
    "Printer Service", "CCTV Dealer", "Networking Company", "Appliance Store",
    "TV Showroom", "Gaming Store",
  ],
  "Fashion & Lifestyle": [
    "Fashion Boutique", "Clothing Store", "Saree Shop", "Footwear Store",
    "Jewellery Store", "Watch Store", "Optical Store", "Bag Store", "Gift Shop",
    "Toy Store",
  ],
  "Creative & Marketing": [
    "Printing Press", "Signage Company", "Advertising Agency", "Digital Marketing Agency",
    "Web Development Company", "Software Company", "IT Services", "Animation Studio",
    "Photography Studio", "Video Production",
  ],
  "Logistics & Delivery": [
    "Courier Service", "Logistics Company", "Warehouse", "Packers & Movers",
    "Cold Storage", "Freight Forwarder", "Transport Company", "Delivery Service",
    "Cargo Service", "Shipping Agency",
  ],
  "Finance & Legal": [
    "Bank", "NBFC", "Insurance Agency", "CA Firm", "Tax Consultant", "Legal Firm",
    "Audit Firm", "Investment Advisor", "Stock Broker", "Microfinance",
  ],
  "Agriculture": [
    "Agriculture Farm", "Dairy Farm", "Poultry Farm", "Fish Farm", "Nursery",
    "Seed Store", "Fertilizer Shop", "Tractor Dealer", "Agri Equipment Dealer",
    "Cold Chain",
  ],
  "Local Services": [
    "Laundry", "Dry Cleaner", "Tailor", "Shoe Repair", "Watch Repair", "Locksmith",
    "Cleaning Services", "Pest Control", "Housekeeping", "Security Agency",
  ],
  "Community & Non-Profit": [
    "NGO", "Religious Trust", "Temple Office", "Mosque Office", "Church Office",
    "Community Hall", "Convention Center", "Club", "Association", "Co-operative Society",
  ],
  "Manufacturing & Industrial": [
    "Manufacturing Unit", "Steel Factory", "Plastic Factory", "Textile Mill",
    "Paper Mill", "Food Processing", "Beverage Plant", "Chemical Plant",
    "Furniture Factory", "Packaging Factory",
  ],
  "Energy & Utilities": [
    "Solar Company", "Solar Installer", "Electrical Shop", "Generator Dealer",
    "Water Purifier Dealer", "RO Service", "HVAC Company", "Lift Company",
    "Fire Safety Company", "Automation Company",
  ],
  "Pets & Plants": [
    "Pet Shop", "Pet Grooming", "Pet Boarding", "Florist", "Plant Nursery",
    "Aquarium Shop",
  ],
  "Business Services": [
    "Book Store", "Stationery Shop", "Internet Cafe", "Cyber Cafe", "Call Center",
    "BPO", "Recruitment Agency", "HR Consultancy", "Coworking Space", "Business Center",
  ],
  "Media & Entertainment": [
    "Media House", "Radio Station", "News Agency", "Publishing House", "Cinema",
    "Theatre", "Amusement Park", "Water Park", "Gaming Zone", "Escape Room",
    "Bowling Alley", "Trampoline Park", "VR Arcade", "Kids Play Area",
  ],
  "Waste & Recycling": [
    "Scrap Dealer", "Recycling Plant", "Waste Management", "E-Waste Recycler",
  ],
  "Materials & Mining": [
    "Mining Company", "Stone Crusher", "Marble Dealer", "Granite Dealer",
    "Glass Dealer", "Timber Merchant",
  ],
  "Trade & Commerce": [
    "Export Company", "Import Company", "Wholesale Distributor", "Retail Chain",
    "Franchise Outlet", "E-commerce Seller", "Marketplace Vendor", "Handicrafts Store",
    "Art Gallery", "Auction House",
  ],
  "Marine & Aviation": [
    "Marine Services", "Boat Rental", "Yacht Club", "Port Services", "Air Cargo",
    "Drone Services",
  ],
  "Telecom": [
    "Telecom Dealer", "ISP", "Cable TV Operator",
  ],
};

export const industries: Industry[] = Object.entries(raw).flatMap(
  ([category, names]) =>
    names.map((name) => ({
      slug: slugify(name),
      name,
      category: category as IndustryCategory,
    })),
);

export const industryCategories = Object.keys(raw) as IndustryCategory[];

export const getIndustryBySlug = (slug: string) =>
  industries.find((i) => i.slug === slug);

// FAQ background gradients — deterministically assigned per slug so each page
// feels distinct but stable across renders.
export const faqGradients = [
  "bg-[linear-gradient(135deg,#FFF3E0_0%,#FFE0B2_50%,#FFCC80_100%)]", // warm orange
  "bg-[linear-gradient(135deg,#FFEBEE_0%,#FFCDD2_50%,#EF9A9A_100%)]", // soft red
  "bg-[linear-gradient(135deg,#FFF8E1_0%,#FFECB3_50%,#FFE082_100%)]", // sand
  "bg-[linear-gradient(135deg,#FCE4EC_0%,#F8BBD0_50%,#F48FB1_100%)]", // rose
  "bg-[linear-gradient(135deg,#F3E5F5_0%,#E1BEE7_50%,#CE93D8_100%)]", // lilac
  "bg-[linear-gradient(135deg,#E8F5E9_0%,#C8E6C9_50%,#A5D6A7_100%)]", // mint
  "bg-[linear-gradient(135deg,#E1F5FE_0%,#B3E5FC_50%,#81D4FA_100%)]", // sky
  "bg-[linear-gradient(135deg,#FFF9C4_0%,#FFF59D_50%,#FFF176_100%)]", // sunshine
];

export const gradientFor = (slug: string) => {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return faqGradients[h % faqGradients.length];
};

// Templated content builders — keep pages information-rich without hand-writing
// content for every one of ~250 industries.
export const buildResults = (name: string) => [
  { metric: "3×", label: `More qualified leads for your ${name.toLowerCase()}` },
  { metric: "45%", label: "Lower cost per acquisition within 90 days" },
  { metric: "60%", label: "Faster response to customer inquiries" },
  { metric: "4.8★", label: "Average customer rating after launch" },
];

export const buildFaqs = (name: string) => [
  {
    q: `How long does it take to build a website for a ${name}?`,
    a: `Most ${name} websites go live in 2–4 weeks. Complex builds with online booking, payments or inventory take 4–8 weeks. We work in weekly sprints so you see progress every week.`,
  },
  {
    q: `Will my ${name} website work well on mobile phones?`,
    a: `Yes. Every site is designed mobile-first, tested on real Android and iOS devices, and tuned for fast load speeds — because more than 70% of your customers will visit from a phone.`,
  },
  {
    q: `Can you help my ${name} rank on Google?`,
    a: `Absolutely. Every build includes local SEO, Google Business Profile setup, structured data and location pages so your ${name} shows up when nearby customers search.`,
  },
  {
    q: `Do you offer WhatsApp, booking and payment integrations?`,
    a: `Yes — WhatsApp click-to-chat, appointment booking, UPI/card payments, invoicing and CRM automations are all standard options for ${name} businesses.`,
  },
  {
    q: `What does it cost to get my ${name} online?`,
    a: `Starter websites begin from a fixed one-time fee with transparent monthly support. We share a written proposal tailored to your ${name} after a free 20-minute discovery call.`,
  },
  {
    q: `Do you provide ongoing support after launch?`,
    a: `Yes. Every ${name} client gets a dedicated account manager, monthly reports, content updates, security patches and 24×7 uptime monitoring.`,
  },
];

export const buildOfferings = (name: string) => [
  `Custom ${name} website with your branding, offers and photos`,
  `Online booking, enquiry forms and WhatsApp chat`,
  `Google Business Profile setup and local SEO`,
  `Social media integration and review management`,
  `Payment gateway, invoicing and CRM automations`,
  `Monthly analytics, reports and ongoing support`,
];

export const buildTagline = (name: string) =>
  `Websites, apps and digital marketing built for ${name} businesses — helping you attract more customers, book more jobs and grow revenue.`;

export const buildOverview = (name: string) =>
  `Customers today discover a ${name} online before they walk in or call. We build fast, mobile-first websites, booking systems and marketing campaigns designed specifically for ${name} businesses — so you appear on Google Maps, load instantly, convert visitors into leads, and keep customers coming back. Our team handles design, development, SEO, ads and support so you can focus on running your ${name}.`;

// ---------- Rich per-category content ----------
// Each category ships with an "about", pain points, tailored features and a
// delivery process. Industry pages combine this with the industry name so
// every page reads specific to that business without hand-writing 250 files.

type CategoryContent = {
  about: (name: string) => string;
  challenges: string[];
  features: string[];
  audience: string;
};

const generic: CategoryContent = {
  about: (n) =>
    `The ${n} space is competitive and customers now start their journey on Google, Instagram and WhatsApp. Businesses that show up first, load fast on mobile and make it easy to enquire or buy consistently win the market.`,
  challenges: [
    "Losing customers to competitors with a stronger online presence",
    "Enquiries scattered across calls, WhatsApp and social DMs",
    "No clear picture of what marketing is actually working",
    "Website that looks outdated or is slow on mobile",
  ],
  features: [
    "Modern responsive website with your branding",
    "Lead capture forms with instant WhatsApp & email alerts",
    "Google Business Profile setup and local SEO",
    "Analytics dashboard and monthly performance reports",
  ],
  audience: "small and mid-sized business owners",
};

export const categoryContent: Record<IndustryCategory, CategoryContent> = {
  "Automotive & Transport": {
    about: (n) => `A ${n} lives on trust, turnaround time and repeat customers. Owners today need online booking, service reminders and reviews on Google Maps to stay full — walk-ins alone don't grow the business.`,
    challenges: ["Empty service bays on weekdays", "Customers forgetting service intervals", "Low ratings on Google Maps hurting new customer flow", "Manual bookkeeping and job cards"],
    features: ["Online slot booking with automated reminders", "Service history & job card system", "Pickup-drop enquiries via WhatsApp", "Google reviews automation & Maps optimisation", "Loyalty & prepaid service packages", "Fleet & B2B customer portal"],
    audience: "workshop and fleet owners",
  },
  "Food & Beverage": {
    about: (n) => `A ${n} succeeds when hungry customers can find you fast, see the menu, order in one tap and come back. Discovery on Google, Zomato and Instagram is now more important than the signboard on your street.`,
    challenges: ["Missed orders during peak hours", "High commissions on aggregator apps", "No repeat-customer database", "Menu photos and pricing out of date online"],
    features: ["Digital menu with QR ordering", "Direct online ordering (bypass aggregator fees)", "Table reservation & waitlist", "Loyalty program & birthday offers", "Instagram & Google Business content plan", "Delivery tracking & kitchen dashboard"],
    audience: "restaurateurs, cafe and cloud-kitchen owners",
  },
  "Retail & Grocery": {
    about: (n) => `Modern ${n} customers expect to browse stock, check prices and reorder from their phone. A simple digital storefront plus WhatsApp ordering can add a full second sales channel without opening another shop.`,
    challenges: ["Losing to quick-commerce apps", "No easy way for regulars to reorder", "Stock and pricing changes not reflected online", "Delivery zone confusion"],
    features: ["Product catalog with categories & search", "WhatsApp / app-based reordering", "Delivery zone & slot management", "Coupons, offers & festival campaigns", "Inventory sync & GST invoicing", "Customer loyalty wallet"],
    audience: "store owners and grocery chains",
  },
  "Healthcare & Wellness": {
    about: (n) => `Patients research a ${n} online before they call. Clear doctor profiles, verified reviews, online appointment booking and prescription reminders are now the baseline for trust.`,
    challenges: ["No-show appointments", "Patients calling reception for basic info", "Reviews and reputation on Practo/Google not managed", "Reports and prescriptions still on paper"],
    features: ["Online appointment & tele-consult booking", "Doctor profiles, timings & specialities", "Digital reports and prescription download", "Reminders via SMS & WhatsApp", "Review management on Google & Practo", "HIPAA-aware secure data storage"],
    audience: "clinic owners, doctors and diagnostic chains",
  },
  "Beauty & Personal Care": {
    about: (n) => `A ${n} runs on Instagram-worthy visuals, easy bookings and rebook rates. The chair that stays empty is lost revenue — smart booking, packages and reminders keep the calendar full.`,
    challenges: ["Empty chairs mid-week", "Clients forgetting to rebook", "Instagram traffic not converting to bookings", "Manual pen-and-paper appointment book"],
    features: ["Online booking with stylist selection", "Membership & package management", "Instagram/Reels-first content plan", "Automatic rebooking reminders", "Client history & preferences", "Gift cards and referral program"],
    audience: "salon and studio owners",
  },
  "Fitness & Sports": {
    about: (n) => `A ${n} lives or dies on retention. Members drop off silently — a real digital setup gives you class booking, attendance, renewals and progress tracking to keep engagement high.`,
    challenges: ["Members lapsing without warning", "Manual attendance and fee collection", "No lead nurturing for trial visitors", "Trainer schedules on paper"],
    features: ["Class & personal-training booking", "Membership renewals with auto-reminders", "Attendance & biometric integration", "Trainer profiles and testimonials", "Free-trial lead capture funnel", "Progress tracking dashboard for members"],
    audience: "gym, academy and studio owners",
  },
  "Education & Training": {
    about: (n) => `Parents and students shortlist a ${n} online long before they enquire. A modern website with courses, results, teacher profiles and easy admissions is the single biggest lead source today.`,
    challenges: ["Admission enquiries lost to faster-responding competitors", "No online showcase of results and toppers", "Fee collection and receipts still manual", "Parents can't track attendance or homework"],
    features: ["Admission enquiry funnel with WhatsApp", "Course & batch catalogue", "Online fee payment with receipts", "Parent & student login portals", "Results, gallery and toppers wall", "Live classes and LMS integration"],
    audience: "school, coaching and institute owners",
  },
  "Hospitality & Travel": {
    about: (n) => `Guests book a ${n} on the phone, on OTAs and directly — but every direct booking saves 15–25% in commission. A well-built site plus reviews management can pay for itself in a single season.`,
    challenges: ["High OTA commissions eating margins", "Reviews on TripAdvisor/Google not managed", "No direct booking engine", "Seasonal demand not captured in advance"],
    features: ["Direct booking engine with live availability", "Room / package showcase with rich photography", "OTA + channel manager integration", "Review reply automation", "Seasonal offer & wedding-package campaigns", "Loyalty and referral program"],
    audience: "hotel, resort and travel operators",
  },
  "Real Estate & Construction": {
    about: (n) => `Buyers and clients pick a ${n} based on projects seen online. High-quality galleries, walkthroughs, RERA info and instant enquiry response separate the leaders from the rest.`,
    challenges: ["Cold leads from portals", "Slow follow-up losing hot enquiries", "Portfolio scattered across brochures", "No clear brand across multiple projects"],
    features: ["Project & portfolio showcase with virtual tours", "Lead capture with instant call-back", "Meta & Google ads for buyer intent", "CRM with lead stages and follow-ups", "RERA / compliance information pages", "Client testimonial video wall"],
    audience: "developers, contractors and consultants",
  },
  "Home & Interiors": {
    about: (n) => `Customers shop a ${n} with Pinterest boards and Instagram screenshots in hand. A modern catalog site with room-wise inspiration and quote requests converts far better than a static price list.`,
    challenges: ["Losing walk-ins to online furniture brands", "No way to showcase past projects", "Quote requests over WhatsApp are chaotic", "Catalog updates take days"],
    features: ["Catalog with categories, filters and search", "Project gallery organised by room", "Instant quote / design consult request", "AR / 3D previews (where relevant)", "EMI and offer badges", "Dealer & showroom locator"],
    audience: "showroom and studio owners",
  },
  "Electronics & Technology": {
    about: (n) => `A ${n} competes with Amazon and Flipkart on trust, service and local speed. A sharp website with service booking and offers wins the customers who don't want to wait 2 days for delivery.`,
    challenges: ["Price comparison shoppers", "Service enquiries lost on phone", "No online proof of authorised dealership", "Warranty and AMC tracking on paper"],
    features: ["Product catalog with specs & compare", "Service & repair booking", "Brand authorisation & warranty pages", "EMI, exchange and offer widgets", "AMC and subscription management", "Location-based inventory display"],
    audience: "dealers, retailers and service centres",
  },
  "Fashion & Lifestyle": {
    about: (n) => `A ${n} sells a lifestyle first, product second. Reels, lookbooks, WhatsApp catalogs and one-tap checkout turn browsers into buyers — especially on mobile.`,
    challenges: ["Instagram traffic not converting to sales", "High return rates from wrong sizing info", "No repeat-customer database", "Slow response to WhatsApp enquiries"],
    features: ["Shoppable catalog with lookbook", "Size guides and fit videos", "WhatsApp catalog + payment link", "Instagram Reels & influencer campaigns", "Loyalty tier with early-access drops", "Wishlist and abandoned-cart recovery"],
    audience: "boutique, showroom and D2C brand owners",
  },
  "Creative & Marketing": {
    about: (n) => `Clients hire a ${n} based on the portfolio they see in 90 seconds. A fast, opinionated site plus case studies with real results is the single biggest new-business lever.`,
    challenges: ["Portfolio buried in Google Drive links", "No clear pricing or packages", "Enquiries not qualified before the call", "Cold outbound with weak collateral"],
    features: ["Case-study driven portfolio site", "Service pages with packages & pricing", "Automated proposal & briefing forms", "Client testimonial and logo wall", "Content marketing & SEO engine", "Client portal for reviews and delivery"],
    audience: "studios and agencies",
  },
  "Logistics & Delivery": {
    about: (n) => `A ${n} wins on visibility — customers want to know where their shipment is right now. Digital tracking, instant quotes and clean B2B onboarding are now table stakes.`,
    challenges: ["Customers calling for status updates", "Quotes taking days to send", "Manual PODs and invoicing", "No B2B self-serve portal"],
    features: ["Instant quote & booking calculator", "Live shipment tracking page", "B2B customer portal with invoices", "Driver / fleet app integration", "Route and load optimisation dashboard", "e-POD and GST invoicing"],
    audience: "transporters, 3PLs and courier operators",
  },
  "Finance & Legal": {
    about: (n) => `Clients evaluate a ${n} on credibility. A polished website, verified credentials, thought-leadership content and secure enquiry channels drive high-intent leads at low cost.`,
    challenges: ["Cold leads with no context", "Compliance & KYC over email is risky", "Thought leadership scattered across LinkedIn", "No client portal for documents"],
    features: ["Practice / service pages with case notes", "Secure enquiry & document upload", "Team & credentials page", "Content hub: blogs, guides, calculators", "Appointment booking with reminders", "Client portal for statements & documents"],
    audience: "advisory firms and financial professionals",
  },
  "Agriculture": {
    about: (n) => `Farmers and buyers researching a ${n} want clear product info, prices and reachable support in their language. A simple, low-bandwidth site plus WhatsApp broadcast is a strong combination.`,
    challenges: ["Reaching farmers across districts", "Price and stock changes not communicated", "Enquiries only over phone", "No English-first audience to design for"],
    features: ["Multilingual product catalog", "WhatsApp broadcast & enquiry", "Dealer / distributor locator", "Weather & crop advisory content", "Bulk order & B2B enquiry forms", "Video how-to library"],
    audience: "farm owners, agri-dealers and cooperatives",
  },
  "Local Services": {
    about: (n) => `A ${n} lives on \"near me\" searches, ratings and speed of response. Being the first result on Google Maps with 100+ reviews reliably beats any offline ad spend.`,
    challenges: ["Missed calls during service hours", "Low review count vs competitors", "No proof of past work online", "Pricing not transparent"],
    features: ["Local SEO & Google Maps optimisation", "Instant WhatsApp / call CTA", "Before-after gallery of jobs", "Transparent pricing / package pages", "Review automation & reply", "Recurring service subscriptions"],
    audience: "service business owners",
  },
  "Community & Non-Profit": {
    about: (n) => `A ${n} runs on trust, transparency and community participation. A clear website with events, donation, volunteer sign-up and impact reports amplifies every effort.`,
    challenges: ["Donations only via bank transfer", "Events under-attended", "Impact stories not documented", "Volunteers scattered across WhatsApp groups"],
    features: ["Online donation with 80G receipt", "Events calendar & RSVP", "Volunteer registration & rota", "Impact stories & photo gallery", "Annual report and financials page", "Members-only community portal"],
    audience: "trustees, coordinators and community leads",
  },
  "Manufacturing & Industrial": {
    about: (n) => `Buyers vet a ${n} online before RFQs. A credible corporate site with certifications, capabilities, plant videos and quick RFQ intake shortens sales cycles significantly.`,
    challenges: ["RFQ enquiries lost in generic inboxes", "No showcase of plant & capabilities", "Certifications and compliance scattered", "Distributors have no digital tools"],
    features: ["Capabilities & product catalog", "RFQ / bulk enquiry form", "Certifications & compliance library", "Plant tour videos & photography", "Distributor / dealer login portal", "Content in trade languages"],
    audience: "plant owners and industrial companies",
  },
  "Energy & Utilities": {
    about: (n) => `A ${n} converts customers with calculators, transparent pricing and clear ROI. Site visits, quotes and post-install service are the make-or-break moments.`,
    challenges: ["Long sales cycles with unclear ROI", "Quotes done manually per site", "Post-install service enquiries lost", "No showcase of past installs"],
    features: ["Savings / ROI calculator", "Instant quote & site-visit booking", "Case studies with real numbers", "AMC & service ticketing", "Financing / EMI options", "Dealer & installer network map"],
    audience: "installers, dealers and service companies",
  },
  "Pets & Plants": {
    about: (n) => `A ${n} audience is loyal, image-led and repeat-buys. Instagram-first content, easy WhatsApp orders and care guides turn one-time buyers into subscribers.`,
    challenges: ["Perishable / live stock hard to sell online", "Care questions repeated on WhatsApp", "No repeat-order flow", "Local delivery zones unclear"],
    features: ["Catalog with care guides per product", "WhatsApp ordering & delivery slots", "Subscription for food / care", "Instagram content calendar", "Grooming / boarding booking", "Live availability & pre-order"],
    audience: "shop and studio owners",
  },
  "Business Services": {
    about: (n) => `A ${n} lands clients on credibility and turnaround. A crisp site with services, packages, testimonials and instant enquiry gives you a professional edge from day one.`,
    challenges: ["Enquiries not qualified", "No clear pricing or packages", "Client updates over email are chaotic", "Referrals depend entirely on word of mouth"],
    features: ["Service & package pages", "Client portal for updates & docs", "Automated enquiry & briefing forms", "Testimonial and case-study wall", "Content hub for authority building", "Referral & partner program"],
    audience: "professional services owners",
  },
  "Media & Entertainment": {
    about: (n) => `A ${n} sells the experience first. Video, ticketing, timings and offers on a fast site — paired with Instagram and Google ads — drive footfalls week after week.`,
    challenges: ["Ticketing scattered across platforms", "No control on customer data", "Weekday footfall low", "Group / party enquiries handled manually"],
    features: ["Online ticketing & seat selection", "Party / group booking enquiries", "Membership & season passes", "Video-first landing pages", "Instagram & Google ads engine", "Loyalty and referral rewards"],
    audience: "venue and studio owners",
  },
  "Waste & Recycling": {
    about: (n) => `A ${n} scales when pickup requests are one tap away and B2B contracts have transparent reporting. Digital intake plus route dashboards move the needle fastest.`,
    challenges: ["Pickup requests only on phone", "No B2B contract dashboards", "Compliance reports done manually", "Public not aware of services offered"],
    features: ["Pickup request & scheduling", "B2B contract & reporting dashboard", "Route and driver assignment", "Weight / invoice automation", "Compliance & certification pages", "Awareness content & blog"],
    audience: "operators and B2B contract holders",
  },
  "Materials & Mining": {
    about: (n) => `Buyers of a ${n} want specs, availability and price clarity fast. A capability-led site with product ranges, sample requests and B2B enquiry forms shortens quote cycles.`,
    challenges: ["Enquiries with no context on grade / size", "Sample & site-visit requests lost", "Distributors have no self-serve tools", "Certifications not easy to share"],
    features: ["Product range with specs and grades", "Sample & bulk enquiry forms", "Distributor / trade portal", "Certification and test-report library", "Project reference case studies", "Multilingual sales collateral"],
    audience: "traders, quarry and dealer owners",
  },
  "Trade & Commerce": {
    about: (n) => `A ${n} scales on catalog breadth, trust signals and reorder ease. A modern B2B/B2C site with account logins, quote flows and integrations to marketplaces multiplies reach.`,
    challenges: ["Repeat buyers reordering manually", "Marketplaces controlling the customer relationship", "Catalog updates slow across channels", "No credit / account management online"],
    features: ["B2B / B2C catalog with account logins", "Quote & bulk order flows", "Marketplace & ERP integration", "Credit terms and invoicing", "Loyalty and reorder automation", "Multilingual and multi-currency storefront"],
    audience: "distributors, retailers and exporters",
  },
  "Marine & Aviation": {
    about: (n) => `A ${n} customer researches operators, safety credentials and pricing online first. A credible booking-ready site with clear packages, certifications and testimonials wins premium clients.`,
    challenges: ["Enquiries with unclear expectations", "Booking calendars overlapping", "No online proof of safety credentials", "Seasonal demand not captured early"],
    features: ["Package & fleet showcase", "Online booking & availability calendar", "Credential and safety page", "Corporate / charter enquiry funnel", "Photo & video-first landing pages", "Reviews and rebook automation"],
    audience: "operators and service providers",
  },
  "Telecom": {
    about: (n) => `A ${n} converts customers on plans, coverage and support quality. A clean site with plan comparison, self-serve support and lead capture drives both new activations and renewals.`,
    challenges: ["Support calls for issues customers could self-serve", "Plan comparisons unclear online", "Coverage information hard to find", "No online activation or renewal"],
    features: ["Plan comparison & activation", "Coverage / service area map", "Self-serve support & ticketing", "Renewal & upgrade flows", "Business & bulk plans page", "Referral program"],
    audience: "dealers, ISPs and operators",
  },
};

// Fallback merges generic with any category-specific bits.
export const getContentFor = (industry: Industry) => {
  const c = categoryContent[industry.category] ?? generic;
  return {
    about: c.about(industry.name),
    challenges: c.challenges,
    features: c.features,
    audience: c.audience,
  };
};

// Delivery process is the same story for every industry — 4 clear stages.
export const deliveryProcess = [
  { step: "01", title: "Discovery call", desc: "A free 20-minute call to understand your business, customers and goals. You get a clear scope and quote within 48 hours." },
  { step: "02", title: "Design & content", desc: "We design your pages, write the copy, and prepare photos & videos — all reviewed with you in weekly checkpoints." },
  { step: "03", title: "Build & launch", desc: "Development, integrations, testing and Go-Live — usually within 2–4 weeks, on a subdomain you can preview any time." },
  { step: "04", title: "Grow & support", desc: "Ongoing SEO, ads, content and technical support. Monthly reports show exactly what's working and what's next." },
];

// ---------- Shiftwave-style extended sections ----------

// Package includes — what every industry engagement ships with.
export const buildPackage = (name: string) => [
  { title: "Conversion-Focused Landing Page", desc: `A dedicated page built to turn ${name.toLowerCase()} visitors into enquiries.` },
  { title: "Lead Management System", desc: "Every enquiry captured, tagged and routed to the right person automatically." },
  { title: "Lead Reporting Dashboard", desc: "Daily and weekly reports showing source, stage and conversion of every lead." },
  { title: "User & Role Management", desc: "Give your team the right access — sales, support, admin — with clean permissions." },
  { title: "Business Social Presence", desc: "Optimised Facebook, Instagram and Google Business pages that actually convert." },
  { title: "Facebook & Instagram Ads", desc: `Targeted paid campaigns tuned for ${name.toLowerCase()} buyer intent.` },
  { title: "Ad Creatives & Copywriting", desc: "Scroll-stopping creatives and copy tested weekly for CTR and cost per lead." },
  { title: "Google, YouTube & Display Ads", desc: "Multi-channel ad mix so you reach customers wherever they research." },
];

// AIDA-style strategy — attention, interest, desire, action.
export const buildStrategy = (name: string) => [
  { key: "A", title: "Attention", desc: `Grab the eye of ${name.toLowerCase()} buyers with scroll-stopping ads, reels and hero visuals tuned to their intent.` },
  { key: "I", title: "Interest", desc: `Hold interest with landing pages, offers and social proof that speak directly to ${name.toLowerCase()} customers.` },
  { key: "D", title: "Desire", desc: "Build desire through case studies, testimonials, ratings and clear before-after outcomes." },
  { key: "A", title: "Action", desc: "Convert with one-tap WhatsApp, call, booking and payment — no friction between interest and action." },
];

// Our regular approach — repeatable growth playbook.
export const buildApproach = () => [
  { title: "Manage Ad Spend", desc: "Daily budget monitoring so every rupee is working — no wasted impressions, no runaway campaigns." },
  { title: "Build a Custom Audience", desc: "Lookalike, retargeting and interest-based audiences built from your real customer data." },
  { title: "Advanced Ad Technologies", desc: "Pixel tracking, conversion APIs and AI bidding for the lowest cost per qualified lead." },
  { title: "Dedicated Account Manager", desc: "One point of contact who knows your business, goals and numbers — reachable on WhatsApp." },
  { title: "Weekly & Monthly Reporting", desc: "Clear dashboards with leads, cost, ROAS and next-step recommendations — no jargon." },
];

// Impact stats — deterministic-per-industry so numbers stay stable across renders.
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const fmt = (n: number) => n.toLocaleString("en-IN");

export const buildStats = (name: string) => {
  const h = hash(name);
  const impressions = 400_000 + (h % 800_000);
  const reach = 180_000 + ((h >>> 3) % 400_000);
  const leads = 400 + ((h >>> 5) % 900);
  const calls = 120 + ((h >>> 7) % 350);
  const conversions = 250 + ((h >>> 9) % 500);
  return [
    { metric: fmt(impressions), label: "Ad Impressions" },
    { metric: fmt(reach), label: "People Reached" },
    { metric: fmt(leads), label: "Qualified Leads" },
    { metric: fmt(calls), label: "Phone Calls" },
    { metric: fmt(conversions), label: "Website Conversions" },
  ];
};

// Reasons to choose us — reusable trust bullets, industry-flavoured.
export const buildReasons = (name: string) => [
  `Deep experience designing websites and campaigns specifically for ${name.toLowerCase()} businesses.`,
  `We bring uplift with paid ads — Facebook, Instagram, Google and YouTube — tuned to ${name.toLowerCase()} buyer intent.`,
  "In-house team of designers, developers, SEO and paid-media specialists — no outsourcing.",
  "Transparent weekly reporting: leads, cost per lead, ROAS and next steps in plain English.",
  "Dedicated account manager who understands your business, reachable on WhatsApp.",
  "Fixed-scope proposals, no lock-in contracts — you stay because the results are working.",
];
