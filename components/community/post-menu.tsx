import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface DeleteMutation {
  ok: boolean;
  error?: string;
}

export default function PostMenu() {
  const router = useRouter();
  const {
    query: { comuId, postId },
  } = router;

  const [deletePost, { data: deleteResponse, loading: DeleteLoading }] =
    useMutation<DeleteMutation>({
      url: `/api/community/posts/${postId}`,
      method: "DELETE",
    });

  const onDeleteValid = () => {
    if (DeleteLoading) return;
    deletePost({});
  };

  useEffect(() => {
    if (deleteResponse && deleteResponse.ok) {
      router.replace(`/community/${comuId}/posts`);
    }
  }, [deleteResponse, router]);
  return (
    <div className="absolute right-0 top-8 z-30 mt-2 w-28 rounded-md border border-t-0 bg-white py-1 shadow-lg">
      <div className="divide-y px-2 font-semibold text-gray-600">
        <div className="flex flex-col space-y-3 py-1 outline-none">
          <Link
            href={`/community/${comuId}/write`}
            className={cls(
              "rounded-md px-2 py-2 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-sky-500"
            )}
            // onClick={() => setOpen(false)}
          >
            Edit Post
          </Link>
        </div>
        <div className="py-1">
          <div
            className="cursor-pointer rounded-md px-2 py-2 text-sm text-red-400 transition-colors hover:bg-red-100"
            onClick={onDeleteValid}
          >
            {DeleteLoading ? "Deleting..." : "Delete Post"}
          </div>
        </div>
      </div>
    </div>
  );
}
