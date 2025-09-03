export interface CreatorData {
  handle: string;
  displayName: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number;
  niche: string;
  compatibilityScore: number;
  brandAlignment: Array<{ category: string; score: number }>;
  audienceDemographics: {
    ageGroups: Record<string, number>;
    topLocations: string[];
    genderSplit: Record<string, number>;
  };
  contentStyle: string[];
  recentPosts: Array<{ engagement: number; type: string }>;
  priceRange: { min: number; max: number };
}