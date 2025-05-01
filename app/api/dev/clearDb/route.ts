import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";

// ⚠️ Optional: Add a secret to protect this route in production
const DEV_SECRET = process.env.DEV_SECRET;

export async function DELETE(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (process.env.NODE_ENV !== "development" || secret !== DEV_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teamCol = await getCollection("Team");
    const eventCol = await getCollection("Event");
    const userCol = await getCollection("User");

    await Promise.all([
      teamCol.deleteMany({}),
      eventCol.deleteMany({}),
      userCol.deleteMany({}),
    ]);

    return NextResponse.json({ message: "All data wiped ✨" }, { status: 200 });
  } catch (error) {
    console.error("[CLEAR_DB_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to clear collections" },
      { status: 500 }
    );
  }
}
