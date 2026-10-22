export interface SocialPackage {
  id: "starter" | "growth" | "pro";
  name: string;
  tagline: string;
  postsPerWeek: number;
  videosPerWeek: number;
  platforms: number;
  platformsLabel: string;
  features: string[];
  price: number | null; // default null => rendered as "Custom quote"
  popular?: boolean;
}

export const socialPackages: SocialPackage[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Consistent weekly presence to keep your brand active and professional.",
    postsPerWeek: 2,
    videosPerWeek: 1,
    platforms: 1,
    platformsLabel: "1 platform",
    features: [
      "2 posts + 1 video per week",
      "1 platform of your choice",
      "Monthly content calendar",
      "Captions and relevant hashtags",
      "Scheduling and automated posting",
      "Monthly performance report",
    ],
    price: null,
    popular: false,
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Our most balanced package for steady audience growth and engagement.",
    postsPerWeek: 3,
    videosPerWeek: 2,
    platforms: 2,
    platformsLabel: "2 platforms",
    features: [
      "3 posts + 2 videos per week",
      "2 platforms",
      "Everything in Starter",
      "Story content & highlights",
      "Multi-slide carousel designs",
      "Comment and message reply support",
      "Monthly 1-on-1 strategy call",
    ],
    price: null,
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "High-volume content engine and dedicated community care across channels.",
    postsPerWeek: 5,
    videosPerWeek: 3,
    platforms: 3,
    platformsLabel: "Up to 3 platforms",
    features: [
      "5 posts + 3 videos per week",
      "Up to 3 platforms",
      "Everything in Growth",
      "Weekly content planning & review",
      "Dedicated community management",
      "Campaign and ad creative support",
    ],
    price: null,
    popular: false,
  },
];

/**
 * Calculates monthly totals for a given plan (weekly * 4 weeks)
 */
export function getMonthlyTotals(plan: { postsPerWeek: number; videosPerWeek: number }) {
  const monthlyPosts = plan.postsPerWeek * 4;
  const monthlyVideos = plan.videosPerWeek * 4;
  return {
    monthlyPosts,
    monthlyVideos,
    label: `${monthlyPosts} posts + ${monthlyVideos} videos / month`,
    note: "per month, 4 weeks",
  };
}

/**
 * Formats price in rupees with "/ month" or returns "Custom quote" if null
 */
export function formatPackagePrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return "Custom quote";
  }
  return `₹${price.toLocaleString("en-IN")} / month`;
}

/**
 * Optional rates for custom plan calculator.
 * If null, no price estimate is shown by default.
 */
export const customPlanConfig = {
  baseMonthlyRate: null as number | null,
  postRate: null as number | null,
  videoRate: null as number | null,
  platformRate: null as number | null,
};

export function getCustomPlanEstimate(
  postsPerWeek: number,
  videosPerWeek: number,
  platforms: number
): string | null {
  if (
    customPlanConfig.baseMonthlyRate === null ||
    customPlanConfig.postRate === null ||
    customPlanConfig.videoRate === null
  ) {
    return null; // By default show none
  }
  const monthlyPosts = postsPerWeek * 4;
  const monthlyVideos = videosPerWeek * 4;
  const total =
    customPlanConfig.baseMonthlyRate +
    monthlyPosts * customPlanConfig.postRate +
    monthlyVideos * customPlanConfig.videoRate +
    Math.max(0, platforms - 1) * (customPlanConfig.platformRate ?? 0);
  return `Estimated ₹${total.toLocaleString("en-IN")} / month`;
}

/**
 * Detailed feature comparison for the Compare Plans table
 */
export interface ComparisonFeature {
  category: string;
  name: string;
  starter: string | boolean;
  growth: string | boolean;
  pro: string | boolean;
}

