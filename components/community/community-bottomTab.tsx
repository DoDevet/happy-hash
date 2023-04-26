import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CommunityBottomTab() {
  //usePostFeed
  const router = useRouter();
  const {
    query: { mode },
  } = router;

  const allQuery = { ...router.query };
  delete allQuery.mode;
  return (
    <nav className="fixed bottom-0 z-10 w-full bg-white px-2 text-xs text-gray-700 shadow-md dark:bg-[#1e272e] dark:text-gray-200">
      <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center space-x-3">
        <Link
          replace
          shallow
          href={{ pathname: router.pathname, query: allQuery }}
          className={cls(
            "flex-1 border-t-2 py-5 text-center transition-colors ",
            !mode
              ? "border-[#3b62a5] dark:border-[#3b62a5]"
              : "dark:border-gray-300"
          )}
        >
          ALL
        </Link>
        <Link
          replace
          shallow
          href={{
            pathname: router.pathname,
            query: {
              ...router.query,
              mode: "Filter",
            },
          }}
          className={cls(
            "transition- flex-1  border-t-2 py-5 text-center  dark:bg-[#1e272e] dark:text-gray-200",
            mode
              ? "border-[#3b62a5] dark:border-[#3b62a5]"
              : "dark:border-gray-300"
          )}
        >
          FILTER
        </Link>
      </div>
    </nav>
  );
}
