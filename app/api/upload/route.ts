import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    // Update the file type based on the kind of files you want to accept
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf", "text/csv"].includes(
          file.type,
        ),
      {
        message: "File type should be JPEG, PNG, PDF, or CSV",
      },
    ),
});

export async function POST(request: Request) {
  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get("file") as File).name;
    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await put(`${filename}`, fileBuffer, {
        access: "public",
        addRandomSuffix: true,
      });

      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json(
        { error: "Upload failed", details: error },
        { status: 500 },
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

// DELETE method to handle file deletion
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 },
      );
    }

    // Validate that the URL is a Vercel Blob URL
    if (!url.includes("blob.vercel-storage.com")) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    // Delete the file from Vercel Blob storage
    await del(url);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting file:", error);

    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
