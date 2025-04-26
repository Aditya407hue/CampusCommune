import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    mailContent: v.string(),
    attachmentLinks: v.array(v.string()),
    classification: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    const { mailContent, attachmentLinks, classification, reason } = args;

    return await ctx.db.insert("mails", {
      isApproved: false,
      mailContent,
      noOfAttachments: attachmentLinks.length, // Assuming attachmentLinks is an array of links, adjust as needed for your implementatio
      attachmentLinks,
      classification,
      reason,
    });
  },
});

export const getUnapprovedMails = query({
  args: {},
  handler: async (ctx) => {
    const mails = await ctx.db
      .query("mails")
      .withIndex("by_isApproved", (q) => q.eq("isApproved", false))
      .collect();
    return mails;
  },
});

export const approveMail = mutation({
  args: {
    mailId: v.id("mails"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { mailId, userId } = args;
    const mail = await ctx.db.get(mailId);
    if (!mail) throw new Error("Mail not found");

    // Mark the mail as approved and store who approved it
    await ctx.db.patch(mailId, {
      isApproved: true,
      approvedBy: userId || undefined,
    });

    return mailId;
  },
});
