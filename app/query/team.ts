import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam, getTeam, getTeams, joinTeam } from "../services/team";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CustomError } from "@/lib/customError";
import { createEvent } from "../services/events";

//will fetch when either joinCode or teamId is truthy
export const useGetTeam = ({
  teamId,
  joinCode,
}: {
  teamId?: string;
  joinCode?: string;
}) => {
  let queryKey: any[] = [];
  if (teamId) {
    queryKey = ["team", teamId];
  } else if (joinCode) {
    //note - getting a team with join code is rare
    queryKey = ["team", joinCode];
  }
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getTeam({ joinCode, teamId }),
    enabled: Boolean(teamId) || Boolean(joinCode) || false,
  });
};

export const useGetTeams = ({ userId }: { userId?: string }) => {
  userId = userId as string;
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => getTeams({ userId }),
    enabled: Boolean(userId),
  });
};

export const useJoinTeamMutation = () => {
  const queryClient = useQueryClient(); // ✨ get query client

  return useMutation({
    mutationFn: joinTeam,
    onMutate(variables) {
      toast.loading("Joining...", { id: "join-toast-id" });
    },
    onSuccess(data, variables, context) {
      toast.success("Joined", { id: "join-toast-id" });

      // ✅ Invalidate 'teams' query key to refetch latest teams
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
    onError(error: any, variables, context) {
      toast.error(error.message, { id: "join-toast-id" });
    },
  });
};

export const useCreateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
