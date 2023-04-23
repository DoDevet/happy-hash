import { User } from "@prisma/client";
import useSWR from "swr";
interface ExtendUserData extends User {
  _count: {
    comments: number;
    posts: number;
    Like: number;
  };
}
interface UserData {
  ok: boolean;
  profile: ExtendUserData;
}

export default function useUser() {
  const { data, isLoading } = useSWR<UserData>("/api/user/me");
  return { user: data?.profile, isLoading };
}
