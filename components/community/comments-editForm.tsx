import { commentsEditSelector, commentsSelector } from "@/libs/client/useAtoms";
import useComments from "@/libs/client/useComments";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";

interface EditCommentsProps {
  message: string;
}
interface EditResponseData {
  ok: boolean;
  error?: string;
}
export default function EditComments() {
  const router = useRouter();
  const {
    query: { postId },
  } = router;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<EditCommentsProps>();

  const [updateComments, { data, loading, error }] =
    useMutation<EditResponseData>({
      url: `/api/community/posts/${postId}/comments`,
      method: "PATCH",
    });
  const { commentsMutate } = useComments();
  const [editSelector, setEditSelector] = useRecoilState(commentsSelector);
  const onClickCancel = () => {
    setEditSelector({
      editModalOpen: false,
      menuOpen: false,
      message: "",
      commentsId: 0,
    });
  };
  const onValid = (data: EditCommentsProps) => {
    if (loading) return;

    if (data.message === editSelector.message) {
      onClickCancel();
    }
    updateComments({
      commentsId: editSelector.commentsId,
      message: data.message,
    });
  };
  useEffect(() => {
    if (editSelector.message) {
      setValue("message", editSelector.message);
    }
  }, [editSelector, setValue]);

  useEffect(() => {
    if (data && data.ok) {
      commentsMutate();
      onClickCancel();
    }
  }, [data]);

  return (
    <div>
      <form
        className="flex w-full flex-col px-2 py-1 text-sm"
        onSubmit={handleSubmit(onValid)}
      >
        <textarea
          {...register("message", { required: true })}
          placeholder="Write...."
          className={cls(
            "h-auto resize-none rounded-md border-2 p-2 shadow-sm outline-none transition-colors",
            errors?.message
              ? "border-red-400 focus:border-red-400"
              : "focus:border-sky-500"
          )}
        />
        <div className="my-2 flex items-center justify-end space-x-5 px-2">
          <span
            onClick={onClickCancel}
            className="cursor-pointer rounded-md bg-red-400 px-2 py-1 text-sm text-white shadow-sm transition-colors hover:bg-red-500"
          >
            Cancel
          </span>
          <button className="relative w-28 rounded-md bg-sky-500 px-2 py-1 text-white shadow-sm transition-colors hover:bg-sky-600">
            {loading ? "Editing..." : "Edit comments"}
          </button>
        </div>
      </form>
    </div>
  );
}
