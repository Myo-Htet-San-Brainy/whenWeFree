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
      }
    }

    throw new Error("Failed to create team. Please try again.");
  }
}
