import { Comment, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { CommentsPageNav } from "./useAtoms";

interface CommentsWithUser extends Comment {
  user: User;
}

interface CommentsForm {
  comments: CommentsWithUser[];
  ok: boolean;
  totalComments: number;
}
export default function useComments() {
  const router = useRouter();
  const {
    query: { postId },
  } = router;

  const page = useRecoilValue(CommentsPageNav);
  const { data, mutate, isLoading } = useSWR<CommentsForm>(
    `/api/community/posts/${postId}/comments?page=${page.currentPage}`,
    null
  );
  return {
    commentsData: { ...data },
    commentsMutate: mutate,
    commentsLoading: isLoading,
  };
}
