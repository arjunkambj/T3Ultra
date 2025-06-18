import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required" },
      { status: 400 },
    );
  }

  if (!request.body) {
    return NextResponse.json(
      { error: "Request body is required" },
      { status: 400 },
    );
  }

  try {
    // Add timestamp to filename to ensure uniqueness
    const timestamp = Date.now();
    const fileExtension = filename.includes(".")
      ? filename.substring(filename.lastIndexOf("."))
      : "";
    const baseName = filename.includes(".")
      ? filename.substring(0, filename.lastIndexOf("."))
      : filename;
    const uniqueFilename = `${baseName}-${timestamp}${fileExtension}`;

    const blob = await put(uniqueFilename, request.body, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error uploading file:", error);

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
