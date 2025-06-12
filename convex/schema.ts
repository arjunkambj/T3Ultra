import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),

    // Add your custom fields here
    isSubscribed: v.optional(v.boolean()),
    subscriptionTier: v.optional(
      v.union(v.literal("Free"), v.literal("Plus"), v.literal("Pro")),
    ),
    subscriptionEnds: v.optional(v.number()),
    subscriptionDate: v.optional(v.number()),
  }).index("email", ["email"]),

  chats: defineTable({
    userId: v.id("users"),
    chatId: v.string(),
    title: v.string(),
    isPinned: v.boolean(),
    updatedAt: v.optional(v.number()),
  })
    .index("byUserId", ["userId"])
    .index("byChatId", ["chatId"]),

  messages: defineTable({
    chatId: v.string(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    updatedAt: v.optional(v.number()),
    attachments: v.optional(
      v.array(
        v.object({
          type: v.union(v.literal("image"), v.literal("file")),
          url: v.string(),
          name: v.string(),
          size: v.number(),
          mimeType: v.string(),
        }),
      ),
    ),
    source: v.optional(
      v.object({
        id: v.optional(v.string()),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        url: v.optional(v.string()),
        type: v.optional(v.union(v.literal("image"), v.literal("file"))),
        favicon: v.optional(v.string()),
        size: v.optional(v.number()),
      }),
    ),
  }).index("byChatId", ["chatId"]),

  share: defineTable({
    userId: v.id("users"),
    createdAt: v.number(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    expiresAt: v.union(
      v.literal("1d"),
      v.literal("2d"),
      v.literal("1m"),
      v.literal("never"),
    ),
  }).index("byUserId", ["userId"]),
});

export default schema;
