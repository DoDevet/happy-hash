import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import { useRecoilValue } from "recoil";
import { comuFilter, selectFilter } from "@/libs/client/useAtoms";

interface PostForm {
  hashtag: { name: string };
  id: number;
  title: string;
  createdAt: Date;
  views: number;
  image: string;
  payload: string;
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
interface PostProps {
  ok: boolean;
  posts: PostForm[];
  [key: string]: any;
}

export default function usePostFeed() {
  const router = useRouter();
  const getFileterInfo = useRecoilValue(comuFilter);
  const select = useRecoilValue(selectFilter);
  const { selectHash, comuId, hashId } = router.query;
  const url = comuId ? `?comuId=${comuId}` : `?hashId=${hashId}`;
  const { data, isValidating, mutate, setSize } = useSWRInfinite<PostProps>(
    (index) =>
      `/api/community/posts${url}&page=${index + 1}${
        selectHash ? `&selectHash=${selectHash}` : ""
      }${select ? `&popular=${getFileterInfo.likesNum}` : ""}
        `,
    null,
    { revalidateFirstPage: true, revalidateOnFocus: false }
  );

  return { data, mutate, setSize, isValidating };
}
