import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation, query } from "../_generated/server";
import { api } from "../_generated/api";

// Creating Chat by ChatId
export const createChatByChatId = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    // Check if chat already exists
    const existingChat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .first();

    if (existingChat) {
      return existingChat._id;
    }

    const chatId = await ctx.db.insert("chats", {
      userId: args.userId,
      title: "New Chat",
      chatId: args.chatId,
      isPinned: false,
      isProjectChat: false,
      projectId: undefined,
      updatedAt: Date.now(),
    });

    return chatId;
  },
});

// Getting Chats for sidebar
export const getChatsByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const chats = await ctx.db
      .query("chats")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return chats;
  },
});

export const getChatByChatId = query({
  args: { chatId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const chat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .first();

    return chat;
  },
});

// Updating Chat Title using action
export const updateChatTitle = mutation({
  args: {
    chatId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { chatId, title }) => {
    if (!title.trim()) {
      throw new Error("Chat title cannot be empty");
    }

    const chat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .first();

    if (!chat) {
      throw new Error("Chat not found");
    }

    await ctx.db.patch(chat._id, {
      title: title.trim(),
      updatedAt: Date.now(),
    });

    return chat._id;
  },
});

// Deleting Messages and Chat
export const deleteChatByChatId = mutation({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, { chatId }) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    // Delete all messages in the chat using the optimized function
    await ctx.runMutation(api.function.messages.deleteMessagesByChatId, {
      chatId,
    });

    // Delete the chat
    const chat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .first();

    if (chat) {
      await ctx.db.delete(chat._id);

      return { success: true };
    }

    throw new Error("Chat not found");
  },
});

export const updateChatIsPinned = mutation({
  args: {
    chatId: v.string(),
    isPinned: v.boolean(),
  },
  handler: async (ctx, { chatId, isPinned }) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const chat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .first();

    if (!chat) {
      throw new Error("Chat not found");
    }

    await ctx.db.patch(chat._id, { isPinned: isPinned, updatedAt: Date.now() });

    return chat._id;
  },
});

export const updateChatUpdatedAt = mutation({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, { chatId }) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const chat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .first();

    if (!chat) {
      throw new Error("Chat not found");
    }

    await ctx.db.patch(chat._id, { updatedAt: Date.now() });
  },
});

export const getChatsByProjectId = query({
  args: { projectId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const chats = await ctx.db
      .query("chats")
      .withIndex("byProjectId", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();

    return chats;
  },
});

export const createProjectChatByChatId = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.string(),
    projectId: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    // Check if chat already exists
    const existingChat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .first();

    if (existingChat) {
      return existingChat._id;
    }

    const chatId = await ctx.db.insert("chats", {
      userId: args.userId,
      title: "New Project Chat",
      chatId: args.chatId,
      isPinned: false,
      isProjectChat: true,
      projectId: args.projectId,
      updatedAt: Date.now(),
    });

    return chatId;
  },
});

export const createAgentChatByChatId = mutation({
  args: {
    userId: v.id("users"),
    chatId: v.string(),
    agentId: v.id("agent"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    // Check if chat already exists
    const existingChat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .first();

    if (existingChat) {
      return existingChat._id;
    }

    const chatId = await ctx.db.insert("chats", {
      userId: args.userId,
      title: "New Agent Chat",
      chatId: args.chatId,
      isPinned: false,
      isAgentChat: true,
      agentId: args.agentId,
      updatedAt: Date.now(),
    });

    return chatId;
  },
});
