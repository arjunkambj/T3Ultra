import { v } from "convex/values";

import { mutation, query } from "../_generated/server";

export const addMemory = mutation({
  args: {
    userId: v.id("users"),
    memory: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("memory", {
      userId: args.userId,
      memory: args.memory,
      category: args.category,
    });
  },
});

export const getMemory = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const memories = await ctx.db
      .query("memory")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return memories.map((item) => item.memory).join("\n");
  },
});

export const deleteMemory = mutation({
  args: {
    memoryId: v.id("memory"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.memoryId);
  },
});
