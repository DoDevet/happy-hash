import PostFeed from "@/components/community/post-Feed";
import Layout from "@/components/layout";
import { comuHashsInfo } from "@/libs/client/useAtoms";
import { PostProps } from "@/libs/client/usePostFeed";
import { cls } from "@/libs/client/utils";
import { Post } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import useSWR, { Arguments } from "swr";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
interface PostExtends extends Post {
  hashtag: {
    id: string;
    name: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
  user: {
    name: string;
    avatar: string;
    id: number;
  };
  likes: {
    length: number;
  };
}

interface DataResponse {
  ok: boolean;
  posts?: PostExtends[];
  comments?: Comment[];
}

export default function RecoardPage() {
  const router = useRouter();
  const {
    query: { type },
  } = router;
  const getKey: SWRInfiniteKeyLoader<any, Arguments> = (
    pageIndex,
    previousPageData
  ) => {
    if (previousPageData && !previousPageData.posts.length) return null;

    return (
      previousPageData?.next ||
      `/api/user/me/${type}?kind=${type}&page=${pageIndex + 1}`
    );
  };
  const setComuHashsInfo = useSetRecoilState(comuHashsInfo);
  const { data, isLoading, isValidating, mutate, setSize, size } =
    useSWRInfinite<DataResponse>(getKey);

  const posts = data?.flatMap((posts) => posts.posts);
  return (
    <Layout
      hasBackArrow
      hasTabbar
      title={
        type === "favs"
          ? "Favorit Posts"
          : type === "comments"
          ? "My Comments"
          : "My Posts"
      }
    >
      {type === "comments" ? (
        <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col divide-y dark:divide-gray-500">
          Nope
        </div>
      ) : (
        <div className={cls("w-full dark:bg-[#1e272e] dark:text-gray-200")}>
          <ul
            className={cls(
              "relative mx-auto flex h-full w-full max-w-3xl flex-col divide-y dark:divide-gray-500"
            )}
          >
            {posts?.map((post, index) => (
              <Link
                key={index}
                href={{
                  pathname: `/community/posts/${post?.id}`,
                  query: {
                    hashId: post?.hashtag.id,
                  },
                }}
                onClick={() =>
                  setComuHashsInfo([
                    { id: +post?.hashtag.id!, name: post?.hashtag.name! },
                  ])
                }
              >
                <PostFeed
                  title={post?.title!}
                  comments={post?._count.comments!}
                  comuId={undefined}
                  createdAt={post?.createdAt!}
                  hashId={post?.hashtag.id}
                  hashtag={post?.hashtag.name!}
                  isLiked={post?.likes.length === 1}
                  likes={post?.likesNum!}
                  postId={post?.id!}
                  username={post?.user.name!}
                  views={post?.views!}
                />
              </Link>
            ))}
          </ul>
          {!isValidating && (
            <div
              className={
                "text-darkblue flex cursor-pointer flex-col items-center justify-center py-2"
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
      )}
    </Layout>
  );
}
