import { v } from "convex/values";

import { mutation } from "../_generated/server";

export const createShare = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    createdAt: v.number(),
    expiresAt: v.union(
      v.literal("1d"),
      v.literal("2d"),
      v.literal("1m"),
      v.literal("never"),
    ),
  },
  handler: async (ctx, args) => {
    const share = await ctx.db.insert("share", {
      userId: args.userId,
      expiresAt: args.expiresAt,
      content: args.content,
      role: args.role,
      createdAt: args.createdAt,
    });

    return share;
  },
});
