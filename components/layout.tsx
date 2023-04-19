import { cls } from "@/libs/client/utils";
import Head from "next/head";
import { useRouter } from "next/router";

import PostMenuLayout from "./community/layout-postMenu";
import Link from "next/link";
import LayoutHeader from "./community/layout-header";
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

export default function Layout({
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
  return (
    <div className="relative mx-auto min-h-screen w-full dark:border-x-gray-700 dark:bg-[#1e272e]  dark:text-gray-200">
      <Head>
        <title>{`${title} | #happy_hash`}</title>
      </Head>
      {hasTabbar ? (
        <LayoutHeader
          title={title?.toString()}
          isModal={isModal}
          hasBackArrow={hasBackArrow}
          hasBackHome={hasBackHome}
          hasPostMenuBar={hasPostMenuBar}
          hasFilterMenu={hasFilterMenu}
        />
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
