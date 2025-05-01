//GET handler - get info events by teamId
//check auth
//get 'teamId' from params, no need validation check
//use 'Team' collection
//find team doc with '_id' and check if exists, no? RES 404 and msg 'Team not exist'
//yes? the doc has members array which has user ids strings
//check if array is empty, if yes, use delete the team using 'teamId' and RES 404 and msg 'Team not exist'
//if array has one or more member,u can use 'User' collection, write logic as follow
//check if each user exists, if one or more user do not exist, logic should have actual existing user array and patch the team's members with actual existing ones
//if all exists, no team patch should happen
//after that, using members userIds, and 'Event' collection, fetch all events for each user and store 'all' events in one array
//this just getting the data not complete handler logic yet
//ok after having all events, I will show you the logic and the result I want with an example

// what I have
// e.g. person A : 8:30 am - 10am
// person B: 7am - 9am, 10pm - 11 pm
// in obj format , would look like this
// {
// start: 8:30 am,
// end: 10 am,
// createdBy: personA 's id
// }

// Info events - what I want
// {
// start: 7 am
// end: 8: 30 am
// freeMembers: [personB]
// }
// {
// start: 8:30 am
// end: 9 am
// freeMembers: [personB, personA]
// }
// {
// start: 9 am
// end: 10 am
// freeMembers: [personA]
// }
// {
// start: 10 pm
// end: 11 pm
// freeMembers: [personB]
// }
// note - all times will actually be full iso strings

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DBMyEvent, MyEvent } from "@/app/interfaces";
import { transformEventsToInfoEvents } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get teamId from search params
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) {
      return NextResponse.json({ error: "teamId required" }, { status: 400 });
    }

    // Access Team collection
    const teamCollection = await getCollection("Team");

    // Find team document with the given ID
    const team = await teamCollection.findOne({ _id: new ObjectId(teamId) });

    // Check if team exists
    if (!team) {
      return NextResponse.json({ error: "Team not exist" }, { status: 404 });
    }

    // Check if members array is empty
    if (!team.members || team.members.length === 0) {
      // Delete the team since it has no members
      await teamCollection.deleteOne({ _id: new ObjectId(teamId) });
      return NextResponse.json({ error: "Team not exist" }, { status: 404 });
    }

    // Access User collection to verify each member exists
    const userCollection = await getCollection("User");
    const existingUsers = [];

    // Check if each user exists
    for (const memberId of team.members) {
      const user = await userCollection.findOne({
        _id: new ObjectId(memberId),
      });
      if (user) {
        existingUsers.push(memberId);
      }
    }

    // If some users don't exist, update the team's members array
    if (existingUsers.length !== team.members.length) {
      await teamCollection.updateOne(
        { _id: new ObjectId(teamId) },
        { $set: { members: existingUsers } }
      );

      // If all users were removed, delete the team and return 404
      if (existingUsers.length === 0) {
        await teamCollection.deleteOne({ _id: new ObjectId(teamId) });
        return NextResponse.json({ error: "Team not exist" }, { status: 404 });
      }

      // Update the members array for further processing
      team.members = existingUsers;
    }

    // Access Event collection
    const eventCollection = await getCollection("Event");

    // Create an array to store all events
    let allEvents: DBMyEvent[] = [];

    // Fetch events for each team member
    for (const memberId of team.members) {
      const userEvents = await eventCollection
        .find({ createdBy: memberId })
        .sort({ createdAt: -1 })
        .toArray();

      // Add user events to the combined array
      if (userEvents && userEvents.length > 0) {
        allEvents = [...allEvents, ...userEvents] as DBMyEvent[];
      }
    }

    // Sort all events by creation date (newest first)
    allEvents.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Check if any events were found
    if (allEvents.length === 0) {
      return NextResponse.json({ infoEvents: [] }, { status: 200 });
    }

    // Return all events
    const infoEvents = transformEventsToInfoEvents(allEvents);

    const teamMembers = await Promise.all(
      existingUsers.map(async (userId) => {
        const user = await userCollection.findOne(
          { _id: new ObjectId(userId) },
          { projection: { _id: 1, username: 1 } }
        );

        if (!user) throw new Error(`User with ID ${userId} not found`);
        return user;
      })
    );
    return NextResponse.json({ infoEvents, teamMembers }, { status: 200 });
  } catch (error) {
    console.error("Get team events error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
