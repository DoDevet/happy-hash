import FixedButton from "@/components/fixed-btn";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";
import { useEffect } from "react";
import { NextPageContext } from "next";
import { withSsrSession } from "@/libs/server/withSession";
import client from "@/libs/server/client";

import PostFeed from "@/components/community/post-Feed";
import PostModalDetail from "@/components/community/post-modal";

export interface PostProps {
  ok: boolean;
  posts: [
    {
      hashtag: { name: string };
      id: number;
      title: string;
      createdAt: string;
      views: number;
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
  comuId?: number;
  hashId?: number;
}

function HashCommunity() {
  const router = useRouter();
  const { comuId, postId, hashId } = router.query;
  const url = comuId ? `?comuId=${comuId}` : `?hashId=${hashId}`;
  const { data, mutate } = useSWR<PostProps>(`/api/community/posts${url}`);

  useEffect(() => {
    if (!postId) {
      document.body.style.overflow = "unset";
      mutate();
    }
    if (postId) {
      document.body.style.overflow = "hidden";
    }
  }, [postId, mutate]);
  useEffect(() => {
    if (data && data.ok === false) {
      router.replace("/");
    }
  }, [data]);

  useEffect(() => {
    if (data && data.ok === false) {
      router.replace("/");
    }
  }, [data]);

  return (
    <div className="bg-white">
      {postId && (
        <div className="fixed z-50 mx-auto flex h-screen w-full items-center justify-center bg-black bg-opacity-60 ">
          <PostModalDetail />
        </div>
      )}
      {data && data.ok && (
        <Layout
          title={
            data?.title?.customName
              ? data?.title?.customName
              : data?.title?.name
          }
          hasTabbar
          hasBackHome
          bottomTab
        >
          <div className="min-h-screen w-full dark:bg-[#1e272e] dark:text-gray-200">
            {data?.error ? <span>{data.error.toString()}</span> : ""}
            <ul className="relative mx-auto flex h-full w-full max-w-3xl flex-col divide-y dark:divide-gray-500">
              {data?.posts?.map((post) => (
                <li key={post.id}>
                  <PostFeed
                    comments={post?._count?.comments}
                    title={post?.title}
                    createdAt={post.createdAt}
                    hashtag={post?.hashtag?.name}
                    hashId={hashId?.toString()}
                    postId={post?.id}
                    comuId={comuId?.toString()}
                    likes={post?._count?.likes}
                    username={post?.user?.name}
                    isLiked={post.likes.length !== 0}
                    views={post.views}
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
          </div>
        </Layout>
      )}
    </div>
  );
}

export default function Page({ ok, comuId, title, posts, hashId }: PostProps) {
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/community/posts?${
            comuId ? `comuId=${comuId}` : `hashId=${hashId}`
          }`]: {
            ok,
            comuId,
            hashId,
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
      query: { comuId, hashId },
    } = ctx;
    const user = ctx?.req?.session?.user;
    if (comuId) {
      const scTag = await client.shortcutTag.findFirst({
        where: {
          AND: [{ user: { id: +user?.id! } }, { id: +comuId! }],
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
      if (!scTag) {
        return {
          props: {
            ok: false,
            error: "Unauthorized access",
          },
        };
      }
      const hashs = scTag?.hashtags.map((hash) => ({ hashtag: hash }));
      const posts = await client.post.findMany({
        where: {
          OR: hashs,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          views: true,
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
    } else if (hashId) {
      const hashInfo = await client.hashtag.findUnique({
        where: { id: +hashId! },
      });
      if (!hashInfo) {
        return {
          props: {
            ok: false,
            error: "No founded",
          },
        };
      }
      const posts = await client.post.findMany({
        where: {
          hashtagId: +hashId!,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          views: true,
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
            customName: JSON.parse(JSON.stringify(`#${hashInfo?.name}`)),
            name: JSON.parse(JSON.stringify(hashInfo.name)),
          },
          hashId: JSON.parse(JSON.stringify(hashId)),
        },
      };
    }
  }
);
