import { prevPostInfo, recyclePostInfo } from "@/libs/client/useAtoms";
import { useInfiniteScroll } from "@/libs/client/useInfiniteScroll";
import usePostFeed from "@/libs/client/usePostFeed";
import { cls } from "@/libs/client/utils";
import { produce } from "immer";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import PostFeed from "./post-Feed";
interface CommunityPostFeed {
  hashs: string[] | undefined;
  [key: string]: any;
}
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
export interface PostProps {
  ok: boolean;
  posts: PostForm[];
  [key: string]: any;
}
function CommunityPostFeed({ hashs }: CommunityPostFeed) {
  const { data, isValidating, setSize, mutate, size } = usePostFeed();
  const router = useRouter();
  const {
    query: { comuId, hashId, postId },
  } = router;

  const isEmpty = data?.[0]?.posts?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts?.length < 20);
  const [getPostInfo, setPostInfo] = useRecoilState(prevPostInfo);
  const setRecyclePostInfo = useSetRecoilState(recyclePostInfo);
  useInfiniteScroll({
    isLoading: isValidating,
    isEnd: isReachingEnd,
    setSize,
  });

  useEffect(() => {
    if (!postId) {
      document.body.style.overflow = "unset";
      if (getPostInfo !== undefined && data !== undefined) {
        const draft = produce(data, (draft) => {
          data.map((prevData, firstIndex) =>
            prevData.posts.map((post, secondIndex) => {
              if (post.id === getPostInfo.post.id) {
                setSize(firstIndex + 1);
                draft[firstIndex].posts[secondIndex] = {
                  ...getPostInfo.post,
                  likesNum: getPostInfo.post.likesNum,
                  likes: getPostInfo.isFav ? [{}] : [],
                  _count: {
                    likes: getPostInfo.post.likesNum,
                    comments: getPostInfo.post._count.comments,
                  },
                };
              }
            })
          );
        });
        mutate(draft, false);
        setPostInfo(undefined);
      }
    }
    if (postId) {
      document.body.style.overflow = "hidden";
    }
  }, [getPostInfo, setPostInfo, postId]);

  return (
    <div
      className={cls(
        "w-full dark:bg-[#1e272e] dark:text-gray-200",
        comuId && hashs?.length! > 1 ? "pt-11" : ""
      )}
    >
      <div
        className={cls(
          "relative mx-auto flex h-full w-full max-w-3xl flex-col divide-y dark:divide-gray-500"
        )}
      >
        {data?.map((data) =>
          data?.posts?.map((post) => (
            <div
              className="cursor-pointer"
              key={post.id}
              onClick={() => {
                router.push(
                  {
                    pathname: router.pathname,
                    query: { postId: post.id, ...router.query },
                  },
                  {
                    pathname: router.pathname + `/${post.id}`,
                    query: { ...router.query },
                  },
                  {
                    shallow: true,
                    scroll: false,
                  }
                );
                setRecyclePostInfo({
                  title: post.title,
                  _count: post._count,
                  hashtag: post.hashtag,
                  id: post.id,
                  image: post.image,
                  likesNum: post.likesNum,
                  payload: post.payload,
                  user: {
                    avatar: post.user.avatar,
                    id: post.user.id,
                    name: post.user.name,
                  },
                  views: post.views,
                  createdAt: post.createdAt,
                });
              }}
            >
              <PostFeed
                comments={post?._count?.comments}
                title={post?.title}
                createdAt={post?.createdAt}
                hashtag={post?.hashtag?.name}
                hashId={hashId?.toString()}
                postId={post?.id}
                comuId={comuId?.toString()}
                image={post.image}
                payload={post.payload}
                user={post.user}
                likes={post?.likesNum}
                username={post?.user?.name}
                isLiked={post?.likes?.length !== 0}
                views={post?.views}
              />
            </div>
          ))
        )}
      </div>
      {!isReachingEnd && !isValidating && (
        <div
          className={
            "text-darkblue flex cursor-pointer flex-col items-center justify-center py-2 dark:text-[#5f86c9]"
          }
          onClick={() => setSize((prev) => prev + 1)}
        >
          <span>Read More</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      )}
      {isValidating ? (
        <div className="flex w-full items-center justify-center space-x-1 py-5">
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
    </div>
  );
}
export default CommunityPostFeed;
