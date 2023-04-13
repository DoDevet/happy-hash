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
    query: { comuId, postId, hashId },
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
      router.replace(
        `/community/posts?${comuId ? `comuId=${comuId}` : `hashId=${hashId}`}`,
        undefined,
        { shallow: true }
      );
    }
  }, [deleteResponse, router]);
  return (
    <div className="absolute right-0 top-8 z-30 mt-2 w-28 rounded-md border border-t-0 bg-white py-1 shadow-lg dark:border-gray-500 dark:bg-[#1e272e]">
      <div className="divide-y px-2 font-semibold text-gray-600 dark:divide-gray-500">
        <div className="flex flex-col space-y-3 py-1 outline-none">
          <Link
            href={`/community/posts/${postId}/edit?${
              comuId ? `comuId=${comuId}` : `hashId=${hashId}`
            }`}
            className={cls(
              "hover:text-darkblue rounded-md px-2 py-2 text-sm outline-none transition-colors hover:bg-slate-100 dark:text-[#3b62a5] dark:hover:bg-slate-900"
            )}
          >
            Edit Post
          </Link>
        </div>
        <div className="py-1">
          <div
            className="cursor-pointer rounded-md px-2 py-2 text-sm text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-slate-900"
            onClick={onDeleteValid}
          >
            {DeleteLoading ? "Deleting..." : "Delete Post"}
          </div>
        </div>
      </div>
    </div>
  );
}
