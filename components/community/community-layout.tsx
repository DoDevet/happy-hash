import { postMenuOpen } from "@/libs/client/useAtoms";
import { cls } from "@/libs/client/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import PostMenu from "./post-menu";

interface LayoutProps {
  hasTabbar?: boolean;
  title?: string | string[] | undefined | null;
  hasBackArrow?: boolean;
  hashTitle?: string | undefined | null;
  hasBackHome?: boolean;
  hasPostMenuBar?: boolean;
  isModal?: boolean;
  [key: string]: any;
}

export default function CommunityLayout({
  title,
  hasTabbar,
  children,
  hasBackArrow,
  bottomTab,
  hasBackHome,
  hasPostMenuBar,
  isModal = false,
}: LayoutProps) {
  const router = useRouter();
  const [postMenu, setPostMenu] = useRecoilState(postMenuOpen);

  const onClickBackArrow = () => {
    router.beforePopState((state) => {
      state.options.scroll = false;
      return true;
    });
    setPostMenu(false);
    router.back();
  };
  const onClickBackHome = () => {
    setPostMenu(false);
    router.back();
  };

  return (
    <div className="relative mx-auto min-h-screen w-full dark:border-x-gray-700 dark:bg-[#1e272e]  dark:text-gray-200">
      <Head>
        <title>{`${title} | #happy_hash`}</title>
      </Head>
      {hasTabbar ? (
        <div
          className={cls(
            "fixed z-10 w-full text-lg font-semibold dark:text-gray-200",
            isModal ? "max-w-3xl" : ""
          )}
        >
          <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center border-b bg-white py-5 pb-3  dark:border-gray-500 dark:bg-[#1e272e]">
            {hasBackArrow ? (
              <button className="absolute left-4" onClick={onClickBackArrow}>
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
            {hasPostMenuBar ? (
              <div className="absolute right-4">
                <button
                  onClick={() => setPostMenu((prev) => !prev)}
                  className={cls(
                    "inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out focus:outline-none",
                    postMenu ? "bg-slate-200 dark:bg-slate-800" : ""
                  )}
                >
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className={cls(postMenu ? "hidden" : "inline-flex")}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    ></path>
                    <path
                      className={cls(postMenu ? "inline-flex" : "hidden")}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                {hasPostMenuBar && postMenu && <PostMenu />}
              </div>
            ) : null}
            <span>{title}</span>
          </div>
        </div>
      ) : null}
      {bottomTab ? (
        <nav className="fixed bottom-0 z-10 w-full bg-white px-2 pb-5 text-xs text-gray-700 dark:bg-[#1e272e] dark:text-gray-200">
          <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center">
            <button className="flex-1 border-t-2 border-blue-400 bg-white pt-3 text-center dark:bg-[#1e272e] dark:text-gray-200 ">
              ALL
            </button>
            <button className="flex-1 border-t-2 border-gray-200 bg-white pt-3 text-center dark:bg-[#1e272e] dark:text-gray-200 ">
              POPULAR
            </button>
          </div>
        </nav>
      ) : null}
      <div
        className={cls(
          "min-h-screen bg-white pt-16 dark:bg-[#1e272e] dark:text-gray-200",
          bottomTab ? "pb-16" : "",
          isModal ? "mx-auto max-w-3xl" : ""
        )}
        onClick={() => {
          setPostMenu(false);
        }}
      >
        {children}
      </div>
    </div>
  );
}
