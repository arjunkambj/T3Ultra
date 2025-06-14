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

  customizations: defineTable({
    userId: v.id("users"),
    whattocalluser: v.optional(v.string()),
    whatuserdoes: v.optional(v.string()),
    traitsforllm: v.optional(v.array(v.string())),
    anythingelse: v.optional(v.string()),
    preferencesofuser: v.optional(v.array(v.string())),
  }).index("userId", ["userId"]),

  chats: defineTable({
    userId: v.id("users"),
    chatId: v.string(),
    title: v.string(),
    isPinned: v.boolean(),
    updatedAt: v.optional(v.number()),
  })
    .index("byUserId", ["userId"])
    .index("byChatId", ["chatId"])
    .index("byUserIdAndUpdated", ["userId", "updatedAt"]),

  messages: defineTable({
    chatId: v.string(),
    content: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    updatedAt: v.optional(v.number()),
  }).index("byChatId", ["chatId"]),

  sharedChats: defineTable({
    userId: v.id("users"),
    chatId: v.string(),
    title: v.string(),
    isPinned: v.boolean(),
    updatedAt: v.optional(v.number()),
    expiresAt: v.optional(
      v.union(
        v.literal("1d"),
        v.literal("2d"),
        v.literal("7d"),
        v.literal("never"),
      ),
    ),
  })
    .index("byUserId", ["userId"])
    .index("byChatId", ["chatId"]),

  sharedMessages: defineTable({
    chatId: v.string(),
    content: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    updatedAt: v.optional(v.number()),
    expiresAt: v.optional(
      v.union(
        v.literal("1d"),
        v.literal("2d"),
        v.literal("7d"),
        v.literal("never"),
      ),
    ),
  }).index("byChatId", ["chatId"]),
});

export default schema;
