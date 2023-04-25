import { useRouter } from "next/router";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import { useRecoilValue } from "recoil";
import { comuFilter, selectFilter } from "@/libs/client/useAtoms";
import { Arguments } from "swr";

interface PostForm {
  hashtag: { name: string };
  id: number;
  title: string;
  createdAt: Date;
  views: number;
  image: string;
  payload: string;
  likesNum: number;
  user: {
    name: string;
    id: number;
    avatar: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
  likes: {
    length: number;
  };
}
export interface SSRPostProps {
  ok: boolean;
  posts: PostForm[];
  error?: string;
  title: {
    customName?: string | null | undefined;
    name: string;
  };
  comuId?: string;
  hashId?: string;
}
export interface PostProps {
  ok: boolean;
  posts: PostForm[];
  [key: string]: any;
}

export default function usePostFeed() {
  const router = useRouter();
  const getFileterInfo = useRecoilValue(comuFilter);
  const { selectHash, comuId, hashId, mode } = router.query;
  const url = comuId ? `?comuId=${comuId}` : `?hashId=${hashId}`;
  const getKey: SWRInfiniteKeyLoader<any, Arguments> = (
    pageIndex,
    previousPageData
  ) => {
    if (previousPageData && !previousPageData.posts.length) return null;
    return `/api/community/posts${url}&page=${pageIndex + 1}${
      selectHash ? `&selectHash=${selectHash}` : ""
    }${mode ? `&popular=${getFileterInfo.likesNum}` : ""}
        `;
  };
  const { data, isValidating, setSize, mutate } = useSWRInfinite<PostProps>(
    getKey,
    null,
    {
      initialSize: 1,
      parallel: true,
    }
  );

  return { data, setSize, isValidating, getKey, mutate };
}
