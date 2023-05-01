import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CommunityBottomTabs() {
  const router = useRouter();
  const {
    query: { mode },
  } = router;

  const allQuery = { ...router.query };
  delete allQuery.mode;
  return (
    <nav className="fixed bottom-0 z-10 w-full bg-white px-2 text-xs text-gray-700 shadow-md dark:bg-[#1e272e] dark:text-gray-200">
      <div className="relative mx-auto grid w-full max-w-3xl grid-cols-2 space-x-3">
        <Link
          replace
          shallow
          href={{ pathname: router.pathname, query: allQuery }}
          className={cls(
            "flex items-center justify-center border-t-2 py-5",
            !mode
              ? "border-[#3b62a5] dark:border-[#5f86c9] "
              : "dark:border-gray-300"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>
        <Link
          replace
          shallow
          scroll
          href={{
            pathname: router.pathname,
            query: {
              ...router.query,
              mode: "Filter",
            },
          }}
          className={cls(
            "flex items-center justify-center border-t-2 py-5",
            mode === "Filter"
              ? "border-[#3b62a5] dark:border-[#5f86c9] "
              : "dark:border-gray-300"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </Link>
        {/*  <Link
          replace
          shallow
          scroll
          href={{
            pathname: router.pathname,
            query: {
              ...router.query,
              mode: "Search",
            },
          }}
          className={cls(
            "flex items-center justify-center border-t-2 py-5",
            mode === "Search"
              ? "border-[#3b62a5] dark:border-[#5f86c9] "
              : "dark:border-gray-300"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </Link> */}
      </div>
    </nav>
  );
}
