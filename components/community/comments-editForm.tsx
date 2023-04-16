import useComments from "@/libs/client/useComments";
import useMutation from "@/libs/client/useMutation";

import { cls } from "@/libs/client/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditCommentsProps {
  message: string;
}
interface EditResponseData {
  ok: boolean;
  error?: string;
}
export default function EditComments({
  commentsId,
  message,
  setEditor,
}: {
  commentsId: number;
  message: string;
  setEditor: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const {
    query: { postId },
  } = router;

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCommentsProps>();

  const [updateComments, { data, loading, error }] =
    useMutation<EditResponseData>({
      url: `/api/community/posts/${postId}/comments`,
      method: "PATCH",
    });
  const { commentsMutate } = useComments();

  const onClickCancel = () => {
    setEditor(false);
    reset();
  };
  const onValid = (data: EditCommentsProps) => {
    if (loading) return;

    if (data.message === message) {
      onClickCancel();
    }
    updateComments({
      commentsId,
      message,
    });
  };
  useEffect(() => {
    if (message) {
      setValue("message", message);
    }
  }, [message, setValue]);

  useEffect(() => {
    if (data && data.ok) {
      commentsMutate(
        (prev) =>
          prev && {
            ...prev,
            comments: prev?.comments.map((comment) => {
              if (comment.id === commentsId) {
                return {
                  ...comment,
                  message: getValues("message"),
                };
              } else {
                return comment;
              }
            }),
          },
        false
      );
      onClickCancel();
    }
  }, [data]);

  return (
    <div>
      <form
        className="flex w-full flex-col px-2 py-1 text-sm dark:border-gray-500"
        onSubmit={handleSubmit(onValid)}
      >
        <textarea
          {...register("message", { required: true })}
          placeholder="Write...."
          className={cls(
            "h-auto resize-none rounded-md border-2 p-2 shadow-sm outline-none transition-colors dark:border-gray-500 dark:bg-gray-800",
            errors?.message
              ? "border-red-400 focus:border-red-400"
              : "focus:border-[#3b62a5] dark:focus:border-[#2c5398]"
          )}
        />
        <div className="my-2 flex items-center justify-end space-x-5 px-2">
          <span
            onClick={onClickCancel}
            className="cursor-pointer rounded-md bg-red-400 px-2 py-1 text-sm text-white shadow-sm transition-colors hover:bg-red-500"
          >
            Cancel
          </span>
          <button className="bg-darkblue bg-darkerblue relative w-28 rounded-md px-2 py-1 text-white shadow-sm transition-colors">
            {loading ? "Editing..." : "Edit comments"}
          </button>
        </div>
      </form>
    </div>
  );
}
