import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const response = await fetch(
      `${process.env.NEXT_API_URL}/drafts/by-slug/${params.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token.accessToken}` }),
          cache: "no-store",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching published posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch published posts" },
      { status: 500 }
    );
  }
}
