import CommentSection from "@/components/community/comments";
import Layout from "@/components/layout";
import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import usePostInfo from "@/libs/client/usePostInfo";
import { cls } from "@/libs/client/utils";
import client from "@/libs/server/client";
import { withSsrSession } from "@/libs/server/withSession";
import { Like, Post, User } from "@prisma/client";
import { NextPageContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SWRConfig } from "swr";

interface PostWithHashtag extends Post {
  hashtag: {
    name: string;
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

interface ToggleResponse {
  ok: boolean;
}

function PostDetail() {
  const router = useRouter();
  const {
    query: { postId },
  } = router;

  const { data, mutate } = usePostInfo();

  const [toggleFav, { loading: toggleLoading }] = useMutation<ToggleResponse>({
    url: `/api/community/posts/${postId}/fav`,
    method: "POST",
  });

  useEffect(() => {
    if (data && !data.ok) {
      router.back();
    }
  }, [data]);

  const onClickFavBtn = () => {
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isFav: !prev.isFav,
          post: {
            ...prev.post,
            _count: {
              ...prev.post._count,
              likes: data?.isFav
                ? prev.post._count.likes - 1
                : prev.post._count.likes + 1,
            },
          },
        },
      false
    );
    if (!toggleLoading) {
      toggleFav({ postId });
    }
  };

  const imageURL = useImage({ imageId: data?.post?.image });

  return (
    <div className="mx-auto h-screen max-w-xl pb-20">
      <Layout
        title={`${data?.post?.title}`}
        hashTitle={data?.post?.hashtag?.name}
        hasTabbar
        hasBackArrow
        hasPostMenuBar={data?.isMine}
      >
        {imageURL ? (
          <Image
            alt="postImage"
            src={imageURL}
            width={1024}
            height={600}
            className="h-auto w-full object-contain"
          />
        ) : (
          <div className="h-96 w-full border bg-slate-500" />
        )}
        <div className="-mt-2 w-full border border-t-0 border-gray-300 bg-white pt-2 shadow-sm">
          <div className=" flex items-center justify-between border-b p-2">
            <div className="flex items-center">
              <Image
                alt="avatar"
                width={256}
                height={256}
                src={useImage({ imageId: data?.post?.user?.avatar })}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="ml-2">{data?.post?.user.name}</span>
            </div>
            <span className="text-xs text-gray-700">
              {getDateTimeFormat(data?.post?.createdAt, "long")}
            </span>
          </div>

          <div className="p-2">
            <span className="block whitespace-pre-wrap">
              {data?.post?.payload}
            </span>
            <span className="cursor-pointer text-sm text-sky-500">
              #{data?.post?.hashtag?.name}
            </span>

            <div className="mt-4 flex items-center">
              <button onClick={onClickFavBtn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={data?.isFav ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={cls("h-6 w-6", data?.isFav ? "text-red-400" : "")}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
              <span className="ml-1">{data?.post?._count?.likes}</span>
            </div>
          </div>
        </div>
        <CommentSection />
      </Layout>
    </div>
  );
}

export default function Page({ post, ok, error, isMine, isFav }: PostForm) {
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/community/posts/${post?.id}`]: {
            ok,
            post,
            error,
            isMine,
            isFav,
          },
        },
      }}
    >
      <PostDetail />
    </SWRConfig>
  );
}

export const getServerSideProps = withSsrSession(
  async (ctx: NextPageContext) => {
    const user = ctx?.req?.session?.user;
    const post = await client.post.findUnique({
      where: {
        id: +ctx.query.postId!,
      },
      include: {
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
        likes: true,
        user: true,
      },
    });
    const isFav = Boolean(
      await client.like.findFirst({
        where: {
          user: {
            id: +user?.id!,
          },
          postId: +ctx.query.postId!,
        },
      })
    );
    if (!post) {
      return {
        props: { ok: false, error: "No post found" },
      };
    }

    return {
      props: {
        ok: true,
        post: JSON.parse(JSON.stringify(post)),
        isMine: user?.id === post.userId,
        isFav,
      },
    };
  }
);
