import { type PutBlobResult } from "@vercel/blob";
import { atom } from "jotai";

export const AttachmentsAtom = atom<PutBlobResult[]>([]);
