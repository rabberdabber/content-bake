import { z } from "zod";

export const UserDashboardInfoSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  email: z.string().email(),
  is_superuser: z.boolean(),
});

export const PopularTagSchema = z.object({
  name: z.string(),
  count: z.number(),
});

export const TagDistributionSchema = z.object({
  name: z.string(),
  count: z.number(),
});

export const DashboardStatsSchema = z.object({
  user: UserDashboardInfoSchema,
  total_posts: z.number(),
  user_posts: z.number(),
  user_drafts: z.number(),
  popular_tags: z.array(PopularTagSchema),
  tag_distribution: z.array(TagDistributionSchema),
});

// TypeScript types derived from the schemas
export type UserDashboardInfo = z.infer<typeof UserDashboardInfoSchema>;
export type PopularTag = z.infer<typeof PopularTagSchema>;
export type TagDistribution = z.infer<typeof TagDistributionSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
