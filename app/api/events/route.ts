import { getCollection } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

// Create event
export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get event data and userId from body
    const { event, userId } = await req.json();

    //delete the temp id from event
    delete event.id;

    // Prepare event object
    const newEvent = {
      ...event,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Access Event collection
    const eventCollection = await getCollection("Event");

    // Insert new event
    const result = await eventCollection.insertOne(newEvent);

    if (!result.acknowledged) {
      throw new Error("Failed to create event");
    }

    // Respond with created event
    return NextResponse.json({ eventId: newEvent._id }, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Fetch user's events
export async function GET(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get userId from search params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Access Event collection
    const eventCollection = await getCollection("Event");

    // Fetch events created by this user
    const events = await eventCollection
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .toArray();

    // No events found
    if (!events || events.length === 0) {
      return NextResponse.json({ error: "No events found" }, { status: 404 });
    }

    // All good
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get 'eventId' from URL search params
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "EventId required" }, { status: 400 });
    }

    // Get 'payload' from request body
    const payload = await req.json();

    // Access Event collection
    const eventCollection = await getCollection("Event");

    // Check if event exists
    const existingEvent = await eventCollection.findOne({
      _id: new ObjectId(eventId),
    });
    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Perform the patch operation
    const result = await eventCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { $set: payload }
    );

    // Check if update was acknowledged
    if (!result.acknowledged) {
      throw new Error("Update not acknowledged");
    }

    // All good, no body needed
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Patch event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get 'eventId' from URL search params
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "EventId required" }, { status: 400 });
    }

    // Access Event collection
    const eventCollection = await getCollection("Event");

    // Check if event exists
    const existingEvent = await eventCollection.findOne({
      _id: new ObjectId(eventId),
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete the event
    const result = await eventCollection.deleteOne({
      _id: new ObjectId(eventId),
    });

    // Check if deletion was acknowledged
    if (!result.acknowledged || result.deletedCount === 0) {
      throw new Error("Failed to delete event");
    }

    // All good, respond with 204 No Content
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

//get info event by userId> team> all members & date
