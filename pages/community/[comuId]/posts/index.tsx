import ComuFeed from "@/components/community/comuFeed";
import FixedButton from "@/components/fixed-btn";
import Layout from "@/components/layout";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";
import Modal from "react-modal";
import PostDetail from "@/components/community/post-detail";
import { useEffect, useState } from "react";
import { NextPageContext } from "next";
import { withSsrSession } from "@/libs/server/withSession";
import client from "@/libs/server/client";

interface PostProps {
  ok: boolean;
  posts: [
    {
      hashtag: { name: string };
      id: number;
      title: string;
      createdAt: string;
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
  ];
  error?: string;
  title: {
    customName?: string | null | undefined;
    name: string;
  };
  comuId: number;
}

function HashCommunity() {
  const router = useRouter();
  const { comuId, postId } = router.query;
  const { data } = useSWR<PostProps>(`/api/community/posts?comuId=${comuId}`);
  const [postIdState, setPostIdState] = useState("");

  useEffect(() => {
    if (router.query && router.query.postId) {
      setPostIdState(router.query.postId.toString());
    }
    if (router.query && !router.query.postId) {
      setPostIdState("");
    }
  }, [router, setPostIdState]);

  return (
    <div>
      {postIdState && (
        <div className="fixed z-30 flex h-screen w-full items-center justify-center bg-black bg-opacity-60 px-8 ">
          <PostDetail />
        </div>
      )}
      <Layout
        title={
          data?.title?.customName ? data?.title?.customName : data?.title?.name
        }
        hasTabbar
        hasBackHome
        bottomTab
      >
        {data?.error ? <span>{data.error.toString()}</span> : ""}

        <ul className="relative flex h-full flex-col divide-y">
          {data?.posts?.map((post) => (
            <li key={post.id}>
              <ComuFeed
                comments={post?._count?.comments}
                title={post?.title}
                createdAt={post.createdAt}
                hashtag={post?.hashtag?.name}
                postId={post?.id}
                comuId={comuId}
                likes={post?._count?.likes}
                username={post?.user?.name}
                isLiked={post.likes.length !== 0}
              />
            </li>
          ))}
          <FixedButton comuId={+comuId!}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={"none"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </FixedButton>
        </ul>
      </Layout>
    </div>
  );
}

export default function Page({ ok, comuId, title, posts }: PostProps) {
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/community/posts?comuId=${comuId}`]: {
            ok,
            comuId,
            title,
            posts,
          },
        },
      }}
    >
      <HashCommunity />
    </SWRConfig>
  );
}

export const getServerSideProps = withSsrSession(
  async (ctx: NextPageContext) => {
    const {
      query: { comuId },
    } = ctx;
    const user = ctx?.req?.session?.user;
    const scTag = await client.shortcutTag.findUnique({
      where: {
        id: +comuId!,
      },
      select: {
        hashtags: {
          select: {
            name: true,
          },
        },
        userId: true,
        customName: true,
        name: true,
        id: true,
      },
    });

    const hashs = scTag?.hashtags.map((hash) => ({ hashtag: hash }));
    const posts = await client.post.findMany({
      where: {
        OR: hashs,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            id: true,
            avatar: true,
          },
        },
        hashtag: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        likes: {
          where: {
            userId: +user?.id!,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      props: {
        ok: true,
        posts: JSON.parse(JSON.stringify(posts)),
        title: {
          customName: JSON.parse(JSON.stringify(scTag?.customName)),
          name: JSON.parse(JSON.stringify(scTag?.name)),
        },
        comuId: JSON.parse(JSON.stringify(scTag?.id)),
      },
    };
  }
);
