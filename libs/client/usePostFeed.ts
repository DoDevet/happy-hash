import FixedButton from "@/components/fixed-btn";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import React, { useEffect, useState } from "react";
import PostFeed, { PostFeedProps } from "@/components/community/post-Feed";
import PostModalDetail from "@/components/community/post-modal";
import getQueryUrl from "@/libs/client/getQueryUrl";
import Link from "next/link";
import { useInfiniteScroll } from "@/libs/client/useInfiniteScroll";
import { NextPageContext } from "next";
import { withSsrSession } from "@/libs/server/withSession";
import client from "@/libs/server/client";
import { cls } from "@/libs/client/utils";
import PostFeedNav from "@/components/community/post-Feed-nav";
import usePostInfo from "@/libs/client/usePostInfo";
import { useRecoilState, useRecoilValue } from "recoil";
import { prevPostInfo } from "@/libs/client/useAtoms";

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
  const { selectHash, comuId, hashId } = router.query;
  const [selectPopular, setSelectPopular] = useState(false);
  const url = comuId ? `?comuId=${comuId}` : `?hashId=${hashId}`;
  const { data, isValidating, mutate, setSize } = useSWRInfinite<PostProps>(
    (index) =>
      `/api/community/posts${url}&page=${index + 1}${
        selectHash ? `&selectHash=${selectHash}` : ""
      }${selectPopular ? `&popular=${10}` : ""}
        `,
    null,
    { revalidateFirstPage: true, revalidateOnFocus: false }
  );

  return { data, mutate, setSize, isValidating };
}
