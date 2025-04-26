import { getCollection } from "@/lib/mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";
import { hashPassword } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    // Check if user is already logged in
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json(
        { error: "Cannot sign up while logged in" },
        { status: 400 }
      );
    }

    // Parse request body
    const userData = await req.json();

    // Get user collection
    const userCollection = await getCollection("User");

    // Check if email already exists
    const existingUser = await userCollection.findOne({
      username: userData.username,
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Create user with verification token
    const newUser = {
      ...userData,
      password: await hashPassword(userData.password),
      createdAt: new Date(),
    };

    // Insert user into database
    const result = await userCollection.insertOne(newUser);

    if (result.acknowledged) {
      return NextResponse.json(
        { message: "User registered. " },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
