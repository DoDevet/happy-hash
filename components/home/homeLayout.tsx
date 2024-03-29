import { isOpen } from "@/libs/client/useAtoms";
import { cls } from "@/libs/client/utils";
import Head from "next/head";
import { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import Modal from "./modal";
import HashRanking from "./home-HashRanking";
import HomeNav from "./home-nav";
import SearchForm from "./home-searchForm";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

interface HomeLayoutProps {
  children: ReactNode;
  title: string;
}

export default function HomeLayout({ children, title }: HomeLayoutProps) {
  const router = useRouter();
  const open = useRecoilValue(isOpen);
  return (
    <>
      <AnimatePresence mode="wait">{open && <Modal />}</AnimatePresence>
      <div
        className={cls(
          "z-50 box-border h-full w-full overflow-auto bg-white dark:bg-[#1e272e] dark:text-gray-300"
        )}
      >
        <Head>
          <title>{`${title} | #happy_hash`}</title>
        </Head>
        <header className="fixed top-0 z-10 w-full bg-inherit pb-2 pt-8 shadow dark:bg-[#1e272e]">
          <HomeNav />
          {router.pathname.startsWith("/search") ? (
            <SearchForm />
          ) : (
            <HashRanking />
          )}
        </header>
        <div className="mx-auto w-full pt-40 dark:bg-[#1e272e]">{children}</div>
      </div>
    </>
  );
}
