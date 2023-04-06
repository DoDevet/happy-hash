import { commentsMenuState, commentsSelector } from "@/libs/client/useAtoms";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

interface DeleteMutation {
  ok: boolean;
  error?: string;
}

export default function CommentsMenu() {
  const router = useRouter();
  const {
    query: { postId },
  } = router;
  const [comments, setComments] = useRecoilState(commentsMenuState);
  const { mutate } = useSWRConfig();
  const [deleteComments, { data, loading }] = useMutation<DeleteMutation>({
    url: `/api/community/posts/${postId}/comments`,
    method: "DELETE",
  });

  const onDeleteValid = () => {
    if (loading) return;
    deleteComments({ commentsId: comments.commentsId });
  };

  const onEditValid = () => {
    setComments((prev) => ({ ...prev, menuOpen: false, editModalOpen: true }));
  };

  useEffect(() => {
    if (data && data.ok) {
      mutate(`/api/community/posts/${postId}/comments`);
      setComments((prev) => ({
        ...prev,
        menuOpen: false,
        commentsId: 0,
        message: "",
      }));
    }
  }, [data, mutate]);

  return (
    <div className="absolute right-0 top-3 z-30 mt-2 w-20 rounded-md border border-t-0 bg-white py-1 shadow-lg">
      <div className="divide-y px-2 font-semibold text-gray-600">
        <div className="flex flex-col space-y-3 py-1 outline-none">
          <button
            className={cls(
              "rounded-md px-2 py-2 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-sky-500"
            )}
            onClick={onEditValid}
          >
            Edit
          </button>
        </div>
        <div className="py-1">
          <div
            className="cursor-pointer rounded-md px-2 py-2 text-sm text-red-400 transition-colors hover:bg-red-100"
            onClick={onDeleteValid}
          >
            {"Delete"}
          </div>
        </div>
      </div>
    </div>
  );
}
