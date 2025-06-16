import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { query } from "../_generated/server";
import { v4 as uuidv4 } from "uuid";

export const createShareChat = mutation({
  args: {
    chatId: v.string(),
    userId: v.id("users"),
    expiresAt: v.optional(
      v.union(
        v.literal("1d"),
        v.literal("2d"),
        v.literal("7d"),
        v.literal("never"),
      ),
    ),
    shareId: v.string(),
  },
  handler: async (ctx, args) => {
    const { chatId, userId, expiresAt, shareId } = args;

    const originalMessages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .collect();

    const originalChat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .first();

    const createShare = await ctx.db.insert("sharedChats", {
      chatId: shareId,
      userId,
      expiresAt,
      title: originalChat?.title || "",
      isPinned: false,
      updatedAt: Date.now(),
    });

    for (const message of originalMessages) {
      await ctx.db.insert("sharedMessages", {
        chatId: shareId,
        content: message.content,
        role: message.role,
        annotations: message.annotations,
        parts: message.parts,
        experimental_attachments: message.experimental_attachments,
        updatedAt: Date.now(),
        expiresAt,
      });
    }
    return createShare;
  },
});

export const getSharedChatMessages = query({
  args: {
    chatId: v.string(),
  },
  handler: async (ctx, args) => {
    const { chatId } = args;

    const sharedMessages = await ctx.db
      .query("sharedMessages")
      .withIndex("byChatId", (q) => q.eq("chatId", chatId))
      .collect();

    return sharedMessages;
  },
});
