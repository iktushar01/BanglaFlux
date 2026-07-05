import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json(
      { success: false, message: "API base URL is not configured" },
      { status: 500 },
    );
  }

  const search = request.nextUrl.searchParams.toString();
  const url = `${API_BASE}/channels${search ? `?${search}` : ""}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Channels proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch channels" },
      { status: 502 },
    );
  }
}
