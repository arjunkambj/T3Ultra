/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as function_branch from "../function/branch.js";
import type * as function_chats from "../function/chats.js";
import type * as function_customizations from "../function/customizations.js";
import type * as function_messages from "../function/messages.js";
import type * as function_share from "../function/share.js";
import type * as function_users from "../function/users.js";
import type * as http from "../http.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "function/branch": typeof function_branch;
  "function/chats": typeof function_chats;
  "function/customizations": typeof function_customizations;
  "function/messages": typeof function_messages;
  "function/share": typeof function_share;
  "function/users": typeof function_users;
  http: typeof http;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
