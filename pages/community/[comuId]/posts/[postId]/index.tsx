import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import comments from "@/pages/api/community/posts/[id]/comments";
import { Comment, Like, Post, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

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

export default function PostDetail() {
  const router = useRouter();
  const {
    query: { postId },
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
  const [toggleFav] = useMutation<ToggleResponse>({
    url: `/api/community/posts/${postId}/fav`,
    method: "POST",
  });

  useEffect(() => {
    if (createCommentsRespose && createCommentsRespose.ok) {
      reset();
      commentsMutate();
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
    toggleFav({ postId });
  };

  const onCreateComments = (data: CreateCommentsForm) => {
    if (loading) return;
    createComments(data);
  };

  return (
    <div className="pb-20">
      <Layout
        title={`${data?.post?.title}`}
        hashTitle={data?.post?.hashtag?.name}
        hasTabbar
        hasBackArrow
      >
        {data?.post?.image ? (
          <Image
            alt="postImage"
            src={useImage({ imageId: data?.post?.image })}
            width={1024}
            height={1024}
            className="w-full object-contain"
          />
        ) : (
          <div className="h-96 w-full rounded-md bg-slate-500" />
        )}
        <div className="-mt-2 w-full rounded-md border border-t-0 border-gray-300 pt-2 shadow-sm">
          <div className=" flex items-center justify-between border-b p-2">
            <div className="flex">
              <div className="h-6 w-6 rounded-full bg-slate-400" />
              <span className="ml-1">{data?.post?.user.name}</span>
            </div>
            <span className="text-xs text-gray-700">
              {getDateTimeFormat(data?.post?.createdAt, "long")}
            </span>
          </div>

          <div className="p-2">
            <p>{data?.post?.payload}</p>
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
        <div className="mt-4 rounded-md border shadow-sm">
          <div className="flex items-center space-x-2 border-b p-2 font-semibold">
            <span>{commentsData?.comments?.length} Comments</span>
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
          <div className="divide-y">
            {commentsData?.comments?.map((comment) => (
              <div className="flex " key={comment?.id}>
                <div className="flex items-center justify-center border-r p-2">
                  <div className="h-6 w-6 rounded-full bg-gray-500" />
                  <span className="ml-2 text-sm">{comment?.user?.name}</span>
                </div>
                <div className="relative flex w-full max-w-xl flex-col justify-center break-all py-1 pb-5">
                  <span className="px-1 text-sm">{comment?.message}</span>
                  <span className="absolute bottom-0 left-0 w-full border-t bg-gray-100 px-1 text-xs text-gray-600">
                    {getDateTimeFormat(data?.post?.createdAt, "short")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-7 rounded-md border px-2 py-1 shadow-md">
          <form
            onSubmit={handleSubmit(onCreateComments)}
            className="flex flex-col"
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
