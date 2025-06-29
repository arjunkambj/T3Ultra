import { atom } from "jotai";
import { type PutBlobResult } from "@vercel/blob";

export const attachmentAtom = atom<PutBlobResult[]>([]);
