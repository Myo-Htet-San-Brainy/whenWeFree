import { CustomError } from "@/lib/customError";
import axios from "axios";

interface CreateTeamParams {
  userId: string;
  teamName: string;
}

export async function createTeam({
  userId,
  teamName,
}: CreateTeamParams): Promise<string> {
  try {
    const response = await axios.post("/api/teams", {
      userId,
      teamName,
    });

    if (response.status !== 201) {
      throw new Error("Failed to create team");
    }

    const { joinCode } = response.data;
    return joinCode;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to create a team.");
      } else if (status === 500) {
        throw new Error(
          "Something went wrong on the server. Please try again later."
        );
      } else {
        throw new Error("Unknown error. Please try again later.");
      }
    }

    throw new Error("Failed to create team. Please try again.");
  }
}

interface GetTeamParams {
  joinCode?: string;
  teamId?: string;
}

export interface Team {
  _id: string; // converted from ObjectId to string when sending to frontend
  teamName: string;
  joinCode: string;
  members: string[]; // array of user IDs (as strings)
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export async function getTeam({
  joinCode,
  teamId,
}: GetTeamParams): Promise<Team> {
  try {
    const response = await axios.get(
      `/api/teams/team?joinCode=${joinCode}&teamId=${teamId}`
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch team");
    }
    const { team } = response.data;
    return team;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to create a team.");
      } else if (status === 500) {
        throw new Error(
          "Something went wrong on the server. Please try again later."
        );
      } else if (status === 404) {
        throw new Error("Check join code and try again.");
      } else {
        throw new Error("Unknown reason. Please try again later.");
      }
    }

    throw new Error("Failed to fetch team. Please try again.");
  }
}

interface JoinTeamParams {
  teamId: string;
  userId: string;
}

export async function joinTeam({
  teamId,
  userId,
}: JoinTeamParams): Promise<void> {
  try {
    const response = await axios.patch("/api/teams/team", {
      teamId,
      userId,
    });

    if (response.status !== 200) {
      throw new Error("Failed to join team");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to join a team.");
      } else if (status === 404) {
        throw new Error("Team not found.");
      } else if (status === 400) {
        throw new Error("You already joined this team.");
      } else if (status === 500) {
        throw new Error(
          "Something went wrong on the server. Please try again later."
        );
      } else {
        throw new Error("Unknown error. Please try again later.");
      }
    }

    throw new Error("Failed to join team. Please try again.");
  }
}

interface GetTeamsParams {
  userId: string;
}

export async function getTeams({ userId }: GetTeamsParams): Promise<Team[]> {
  try {
    console.log("userid in service", userId);
    const response = await axios.get(`/api/teams?userId=${userId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch teams");
    }

    const { teams } = response.data;
    return teams;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;

      if (status === 401) {
        throw new Error("You must be logged in to view your teams.");
      } else if (status === 404) {
        throw new CustomError("No teams found for your account.", 404);
      } else if (status === 500) {
        throw new Error(
          "Something went wrong on the server. Please try again later."
        );
      } else {
        throw new Error("Unknown error occurred. Please try again later.");
      }
    }

    throw new Error("Failed to fetch teams. Please try again.");
  }
}
