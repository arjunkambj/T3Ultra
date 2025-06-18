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
    lastUsedModel: v.optional(v.string()),
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

  memory: defineTable({
    userId: v.id("users"),
    memory: v.string(),
    category: v.optional(v.string()),
  }).index("userId", ["userId"]),

  projects: defineTable({
    userId: v.id("users"),
    projectId: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    instructions: v.string(),
  })
    .index("userId", ["userId"])
    .index("projectId", ["projectId"]),

  chats: defineTable({
    userId: v.id("users"),
    chatId: v.string(),
    title: v.string(),
    isProjectChat: v.optional(v.boolean()),
    projectId: v.optional(v.string()),
    isPinned: v.boolean(),
    updatedAt: v.optional(v.number()),
  })
    .index("byUserId", ["userId"])
    .index("byChatId", ["chatId"])
    .index("byUserIdAndUpdated", ["userId", "updatedAt"])
    .index("byProjectId", ["projectId"]),

  messages: defineTable({
    chatId: v.string(),
    content: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
      v.literal("data"),
    ),
    updatedAt: v.optional(v.number()),
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
    messageId: v.optional(v.string()),
    chatId: v.string(),
    content: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
      v.literal("data"),
    ),
    updatedAt: v.optional(v.number()),
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
