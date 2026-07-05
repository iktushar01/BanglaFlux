import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!API_BASE) {
    return NextResponse.json(
      { success: false, message: "API base URL is not configured" },
      { status: 500 },
    );
  }

  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/channels/${id}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Channel proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch channel" },
      { status: 502 },
    );
  }
}
