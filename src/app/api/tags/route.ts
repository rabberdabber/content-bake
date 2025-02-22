import { NextResponse } from "next/server";
import { tagsResponseSchema } from "@/schemas/post";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_API_URL}/posts/tags`);
    const data = await response.json();
    const validatedTags = tagsResponseSchema.parse(data);
    return NextResponse.json(validatedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
