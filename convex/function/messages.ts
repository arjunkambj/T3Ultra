import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation, query } from "../_generated/server";

// Using this funtion API route to add message to chat
export const addMessageToChat = mutation({
  args: {
    chatId: v.string(),
    content: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
      v.literal("data"),
    ),
    annotations: v.optional(v.array(v.any())),
    parts: v.optional(v.array(v.any())),
    experimental_attachments: v.optional(
      v.array(
        v.object({
          name: v.optional(v.string()),
          contentType: v.optional(v.string()),
          url: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    // Validate content is not empty
    if (!args.content.trim()) {
      throw new Error("Message content cannot be empty");
    }

    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content.trim(),
      role: args.role,
      annotations: args.annotations,
      parts: args.parts,
      experimental_attachments: args.experimental_attachments,
    });

    return messageId;
  },
});

// Add UIMessage to chat with full structure support
export const addUIMessageToChat = mutation({
  args: {
    chatId: v.string(),
    content: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
      v.literal("data"),
    ),
    annotations: v.optional(v.array(v.any())),
    parts: v.optional(v.array(v.any())),
    experimental_attachments: v.optional(
      v.array(
        v.object({
          name: v.optional(v.string()),
          contentType: v.optional(v.string()),
          url: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    // Validate content is not empty
    if (!args.content.trim()) {
      throw new Error("Message content cannot be empty");
    }

    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content.trim(),
      role: args.role,
      annotations: args.annotations,
      parts: args.parts,
      experimental_attachments: args.experimental_attachments,
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
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    // Transform to match UIMessage structure
    return messages.map((message) => ({
      id: message._id,
      chatId: message.chatId,
      content: message.content,
      role: message.role,
      updatedAt: message.updatedAt,
      annotations: message.annotations || [],
      parts: message.parts || [],
      experimental_attachments: message.experimental_attachments || [],
    }));
  },
});

// using this function in deleteChatByChatId
export const deleteMessagesByChatId = mutation({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    // Delete all messages in batch
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));

    return { deletedCount: messages.length };
  },
});
