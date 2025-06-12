import { v } from "convex/values";

import { mutation, query } from "../_generated/server";

// Using this funtion API route to add message to chat
export const addMessageToChat = mutation({
  args: {
    chatId: v.string(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
  },
  handler: async (ctx, args) => {
    // Validate content is not empty
    if (!args.content.trim()) {
      throw new Error("Message content cannot be empty");
    }

    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content.trim(),
      role: args.role,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

// Getting Messages by ChatId
export const getMessagesByChatId = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    return messages;
  },
});

// using this function in deleteChatByChatId
export const deleteMessagesByChatId = mutation({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    // Delete all messages in batch
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));

    return { deletedCount: messages.length };
  },
});
