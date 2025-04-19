import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    description: v.string(),
    location: v.string(),
    type: v.union(
      v.literal("full-time"),
      v.literal("internship"),
      v.literal("part-time")
    ),
    skills: v.array(v.string()),
    salary: v.optional(v.number()),
    deadline: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify admin status
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (profile?.role !== "admin") throw new Error("Not authorized");

    return await ctx.db.insert("jobs", {
      ...args,
      isActive: true,
      createdBy: userId,
    });
  },
});

export const list = query({
  args: {
    onlyActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const q = ctx.db.query("jobs");
    if (args.onlyActive) {
      return await q.withIndex("by_active", (q) => q.eq("isActive", true)).collect();
    }
    return await q.collect();
  },
});

export const getById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});
