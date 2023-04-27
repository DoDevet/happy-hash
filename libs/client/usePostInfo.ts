import { Like, Post, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import { CommentsPageNav, prevPostInfo } from "./useAtoms";
import usePostFeed from "./usePostFeed";
import { produce } from "immer";
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
  const { mutate: postFeedMutate, size } = usePostFeed();
  const {
    query: { postId },
  } = router;

  const { data, mutate } = useSWR<PostForm>(
    postId ? `/api/community/posts/${postId}` : null,
    null,
    { revalidateOnFocus: false }
  );
  const setPostInfo = useSetRecoilState(prevPostInfo);

  useEffect(() => {
    if (data && data.ok) {
      setPostInfo(data);
      setCommentsNav(() => ({
        currentPage: 1,
        limitPage: Math.ceil(data.post._count.comments / 10),
        totalComments: data.post._count.comments,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (data && !data.ok) {
      postFeedMutate((prev) => {
        if (prev) {
          const draft = produce(prev, (draft) => {
            draft[size]?.posts.filter((post) => post.id !== +postId!);
          });
          return draft;
        }
      }, false).then(() => router.back());
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
      ok: false,
      data: undefined,
      mutate,
    };
  }
}
