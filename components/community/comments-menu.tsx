import { CommentsPageNav } from "@/libs/client/useAtoms";
import useComments from "@/libs/client/useComments";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

interface DeleteMutation {
  ok: boolean;
  error?: string;
}

export default function CommentsMenu({
  commentsId,
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

  const [commentsNav, setCommentsNav] = useRecoilState(CommentsPageNav);
  const { commentsData, commentsMutate } = useComments();
  const [deleteComments, { data, loading }] = useMutation<DeleteMutation>({
    url: `/api/community/posts/${postId}/comments`,
    method: "DELETE",
  });

  const onDeleteValid = () => {
    if (loading) return;
    deleteComments({ commentsId });
  };

  const onEditValid = () => {
    setEditor((prev) => !prev);
  };

  useEffect(() => {
    if (data && data.ok) {
      commentsMutate(
        (prev) =>
          prev && {
            ...prev,
            totalComments: prev.totalComments - 1,
            comments: prev.comments.filter(
              (comment: any) => comment.id !== commentsId
            ),
          },
        false
      );
      setCommentsNav({
        currentPage:
          commentsNav.currentPage >
          Math.ceil((commentsData.totalComments! - 1) / 10)
            ? Math.ceil((commentsData.totalComments! - 1) / 10)
            : commentsNav.currentPage,
        limitPage: Math.ceil((commentsData.totalComments! - 1) / 10),
      });
    }
  }, [data]);

  return (
    <div className="absolute right-0 top-3 z-30 mt-2 w-20 rounded-md border border-t-0 bg-white py-1 shadow-lg  dark:border-gray-500 dark:bg-[#1e272e]">
      <div className="divide-y px-2 font-semibold text-gray-600 dark:divide-gray-500">
        <div className="flex flex-col space-y-3 py-1 outline-none">
          <button
            className={cls(
              "rounded-md px-2 py-2 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-[#3b62a5] dark:text-[#3b62a5] dark:hover:bg-slate-900"
            )}
            onClick={onEditValid}
          >
            Edit
          </button>
        </div>
        <div className="py-1">
          <div
            className="cursor-pointer rounded-md px-2 py-2 text-sm text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-slate-900"
            onClick={onDeleteValid}
          >
            {"Delete"}
          </div>
        </div>
      </div>
    </div>
  );
}
