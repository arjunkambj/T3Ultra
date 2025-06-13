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
