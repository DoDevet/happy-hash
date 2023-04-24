import { cls } from "@/libs/client/utils";
import Head from "next/head";
import PostMenuLayout from "./community/layout-postMenu";
import LayoutHeaderFilter from "./community/layout-header-filter";
import React from "react";
import { useRouter } from "next/router";
interface LayoutProps {
  hasTabbar?: boolean;
  title?: string | string[] | undefined | null;
  hasBackArrow?: boolean;
  hashTitle?: string | undefined | null;
  hasBackHome?: boolean;
  hasPostMenuBar?: boolean;
  isModal?: boolean;
  hasFilterMenu?: boolean;
  [key: string]: any;
}

function Layout({
  title,
  hasTabbar,
  children,
  hasBackArrow,
  bottomTab,
  hasBackHome,
  hasPostMenuBar,
  hasFilterMenu,
  isModal = false,
}: LayoutProps) {
  const router = useRouter();
  const {
    query: { comuId, hashId, selectHash, postId },
  } = router;

  const onClickBackArrow = () => {
    if (selectHash) {
      router.back();
    }
    const url = comuId
      ? `?comuId=${comuId}`
      : hashId
      ? `?hashId=${hashId}`
      : null;
    if (url) {
      router.pathname === "/community/posts"
        ? router.replace(
            `/community/posts${url}${
              selectHash ? `&selectHash=${selectHash}` : ""
            }`,
            undefined,
            {
              shallow: true,
            }
          )
        : router.back();
    } else router.back();
  };
  const onClickBackHome = () => {
    router.push("/");
  };
  return (
    <div className="relative mx-auto min-h-screen w-full dark:border-x-gray-700 dark:bg-[#1e272e]  dark:text-gray-200">
      <Head>
        <title>{`${title} | #happy_hash`}</title>
      </Head>
      {hasTabbar ? (
        <div
          className={cls(
            "fixed z-30 w-full text-lg font-semibold dark:text-gray-200",
            isModal ? "max-w-3xl" : ""
          )}
        >
          <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center border-b bg-white py-5 pb-3  dark:border-gray-500 dark:bg-[#1e272e]">
            {hasBackArrow ? (
              <button onClick={onClickBackArrow} className="absolute left-4">
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
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            ) : null}
            {hasBackHome ? (
              <button className="absolute left-4" onClick={onClickBackHome}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </button>
            ) : null}
            {hasPostMenuBar ? <PostMenuLayout /> : null}
            {hasFilterMenu ? <LayoutHeaderFilter /> : null}
            <span>{title}</span>
          </div>
        </div>
      ) : null}

      <div
        className={cls(
          "min-h-screen bg-white pt-16 dark:bg-[#1e272e] dark:text-gray-200",
          bottomTab ? "pb-16" : "",
          isModal ? "mx-auto max-w-3xl" : ""
        )}
      >
        {children}
      </div>
    </div>
  );
}
export default Layout;
