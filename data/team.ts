export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  initials: string;
  github?: string;
  linkedin?: string;
}

/**
 * Meet the Team
 * A small, dedicated studio of friends.
 * Easily edit, add, or reorder members directly in this array.
 */
export const teamMembers: TeamMember[] = [
  {
    id: "bharath",
    name: "Bharat Sai Pulipati",
    role: "Lead Full-Stack Developer",
    bio: "Focuses on scalable Next.js architectures, sub-second performance, and clean modern code.",
    initials: "BP",
    github: "https://github.com/Bharat0264",
    linkedin: "https://www.linkedin.com/in/pulipati-bharat-sai-09a4692a2/",
  },
  {
    id: "arun",
    name: "Arun Kumar",
    role: "UI/UX & Visual Designer",
    bio: "Passionate about elegant typography, responsive design systems, and delightful user interactions.",
    initials: "AK",
    github: "https://github.com",
    linkedin: "https://www.linkedin.com",
  },
  {
    id: "sanjay",
    name: "Sanjay Raj",
    role: "Frontend Engineer",
    bio: "Brings designs to life with semantic markup, fluid micro-animations, and mobile-first layouts.",
    initials: "SR",
    github: "https://github.com",
    linkedin: "https://www.linkedin.com",
  },
];
