import { v } from "convex/values";
import { mutation} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    summary:v.optional(v.union((v.string()), v.null())),
    mailId: v.id("mails"),
    companyName: v.string(),
  },
  handler: async (ctx, args) => {
    // const userId = await getAuthUserId(ctx);
    // if (!userId) throw new Error("Not authenticated");

    // Verify admin status
    const job = await ctx.db
      .query("jobs").filter((q) => q.eq(q.field("company"), args.companyName)).unique();
  
    if (!job) throw new Error("Job not found");

    // Destructure args to handle them correctly
    const { mailId,summary } = args;

    return await ctx.db.insert("jobUpdates", {
      summary: summary,
      mailId: mailId,
      jobId: job._id,
    });
  },
});