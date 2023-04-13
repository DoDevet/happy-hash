import FixedButton from "@/components/fixed-btn";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite";
import { useEffect, useState } from "react";
import PostFeed, { PostFeedProps } from "@/components/community/post-Feed";
import PostModalDetail from "@/components/community/post-modal";
import getQueryUrl from "@/libs/client/getQueryUrl";
import Link from "next/link";
import { useInfiniteScroll } from "@/libs/client/useInfiniteScroll";
import { NextPageContext } from "next";
import { withSsrSession } from "@/libs/server/withSession";
import client from "@/libs/server/client";
import { cls } from "@/libs/client/utils";
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

export default function HashCommunity({
  ok,
  title,
  comuId,
  hashId,
  posts: initialPosts,
}: PostProps) {
  const router = useRouter();
  const { postId } = router.query;
  const url = comuId ? `?comuId=${comuId}` : `?hashId=${hashId}`;
  const queryUrl = getQueryUrl({
    comuId: comuId?.toString(),
    hashId: hashId?.toString(),
  });
  const [postInfo, setPostInfo] = useState<PostFeedProps | undefined>();
  const { data, setSize, isValidating, mutate } = useSWRInfinite(
    (index) => `/api/community/posts${url}&page=${index + 1}`,
    null,
    { fallbackData: [{ ok, posts: initialPosts }] }
  );
  const isEmpty = data?.[0]?.posts.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts.length < 20);
  const handleScroll = useInfiniteScroll({
    isEnd: isReachingEnd,
    isLoading: isValidating,
  });
  useEffect(() => {
    if (isReachingEnd) return;
    else setSize(handleScroll);
  }, [handleScroll, isEmpty, isReachingEnd]);

  useEffect(() => {
    if (!postId) {
      document.body.style.overflow = "unset";
      mutate();
    }
    if (postId) {
      document.body.style.overflow = "hidden";
    }
  }, [postId, mutate]);

  const posts = data?.flatMap((post) => post.posts);
  return (
    <div>
      {postId && (
        <div className="fixed z-50 mx-auto flex h-screen w-full items-center justify-center bg-black bg-opacity-60 ">
          <PostModalDetail {...(postInfo as PostFeedProps)} />
        </div>
      )}
      <Layout title={title} hasTabbar hasBackHome bottomTab>
        <div className=" w-full dark:bg-[#1e272e] dark:text-gray-200">
          <ul
            className={cls(
              "relative mx-auto flex h-full w-full max-w-3xl flex-col divide-y dark:divide-gray-500",
              !isReachingEnd ? "pb-9" : ""
            )}
          >
            {posts?.map((post) => (
              <Link
                href={`/community/posts?postId=${post.id}&${queryUrl}`}
                as={`/community/posts/${post.id}?${queryUrl}`}
                shallow
                replace
                key={post.id}
                className="cursor-pointer"
                onClick={() => {
                  setPostInfo({
                    comments: post?._count?.comments,
                    title: post?.title,
                    createdAt: post.createdAt,
                    hashtag: post?.hashtag?.name,
                    hashId: hashId?.toString(),
                    postId: post?.id,
                    comuId: comuId?.toString(),
                    likes: post?._count?.likes,
                    username: post?.user?.name,
                    isLiked: post.likes.length !== 0,
                    views: post.views,
                    avatarId: post.user.avatar,
                    payload: post.payload,
                    image: post.image,
                  });
                }}
              >
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
                  isLiked={post?.likes?.length !== 0}
                  views={post?.views}
                />
              </Link>
            ))}
            {!isReachingEnd && isValidating ? (
              <div className="flex w-full items-center justify-center space-x-1">
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-5 w-5 animate-spin"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </div>
            ) : null}
          </ul>
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
        </div>
      </Layout>
    </div>
  );
}

export const getServerSideProps = withSsrSession(
  async (ctx: NextPageContext) => {
    const {
      query: { comuId, hashId, page },
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
          payload: true,
          image: true,
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
        take: 20,
        skip: page ? (+page - 1) * 20 : 0,
      });
      const title = scTag.customName ? scTag.customName : scTag.name;
      return {
        props: {
          ok: true,
          posts: JSON.parse(JSON.stringify(posts)),
          title: JSON.parse(JSON.stringify(title)),
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
          payload: true,
          image: true,
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
        take: 20,
        skip: page ? (+page - 1) * 20 : 0,
      });
      return {
        props: {
          ok: true,
          posts: JSON.parse(JSON.stringify(posts)),
          title: JSON.parse(JSON.stringify(hashInfo.name)),
          hashId: JSON.parse(JSON.stringify(hashId)),
        },
      };
    }
  }
);
