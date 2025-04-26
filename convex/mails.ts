import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    mailContent: v.string(),
    attachmentLinks: v.array(v.string()),
    companyName: v.union(v.string(), v.null()),
    subject: v.union(v.string(), v.null()),
    classification: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");
    const {
      mailContent,
      attachmentLinks,
      classification,
      reason,
      subject,
      companyName,
    } = args;

    return await ctx.db.insert("mails", {
      isApproved: false,
      mailContent,
      noOfAttachments: attachmentLinks.length, // Assuming attachmentLinks is an array of links, adjust as needed for your implementatio
      attachmentLinks,
      classification,
      subject,
      companyName,
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

    // Notify admins about the mail approval
    const adminProfiles = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();

    // Create notifications for all admins
    for (const adminProfile of adminProfiles) {
      await ctx.db.insert("notifications", {
        userId: adminProfile.userId,
        type: "mail_approval",
        message: `Mail from ${mail.companyName || "Unknown Company"} has been approved`,
        read: false,
        createdAt: Date.now(),
        relatedId: mailId,
      });
    }

    return mailId;
  },
});

// Get all approved mails
export const getApprovedMails = query({
  args: {},
  handler: async (ctx) => {
    const mails = await ctx.db
      .query("mails")
      .withIndex("by_isApproved", (q) => q.eq("isApproved", true))
      .collect();
    return mails;
  },
});
