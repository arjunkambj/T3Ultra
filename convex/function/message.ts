import { v } from "convex/values";

import { mutation } from "../_generated/server";

export const addMessage = mutation({
  args: {
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      content: args.content,
      role: args.role,
      updatedAt: Date.now(),
    });
  },
});
