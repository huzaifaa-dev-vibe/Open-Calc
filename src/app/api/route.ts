import { NextResponse } from "next/server";

// Mark this route as static so `output: export` works.
// OpenCalc doesn't use a backend — this route is a no-op kept for
// scaffolding compatibility.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}
