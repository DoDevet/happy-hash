import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import client from "@/libs/server/client";
import { Comment, Like, Post, User } from "@prisma/client";
import { NextPageContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR, { SWRConfig, useSWRConfig } from "swr";

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
  error?: string;
}

interface ToggleResponse {
  ok: boolean;
}

interface CreateCommentsForm {
  message: string;
}

interface CommentsWithUser extends Comment {
  user: User;
}

interface CommentsForm {
  comments: CommentsWithUser[];
  ok: boolean;
}

interface CreateResponse {
  ok: boolean;
}

function PostDetail() {
  const router = useRouter();
  const {
    query: { postId, comuId },
  } = router;
  const { register, handleSubmit, reset } = useForm<CreateCommentsForm>();
  const { data, mutate } = useSWR<PostForm>(`/api/community/posts/${postId}`);

  const {
    data: commentsData,
    mutate: commentsMutate,
    isLoading: commentsLoading,
  } = useSWR<CommentsForm>(`/api/community/posts/${postId}/comments`);
  const [createComments, { data: createCommentsRespose, error, loading }] =
    useMutation<CreateResponse>({
      url: `/api/community/posts/${postId}/comments`,
      method: "POST",
    });
  const [toggleFav, { loading: toggleLoading }] = useMutation<ToggleResponse>({
    url: `/api/community/posts/${postId}/fav`,
    method: "POST",
  });

  useEffect(() => {
    if (data && !data.ok) {
      router.back();
    }
  }, [data]);

  useEffect(() => {
    if (createCommentsRespose && createCommentsRespose.ok) {
      commentsMutate();
      reset();
    }
  }, [createCommentsRespose, commentsMutate]);

  const onCommentsRefreshBtn = () => {
    commentsMutate();
  };

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

  const onCreateComments = (data: CreateCommentsForm) => {
    if (loading) return;
    createComments(data);
  };
  const imageURL = useImage({ imageId: data?.post?.image });
  return (
    <div className="h-screen overflow-auto pb-20">
      <Layout
        title={`${data?.post?.title}`}
        hashTitle={data?.post?.hashtag?.name}
        hasTabbar
        hasBackArrow
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
                className="h-7 w-7 rounded-full"
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
        {/** Comments */}
        <div className="mt-4 rounded-md border bg-white shadow-sm">
          <div className="flex items-center space-x-2 border-b p-2 font-semibold">
            <span>
              {commentsData?.comments?.length
                ? commentsData?.comments?.length
                : 0}{" "}
              Comments
            </span>
            {/**새로고침 기능 */}
            <svg
              onClick={onCommentsRefreshBtn}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={cls(
                "h-4 w-4 cursor-pointer",
                commentsLoading ? "animate-spin" : ""
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <div className="divide-y shadow-sm ">
            {commentsData?.comments?.map((comment) => (
              <div className="flex" key={comment?.id}>
                <div className="flex max-w-[25%] flex-1 items-center  border-r px-2">
                  {comment?.user.avatar ? (
                    <Image
                      alt="Avatar"
                      width={500}
                      height={500}
                      className="h-7 w-7 rounded-full object-cover"
                      src={useImage({
                        imageId: comment?.user?.avatar,
                        method: "avatar",
                      })}
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-slate-400" />
                  )}

                  <span className="ml-2 text-ellipsis text-sm">
                    {comment?.user?.name}
                  </span>
                </div>
                <div className="relative flex w-full max-w-xl flex-1 flex-col justify-center break-all py-1 pb-5">
                  <span className="px-1 text-sm">{comment?.message}</span>
                  <span className="absolute bottom-0 left-0 w-full border-t bg-gray-100 px-1 text-xs text-gray-600">
                    {getDateTimeFormat(comment?.createdAt, "short")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-7 rounded-md border bg-white px-2 py-1 shadow-sm">
          <form
            onSubmit={handleSubmit(onCreateComments)}
            className="flex flex-col p-2"
          >
            <Input
              placeholder="Write Comments"
              name="comments"
              type="textArea"
              label="Write Comments"
              register={register("message", { required: true })}
            />
            <Button
              btnText="Create Comments"
              className="my-3 w-full rounded-md bg-sky-500 py-2 font-semibold text-white transition-colors hover:bg-sky-600"
              isLoading={loading}
            />
          </form>
        </div>
      </Layout>
    </div>
  );
}

export default function Page({ post, ok, error }: PostForm) {
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/community/posts/${post?.id}`]: { ok, post, error },
        },
      }}
    >
      <PostDetail />
    </SWRConfig>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
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
  if (!post) {
    return {
      props: { ok: false, error: "No post found" },
    };
  }
  return {
    props: { ok: true, post: JSON.parse(JSON.stringify(post)) },
  };
};
