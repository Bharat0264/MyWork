export interface SocialLink {
  id: "github" | "linkedin" | "instagram" | "x";
  name: string;
  url: string;
  label: string;
}

export const socialConfig = {
  github: "https://github.com/Bharat0264",
  linkedin: "https://www.linkedin.com/in/pulipati-bharat-sai-09a4692a2/",
  instagram: "https://www.instagram.com/bharat_._5741",
  x: "https://x.com/BharathSai2022",
} as const;

export const socialLinks: SocialLink[] = [
  {
    id: "github",
    name: "GitHub",
    url: socialConfig.github,
    label: "Garuda on GitHub",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: socialConfig.linkedin,
    label: "Garuda on LinkedIn",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: socialConfig.instagram,
    label: "Garuda on Instagram",
  },
  {
    id: "x",
    name: "X",
    url: socialConfig.x,
    label: "Garuda on X",
  },
];
