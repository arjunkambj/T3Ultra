import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const createBranchChat = mutation({
  args: {
    messageId: v.id("messages"),
    originalChatId: v.string(),
    newChatId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, { messageId, originalChatId, newChatId, userId }) => {
    const allMessages = await ctx.db
      .query("messages")
      .withIndex("byChatId", (q) => q.eq("chatId", originalChatId))
      .order("asc")
      .collect();

    const targetMessage = await ctx.db.get(messageId);
    if (!targetMessage) {
      throw new Error("Target message not found");
    }

    const branchMessages = allMessages.filter(
      (msg) => msg._creationTime <= targetMessage._creationTime,
    );

    if (branchMessages.length === 0) {
      throw new Error("No messages to branch");
    }
    const originalChat = await ctx.db
      .query("chats")
      .withIndex("byChatId", (q) => q.eq("chatId", originalChatId))
      .first();
    if (!originalChat) {
      throw new Error("Original chat not found");
    }

    const newChatDbId = await ctx.db.insert("chats", {
      userId: userId,
      chatId: newChatId,
      title: `B: ${originalChat.title}`,
      isPinned: false,
      updatedAt: Date.now(),
    });

    for (const message of branchMessages) {
      await ctx.db.insert("messages", {
        chatId: newChatId,
        content: message.content,
        role: message.role,
        updatedAt: Date.now(),
      });
    }

    return newChatDbId;
  },
});
