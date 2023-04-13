import { Comment, User } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

interface CommentsWithUser extends Comment {
  user: User;
}

interface CommentsForm {
  comments: CommentsWithUser[];
  ok: boolean;
}
export default function useComments() {
  const router = useRouter();
  const {
    query: { postId },
  } = router;
  const { data, mutate, isLoading } = useSWR<CommentsForm>(
    `/api/community/posts/${postId}/comments`,
    null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  return {
    commentsData: { ...data },
    commentsMutate: mutate,
    commentsLoading: isLoading,
  };
}
