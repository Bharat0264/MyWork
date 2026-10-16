export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  avatar?: string;
  skills?: string[];
  availability?: {
    status: "available" | "busy";
    label: string;
  };
  links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

/**
 * Meet the Team
 * Two developers, one focus: websites that look sharp and work well.
 */
export const teamMembers: TeamMember[] = [
  {
    id: "bharath",
    name: "Bharat Sai Pulipati",
    role: "Lead Full-Stack Developer",
    initials: "BP",
    bio: "Focuses on scalable Next.js architectures, sub-second performance, and clean modern code.",
    skills: ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS"],
    availability: {
      status: "available",
      label: "Available for select projects",
    },
    links: {
      github: "https://github.com/Bharat0264",
      linkedin: "https://www.linkedin.com/in/pulipati-bharat-sai-09a4692a2/",
      email: "bharathsaipulipati@gmail.com",
    },
  },
  {
    id: "mokshagna",
    name: "Jayavaram Ranga Mokshagna",
    role: "Full-Stack Developer",
    initials: "JR",
    bio: "Builds dependable front-end and back-end features with an eye for clean, maintainable code.",
    skills: ["React", "TypeScript", "REST APIs", "Node.js", "Databases"],
    availability: {
      status: "available",
      label: "Available for select projects",
    },
    links: {
      github: "https://github.com",
      linkedin: "https://www.linkedin.com",
    },
  },
];
