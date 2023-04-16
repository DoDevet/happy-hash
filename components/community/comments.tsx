import useMutation from "@/libs/client/useMutation";
import { Comment, User } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Button from "../button";
import Input from "../input";
import { useEffect, useState } from "react";
import { cls } from "@/libs/client/utils";
import CommentsFeed from "./comments-feed";
import useUser from "@/libs/client/useUser";
import useComments from "@/libs/client/useComments";
import { useRecoilState } from "recoil";
import { CommentsPageNav } from "@/libs/client/useAtoms";
import CommentsFeedLoading from "./comments-feed-loading";
interface CreateCommentsForm {
  message: string;
}

interface CreateResponse {
  ok: boolean;
}

export default function CommentSection() {
  const router = useRouter();
  const {
    query: { postId },
  } = router;

  const [refreshComments, setRefreshComments] = useState(false);
  const { register, handleSubmit, reset } = useForm<CreateCommentsForm>();
  const { commentsData, commentsMutate, commentsLoading } = useComments();
  const [commentsNav, setCommentsNav] = useRecoilState(CommentsPageNav);
  const [createComments, { data: createCommentsRespose, error, loading }] =
    useMutation<CreateResponse>({
      url: `/api/community/posts/${postId}/comments`,
      method: "POST",
    });

  const { user } = useUser();

  useEffect(() => {
    if (createCommentsRespose && createCommentsRespose.ok) {
      commentsMutate();
      setCommentsNav({
        limitPage: Math.ceil((commentsData?.totalComments! + 1) / 10),
        currentPage: Math.ceil((commentsData?.totalComments! + 1) / 10),
      });
      reset();
    }
  }, [createCommentsRespose, commentsMutate]);

  const onCommentsRefreshBtn = () => {
    setRefreshComments(true);
    commentsMutate();
    setTimeout(() => {
      setRefreshComments(false);
    }, 1000);
  };

  const onCreateComments = (data: CreateCommentsForm) => {
    if (loading) return;
    createComments(data);
  };

  return (
    <div className="pb-16">
      <div className="mt-4 rounded-md border bg-white shadow-sm dark:divide-gray-500 dark:border-gray-500 dark:bg-[#1e272e] dark:text-gray-300">
        <div className="flex items-center justify-between border-b p-2 px-2 font-semibold dark:border-gray-500">
          <div className="flex items-center space-x-2">
            <span>
              {commentsData.totalComments ? commentsData.totalComments : 0}{" "}
              Comments
            </span>
            <svg
              onClick={onCommentsRefreshBtn}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={cls(
                "h-4 w-4 cursor-pointer",
                commentsLoading || refreshComments ? "animate-spin" : ""
              )}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          {commentsNav.limitPage > 1 ? (
            <div className="mr-4 flex items-center justify-center space-x-1 rounded-md bg-[#3b62a5] px-1 text-sm text-gray-200 shadow-sm">
              <button
                onClick={() =>
                  setCommentsNav((prev) => ({
                    ...prev,
                    currentPage: commentsNav.currentPage - 1,
                  }))
                }
                disabled={commentsNav.currentPage === 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <span>
                {commentsNav.currentPage} / {commentsNav.limitPage}
              </span>
              <button
                onClick={() =>
                  setCommentsNav((prev) => ({
                    ...prev,
                    currentPage: commentsNav.currentPage + 1,
                  }))
                }
                disabled={commentsNav.currentPage === commentsNav.limitPage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
        <div className="divide-y shadow-sm  dark:border-gray-500">
          {commentsLoading
            ? new Array(5)
                .fill(null)
                .map((_, index) => <CommentsFeedLoading key={index} />)
            : commentsData?.comments?.map((comment) => (
                <CommentsFeed
                  key={comment.id}
                  commentsId={comment.id}
                  createdAt={comment.createdAt}
                  imageId={comment?.user?.avatar}
                  message={comment.message}
                  username={comment.user.name}
                  isMine={comment.userId === user?.id}
                />
              ))}
        </div>
      </div>
      <div className="mt-7 rounded-md border bg-white px-2 py-1 shadow-sm dark:border-gray-500 dark:bg-[#1e272e]">
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
            className="bg-darkblue bg-darkerblue my-3 w-full rounded-md py-2 font-semibold text-white transition-colors"
            isLoading={loading}
          />
        </form>
      </div>
    </div>
  );
}
