import { getCollection } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid"; // slick id generator

export async function POST(req: NextRequest) {
  try {
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get userId and teamName from body
    const { userId, teamName } = await req.json();

    // (Validation already handled on client)

    // Generate a join code
    const joinCode = nanoid(8); // 8 characters, you can adjust if u want

    // Get Team collection
    const teamCollection = await getCollection("Team");

    // Prepare new team object
    const newTeam = {
      teamName,
      joinCode,
      members: [userId], // starting with the creator as a member
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert new team into collection
    const result = await teamCollection.insertOne(newTeam);

    if (!result.acknowledged) {
      throw new Error("Failed to create team");
    }

    // Return 201 Created + joinCode
    return NextResponse.json(
      { message: "Team created successfully", joinCode },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create team error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Get Team collection
    const teamCollection = await getCollection("Team");

    // Find all teams where the userId is a member
    const teams = await teamCollection.find({ members: userId }).toArray();

    if (!teams || teams.length === 0) {
      return NextResponse.json({ error: "No teams found" }, { status: 404 });
    }

    // Return 200 OK with the list of teams
    return NextResponse.json({ teams }, { status: 200 });
  } catch (error) {
    console.error("Get teams error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
