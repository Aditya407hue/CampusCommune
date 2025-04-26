import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const patch=mutation({
    args:{
        role: v.union(v.literal("student"), v.literal("admin"), v.literal("pr")), // Added PR role
        name: v.string(),
        department: v.string(),
        graduationYear: v.number(),
        skills: v.array(v.string()),
    },
    handler:async (ctx,args)=>{
        const userId=await getAuthUserId(ctx);
        const profile=await ctx.db.query("profiles").filter((q)=>q.eq(q.field("userId"),userId)).unique();
        if(!profile){
            throw new Error("Profile not found");
        }
        await ctx.db.patch(profile._id,args);
    }


})