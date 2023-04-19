import { Like, Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import useSWR from "swr";
import { CommentsPageNav, prevPostInfo } from "./useAtoms";
interface PostWithHashtag extends Post {
  hashtag: {
    name: string;
    id: number;
  };
  likes: Like[];
  _count: {
    comments: number;
    likes: number;
  };
  user: User;
}
export interface PostForm {
  ok: boolean;
  post: PostWithHashtag;
  isFav: boolean;
  isMine: boolean;
  error?: string;
}

export default function usePostInfo() {
  const router = useRouter();
  const setCommentsNav = useSetRecoilState(CommentsPageNav);

  const {
    query: { postId },
  } = router;
  const { data, mutate } = useSWR<PostForm>(
    postId ? `/api/community/posts/${postId}` : null,
    null,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (data && data.ok) {
      setCommentsNav(() => ({
        currentPage: 1,
        limitPage: Math.ceil(data.post._count.comments / 10),
        totalComments: data.post._count.comments,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (data && !data.ok) {
      router.back();
    }
  }, [router, data]);

  if (data && data.ok) {
    return {
      ok: true,
      data,
      mutate,
    };
  } else {
    return {
      data: null,
      mutate,
    };
  }
}
