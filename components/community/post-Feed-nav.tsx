import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
interface PostFeedNavProps {
  comuId: string;
  title: string;
  hashs: string[] | undefined | null;
}

function PostFeedNav({ comuId, title, hashs }: PostFeedNavProps) {
  const router = useRouter();
  const {
    query: { selectHash },
  } = router;

  return (
    <div className="fixed top-14 z-40 mx-auto h-12 w-full border-b bg-inherit py-1 dark:border-gray-500">
      <div className="mx-auto flex w-full max-w-3xl items-center space-x-5 px-4 py-2">
        <Link
          href={`/community/posts?comuId=${comuId}`}
          className={cls(
            "border-b",
            !selectHash
              ? "border-[rgb(59,98,165)] text-[#3b62a5]"
              : "border-transparent"
          )}
          replace
          shallow
        >
          {title}
        </Link>
        {hashs?.map((hash) => (
          <Link
            href={`/community/posts?comuId=${comuId}&selectHash=${hash}`}
            key={hash}
            replace
            shallow
            className={cls(
              "border-b",
              selectHash === hash
                ? "border-[#3b62a5] text-[#3b62a5]"
                : "border-transparent"
            )}
          >
            {hash}
          </Link>
        ))}
      </div>
    </div>
  );
}
export default React.memo(PostFeedNav);
