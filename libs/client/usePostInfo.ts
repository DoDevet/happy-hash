import { Like, Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
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
interface PostForm {
  ok: boolean;
  post: PostWithHashtag;
  isFav: boolean;
  isMine: boolean;
  error?: string;
}

export default function usePostInfo() {
  const router = useRouter();
  const {
    query: { comuId, postId },
  } = router;
  const { data, mutate } = useSWR<PostForm>(
    postId ? `/api/community/posts/${postId}` : null
  );

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
