import { v } from "convex/values";

import { mutation, query } from "../_generated/server";

export const createShare = mutation({
  args: {
    userId: v.id("users"),
    shareId: v.string(),
    content: v.optional(v.any()),
    createdAt: v.number(),
    expiresAt: v.union(
      v.literal("1d"),
      v.literal("2d"),
      v.literal("7d"),
      v.literal("never"),
    ),
  },
  handler: async (ctx, args) => {
    const share = await ctx.db.insert("share", {
      userId: args.userId,
      shareId: args.shareId,
      expiresAt: args.expiresAt,
      content: args.content,
      createdAt: args.createdAt,
    });

    return share;
  },
});

export const getShareByShareId = query({
  args: {
    shareId: v.string(),
  },
  handler: async (ctx, { shareId }) => {
    const share = await ctx.db
      .query("share")
      .withIndex("byShareId", (q) => q.eq("shareId", shareId))
      .first();
    return share;
  },
});

export const getShareByUserId = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const share = await ctx.db
      .query("share")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .collect();
    return share;
  },
});