export const comparisonTableFeatures: ComparisonFeature[] = [
  {
    category: "Content Volume",
    name: "Posts per week",
    starter: "2 / week",
    growth: "3 / week",
    pro: "5 / week",
  },
  {
    category: "Content Volume",
    name: "Short videos / Reels",
    starter: "1 / week",
    growth: "2 / week",
    pro: "3 / week",
  },
  {
    category: "Content Volume",
    name: "Monthly total (4 weeks)",
    starter: "8 posts + 4 videos",
    growth: "12 posts + 8 videos",
    pro: "20 posts + 12 videos",
  },
  {
    category: "Channels",
    name: "Platforms managed",
    starter: "1 platform",
    growth: "2 platforms",
    pro: "Up to 3 platforms",
  },
  {
    category: "Production & Design",
    name: "Monthly content calendar",
    starter: true,
    growth: true,
    pro: true,
  },
  {
    category: "Production & Design",
    name: "Captions and hashtags",
    starter: true,
    growth: true,
    pro: true,
  },
  {
    category: "Production & Design",
    name: "Carousel graphic designs",
    starter: "Basic",
    growth: true,
    pro: true,
  },
  {
    category: "Production & Design",
    name: "Story content & templates",
    starter: false,
    growth: true,
    pro: true,
  },
  {
    category: "Publishing & Community",
    name: "Scheduling & automated publishing",
    starter: true,
    growth: true,
    pro: true,
  },
  {
    category: "Publishing & Community",
    name: "Comment & DM reply support",
    starter: false,
    growth: true,
    pro: true,
  },
  {
    category: "Publishing & Community",
    name: "Dedicated community manager",
    starter: false,
    growth: false,
    pro: true,
  },
  {
    category: "Strategy & Support",
    name: "Monthly performance report",
    starter: true,
    growth: true,
    pro: true,
  },
  {
    category: "Strategy & Support",
    name: "Monthly 1-on-1 strategy call",
    starter: false,
    growth: true,
    pro: true,
  },
  {
    category: "Strategy & Support",
    name: "Campaign / ad creative support",
    starter: false,
    growth: false,
    pro: true,
  },
];

/**
 * Frequently Asked Questions (neutral, editable, no guarantees)
 */
export interface SocialFaqItem {
  question: string;
  answer: string;
}

export const socialFaqs: SocialFaqItem[] = [
  {
    question: "Which platforms do you manage?",
    answer: "We primarily work with Instagram, LinkedIn, Facebook, and X. You can choose the platforms that best match where your ideal customers spend time.",
  },
  {
    question: "Who creates the graphics, carousels and videos?",
    answer: "We design on-brand static graphics, multi-slide carousels, and edit short vertical video clips (Reels / Shorts) using your brand assets, product footage, or provided b-roll.",
  },
  {
    question: "Do I get to approve posts before they are published?",
    answer: "Yes. Every month, we prepare a draft content calendar with captions, visual assets, and posting dates for your team to review, give feedback on, and approve before anything goes live.",
  },
  {
    question: "Can I adjust my plan or pause if needed?",
    answer: "Yes. Plans are billed month-to-month with no lock-in contracts. You can upgrade, change deliverables, or pause with 14 days notice before your next billing cycle.",
  },
  {
    question: "Do you guarantee follower numbers or viral reach?",
    answer: "No. Organic algorithms and audience tastes cannot be artificially guaranteed. We focus on consistent quality, on-brand aesthetics, and genuine engagement that builds lasting trust over time.",
  },
  {
    question: "How do we get started?",
    answer: "Pick a plan or build a custom setup, send an enquiry, and we will schedule a brief kickoff call to understand your brand identity, audience, and content priorities.",
  },
];

/**
 * 3-step "How it works"
 */
export const socialProcessSteps = [
  {
    step: "01",
    title: "Tell us about your brand",
    description: "Share your brand guidelines, past content, target audience, and goals on a short kickoff call.",
  },
  {
    step: "02",
    title: "Agree your plan",
    description: "We set up your content calendar, review sample graphics and video formats, and confirm approval workflows.",
  },
  {
    step: "03",
    title: "We deliver and report every month",
    description: "We handle drafting, designing, scheduling, and community replies, then deliver a clear monthly progress report.",
  },
];
