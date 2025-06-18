import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation, query } from "../_generated/server";

export const createAgent = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    avatar: v.optional(v.string()),
    userId: v.id("users"),
    category: v.optional(v.string()),
    instructions: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not found");
    }
    const agent = await ctx.db.insert("agent", {
      name: args.name,
      description: args.description,
      userId: args.userId,
      category: args.category,
      instructions: args.instructions,
      capabilities: args.capabilities,
      avatar: args.avatar,
      isPinned: false,
      updatedAt: Date.now(),
    });

    return agent;
  },
});

export const updateAgent = mutation({
  args: {
    agentId: v.id("agent"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()),
    category: v.optional(v.string()),
    instructions: v.optional(v.string()),
    capabilities: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);

    if (!agent) {
      throw new Error("Agent not found");
    }
    const updatedAgent = await ctx.db.patch(args.agentId, {
      name: args.name,
      description: args.description,
      avatar: args.avatar,
      category: args.category,
      instructions: args.instructions,
      capabilities: args.capabilities,
      isPinned: args.isPinned,
      updatedAt: Date.now(),
    });

    return updatedAgent;
  },
});

export const deleteAgent = mutation({
  args: {
    agentId: v.id("agent"),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);

    if (!agent) {
      throw new Error("Agent not found");
    }
    await ctx.db.delete(args.agentId);

    return true;
  },
});

export const getAgentByUserId = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agent")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return agent;
  },
});

export const getAgentById = query({
  args: {
    agentId: v.id("agent"),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);

    return agent;
  },
});

export const handlePinAgent = mutation({
  args: {
    agentId: v.id("agent"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not found");
    }
    const agent = await ctx.db.get(args.agentId);

    if (!agent) {
      throw new Error("Agent not found");
    }
    const updatedAgent = await ctx.db.patch(args.agentId, {
      isPinned: !agent.isPinned,
      updatedAt: Date.now(),
    });

    return updatedAgent;
  },
});
