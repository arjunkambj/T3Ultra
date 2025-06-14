import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const addCustomization = mutation({
  args: {
    userId: v.id("users"),
    whattocalluser: v.optional(v.string()),
    whatuserdoes: v.optional(v.string()),
    traitsforllm: v.optional(v.array(v.string())),
    anythingelse: v.optional(v.string()),
    preferencesofuser: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("customizations", {
      userId: args.userId,
      whattocalluser: args.whattocalluser,
      whatuserdoes: args.whatuserdoes,
      traitsforllm: args.traitsforllm,
      anythingelse: args.anythingelse,
      preferencesofuser: args.preferencesofuser,
    });
  },
});

export const getCustomization = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customizations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
  },
});
