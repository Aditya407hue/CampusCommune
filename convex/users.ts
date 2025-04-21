import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

export const createProfile = mutation({
  args: {
    name: v.string(),
    role: v.union(v.literal("student"), v.literal("admin")),
    department: v.string(),
    graduationYear: v.number(),
    skills: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if profile already exists
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (existing) throw new Error("Profile already exists");

    return await ctx.db.insert("profiles", {
      userId,
      ...args,
    });
  },
});

export const getProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) return null;

    // Fetch the user record from the 'users' table
    const user = await ctx.db.get(userId);

    if (!user) {
      console.error(`User record not found for userId: ${userId}`);
      return profile;
    }

    return {
      ...profile,
      email: user.email,
      phone: user.phone,
    };
  },
});

export const editProfile = mutation({
  args: {
    name: v.string(),
    department: v.string(),
    graduationYear: v.number(),
    skills: v.array(v.string()),
    resumeFileId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (!profile) throw new Error("Profile not found");

    return await ctx.db.patch(profile._id as Id<"profiles">, args);
  },
});

export const isAdmin = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    return profile?.role === "admin";
  },
});

export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (!profile) throw new Error("Profile not found");
    return profile;
  },
});
