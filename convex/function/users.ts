import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "../_generated/server";

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      return null;
    }

    return user;
  },
});

export const updateProfile = mutation({
  args: {
    data: v.object({
      name: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db.patch(userId, {
      name: args.data.name,
    });
  },
});

export const updateSubscribtion = mutation({
  args: {
    data: v.object({
      subscriptionTier: v.union(
        v.literal("Free"),
        v.literal("Plus"),
        v.literal("Pro"),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    return await ctx.db.patch(userId!, {
      subscriptionTier: args.data.subscriptionTier,
      subscriptionDate: Date.now(),
      subscriptionEnds: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });
  },
});

export const updateUserModel = mutation({
  args: {
    data: v.object({
      lastUsedModel: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    return await ctx.db.patch(userId!, {
      lastUsedModel: args.data.lastUsedModel,
    });
  },
});
