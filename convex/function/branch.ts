import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

import { mutation } from "../_generated/server";

export const createBranchChat = mutation({
  args: {
    messageId: v.id("messages"),
    originalChatId: v.string(),
    newChatId: v.string(),
  },
  handler: async (ctx, { messageId, originalChatId, newChatId }) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return;
    }

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
      title: originalChat.title,
      isPinned: false,
      isBranchChat: true,
      updatedAt: Date.now(),
      isAgentChat: originalChat.isAgentChat,
      agentId: originalChat.agentId,
      projectId: originalChat.projectId,
    });

    for (const message of branchMessages) {
      await ctx.db.insert("messages", {
        chatId: newChatId,
        content: message.content,
        role: message.role,
        updatedAt: Date.now(),
        modelUsed: message.modelUsed,
        annotations: message.annotations,
        parts: message.parts,
        experimental_attachments: message.experimental_attachments,
      });
    }

    return newChatDbId;
  },
});
