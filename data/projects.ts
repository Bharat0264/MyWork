export type Project = {
  slug: string;
  title: string;
  titlePrefix: string;
  titleSuffix: string;
  client: string;
  category: string;
  categories: string[];
  shortDescription: string;
  fullDescription: string;
  year: string;
  services: string[];
  technologies: string[];
  liveUrl?: string;
  previewImage?: string;
  githubUrl?: string;
  featured?: boolean;
  accent: string;
  challenge: string;
  solution: string;
  overviewNarrative: string;
  results?: string[];
  placeholder?: boolean;
};

export const projects: Project[] = [
  {
    slug: "rainbow-digi-school",
    title: "Rainbow Digi School",
    titlePrefix: "RAINBOW",
    titleSuffix: "DIGI SCHOOL",
    client: "Rainbow Digi School",
    category: "Education website",
    categories: ["Website Creation", "Business Websites", "Web Development"],
    shortDescription: "A friendly, easy-to-navigate school website that presents courses, activities and admissions clearly.",
    fullDescription: "A friendly, easy-to-navigate school website that presents courses, activities and admissions clearly.",
    year: "2026",
    services: ["UI/UX Design", "Web Development", "Custom Animations"],
    technologies: ["React", "Next.js", "Tailwind CSS", "Motion"],
    liveUrl: "https://rainbow-digi-school.vercel.app",
    previewImage: "/projects/rainbow-digi-school.webp",
    featured: true,
    accent: "#168BFF",
    challenge: "Create an inviting, joyful digital starting point for a preschool and primary learning community in Kandlakoya.",
    solution: "A bespoke, responsive website that helps families learn about the school, explore curriculum, and submit instant admission enquiries.",
    overviewNarrative: "A friendly, easy-to-navigate school website that presents courses, activities and admissions clearly."
  },
  {
    slug: "printbee",
    title: "PrintBee",
    titlePrefix: "PRINT",
    titleSuffix: "BEE",
    client: "PrintBee",
    category: "Full-stack commerce",
    categories: ["E-commerce", "Web Development"],
    shortDescription: "Print ordering, configuration and delivery in one considered customer flow.",
    fullDescription: "A digital print ordering platform that lets customers upload documents, configure printing preferences and track fulfilment.",
    year: "2026",
    services: ["Product design", "Full-stack development", "Payments"],
    technologies: ["React", "Node.js", "REST APIs", "Authentication"],
    liveUrl: "https://www.printbee.co.in",
    previewImage: "/projects/printbee.webp",
    featured: true,
    accent: "#7c6cff",
    challenge: "Make a complex physical print ordering and document upload process feel direct and dependable.",
    solution: "A guided, mobile-friendly ordering flow built around document upload, instant pricing calculations, and clear fulfilment visibility.",
    overviewNarrative: "A streamlined digital printing storefront with automated file pre-flight, custom paper weight selections, and real-time shipping tracking."
  },
  {
    slug: "aura-bi",
    title: "AURA BI",
    titlePrefix: "AURA",
    titleSuffix: "BI PLATFORM",
    client: "AURA BI",
    category: "AI platform",
    categories: ["Web Applications", "Web Development"],
    shortDescription: "A conversational workspace that helps teams turn datasets into useful decisions.",
    fullDescription: "An AI-powered business intelligence platform for exploring datasets through visualizations and conversational analysis.",
    year: "2026",
    services: ["UX strategy", "Interface design", "Platform development"],
    technologies: ["React", "Node.js", "AI APIs", "Interactive Charts"],
    liveUrl: "https://ai-bi-platform-gud0.onrender.com/",
    previewImage: "/projects/aura-bi.webp",
    githubUrl: "https://github.com/Bharat0264/AI-BI-Platform",
    featured: true,
    accent: "#31c4ff",
    challenge: "Bring complex multi-dimensional data exploration and natural-language analysis into a coherent interface.",
    solution: "A focused analysis workspace that gives datasets, queries and visual answers a shared, intuitive visual language.",
    overviewNarrative: "An enterprise AI intelligence dashboard with natural-language exploration, visual charts, and automated report synthesis."
  },
  {
    slug: "royal-mechanics",
    title: "Royal Mechanics",
    titlePrefix: "ROYAL",
    titleSuffix: "MECHANICS",
    client: "Royal Mechanics",
    category: "Service platform",
    categories: ["Business Websites", "Website Creation"],
    shortDescription: "A confident digital service hub for booking, assistance and customer care.",
    fullDescription: "A two-wheeler service platform designed around bookings, roadside assistance and customer-service workflows.",
    year: "2026",
    services: ["Website strategy", "UX design", "Development"],
    technologies: ["React", "Responsive UI", "Workflow Forms"],
    liveUrl: "https://royal-mechanics-one.vercel.app/",
    previewImage: "/projects/royal-mechanics.webp",
    featured: true,
    accent: "#e0a75d",
    challenge: "Turn urgent mechanical breakdown and service needs into a friction-free path to action.",
    solution: "A service-first experience with clear routes for doorstep bookings, rapid emergency roadside dispatch, and customer support.",
    overviewNarrative: "A dependable two-wheeler service hub built for rapid roadside breakdown dispatch, routine bookings, and live mechanic status."
  },
  {
    slug: "earnova",
    title: "Earnova",
    titlePrefix: "EARNOVA",
    titleSuffix: "MARKETPLACE",
    client: "Earnova",
    category: "Digital marketplace",
    categories: ["E-commerce", "Web Applications"],
    shortDescription: "A flexible multi-service platform for modern commerce and business tools.",
    fullDescription: "A marketplace concept combining commerce, services, business tools and sustainable product offerings.",
    year: "2026",
    services: ["Product architecture", "Full-stack development", "Payment integration"],
    technologies: ["React", "Express", "MongoDB", "Razorpay", "JWT"],
    liveUrl: "https://www.earnova.in/",
    previewImage: "/projects/earnova.webp",
    featured: true,
    accent: "#4cdaa6",
    challenge: "Organize diverse multi-vendor categories and merchant tools within one easy-to-navigate product.",
    solution: "A modular platform foundation designed for high-concurrency checkout and future merchant expansion.",
    overviewNarrative: "A high-performance digital marketplace connecting verified eco-conscious merchants with consumers through frictionless checkout."
  },
  {
    slug: "anutek",
    title: "Anutek",
    titlePrefix: "ANUTEK",
    titleSuffix: "TECHNOLOGY",
    client: "Anutek",
    category: "Business website",
    categories: ["Business Websites", "Website Creation"],
    shortDescription: "A live digital presence for Anutek, designed with clean architecture and modern performance.",
    fullDescription: "A business website project presented through its live homepage with modern responsive design and lead capture.",
    year: "2026",
    services: ["Website development", "Digital presence", "UI/UX Design"],
    technologies: ["Web development", "Responsive design", "SEO Optimization"],
    liveUrl: "https://anutek.vercel.app",
    previewImage: "/projects/anutek.webp",
    featured: true,
    accent: "#e079ff",
    challenge: "Create a clear, high-credibility online presence for an engineering enterprise.",
    solution: "A focused website experience that helps visitors explore capabilities, evaluate solutions, and contact engineering leadership.",
    overviewNarrative: "A clean, modern corporate presence highlighting advanced automation, cloud architecture, and industrial digital systems."
  },
  {
    slug: "redesign-concept",
    title: "Website Redesign",
    titlePrefix: "WEBSITE",
    titleSuffix: "REDESIGN",
    client: "Garuda Case Study",
    category: "Redesign concept",
    categories: ["Website Redesign"],
    shortDescription: "Before-and-after digital transformations delivering measurable speed and conversion lifts.",
    fullDescription: "A comprehensive website overhaul transforming legacy cluttered templates into bespoke, accessible, Apple-level experiences.",
    year: "2026",
    services: ["Design audit", "UI/UX redesign", "Performance optimization"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    previewImage: "/projects/redesign-concept.webp",
    accent: "#ff718d",
    challenge: "Overhaul outdated design paradigms without losing brand equity or existing search rankings.",
    solution: "A complete visual and architectural transformation focusing on typographic hierarchy, dark-mode elegance, and sub-second load times.",
    overviewNarrative: "A comprehensive website overhaul transforming legacy cluttered templates into bespoke, accessible, Apple-level experiences.",
    placeholder: false
  }
];
