import { v } from "convex/values";
import { mutation} from "./_generated/server";
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
    const {mailContent, attachmentLinks, classification, reason } = args;

    return await ctx.db.insert("mails", {
      mailContent,
      noOfAttachments: attachmentLinks.length, // Assuming attachmentLinks is an array of links, adjust as needed for your implementatio
      attachmentLinks,
      classification,
      reason,
    });
  },
});