import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v4 as uuidv4 } from "uuid";

import { mutation, query } from "../_generated/server";

export const createProject = mutation({
  args: {
    name: v.string(),
    instructions: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const projectId = await ctx.db.insert("projects", {
      title: args.name,
      instructions: args.instructions,
      description: args.description,
      userId: userId,
      projectId: uuidv4(),
    });

    return projectId;
  },
});

export const getProjects = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return projects;
  },
});

export const getProjectWithChats = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return [];
    }

    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const projectsWithChats = await Promise.all(
      projects.map(async (project) => {
        const chats = await ctx.db
          .query("chats")
          .withIndex("byProjectId", (q) => q.eq("projectId", project._id))
          .order("desc")
          .collect();

        return {
          ...project,
          chats: chats,
        };
      }),
    );

    return projectsWithChats;
  },
});

export const deleteProject = mutation({
  args: {
    _id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const project = await ctx.db.get(args._id);

    if (!project) {
      return;
    }

    if (project.userId !== userId) {
      return;
    }

    // Get all chats related to this project
    const projectChats = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("projectId"), project.projectId))
      .collect();

    for (const chat of projectChats) {
      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("chatId"), chat._id))
        .collect();

      for (const message of messages) {
        await ctx.db.delete(message._id);
      }

      await ctx.db.delete(chat._id);
    }

    await ctx.db.delete(args._id);
  },
});

export const getProjectById = query({
  args: {
    projectId: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("projectId", (q) => q.eq("projectId", args.projectId))
      .first();

    return project;
  },
});
