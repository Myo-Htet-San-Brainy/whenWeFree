import { getCollection } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb"; // 💡 important for _id!

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const joinCode = searchParams.get("joinCode");
    const teamId = searchParams.get("teamId");

    const teamCollection = await getCollection("Team");

    let team = null;

    if (joinCode) {
      team = await teamCollection.findOne({ joinCode });
    } else if (teamId) {
      team = await teamCollection.findOne({ _id: new ObjectId(teamId) }); // 🛠 convert string -> ObjectId
    }

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team }, { status: 200 });
  } catch (error) {
    console.error("Get team error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { teamId, userId } = await req.json();

    const teamCollection = await getCollection("Team");

    // find team by teamId
    const team = await teamCollection.findOne({ _id: new ObjectId(teamId) });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // check if user is already a member
    if (team.members.includes(userId)) {
      return NextResponse.json(
        { error: "Already joined this team" },
        { status: 400 }
      );
      // 400 (Bad Request) is more semantically correct here than 404
    }

    // add userId to members array
    const updateResult = await teamCollection.updateOne(
      { _id: new ObjectId(teamId) },
      { $push: { members: userId } }
    );

    if (!updateResult.acknowledged) {
      return NextResponse.json(
        { error: "Failed to join team" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Joined team successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Join team error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
