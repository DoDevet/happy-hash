import { cls } from "@/libs/client/utils";
import Head from "next/head";
import { useRouter } from "next/router";

interface LayoutProps {
  hasTabbar?: boolean;
  title?: string | string[] | undefined | null;
  hasBackArrow?: boolean;
  hashTitle?: string | undefined | null;
  hasBackHome?: boolean;
  [key: string]: any;
}

export default function Layout({
  title,
  hasTabbar,
  children,
  hasBackArrow,
  bottomTab,
  hasBackHome,
}: LayoutProps) {
  const router = useRouter();
  const onClickBackArrow = () => {
    router.beforePopState((state) => {
      state.options.scroll = false;
      return true;
    });
    router.back();
  };
  const onClickBackHome = () => {
    router.replace("/");
  };
  return (
    <div className="mx-auto w-full max-w-xl">
      <Head>
        <title>{`${title} | #happy_hash`}</title>
      </Head>
      {hasTabbar ? (
        <div className="fixed z-10 flex w-full max-w-xl items-center justify-center border-b bg-white py-5 pb-3 text-lg font-semibold">
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
          <span className="">{title}</span>
        </div>
      ) : null}
      {bottomTab ? (
        <nav className="fixed bottom-0 z-10 flex w-full max-w-xl justify-between space-x-2 border-t bg-white px-2 pb-5 text-xs text-gray-700">
          <button className="flex-1 border-t-2 border-blue-400 bg-white pt-3 text-center">
            ALL
          </button>
          <button className="flex-1 border-t-2 border-gray-200 bg-white pt-3 text-center">
            POPULAR
          </button>
        </nav>
      ) : null}
      <div className={cls("pt-16", bottomTab ? "pb-16" : "")}>{children}</div>
    </div>
  );
}
