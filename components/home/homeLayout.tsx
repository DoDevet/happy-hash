import {
  comuHashsInfo,
  homeMenuOpen,
  isOpen,
  userMenuOpen,
} from "@/libs/client/useAtoms";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Input from "../input";
import HomeMenu from "./home-menu";
import UserMenu from "./home-usermenu";
import Modal from "./modal";
import useSWR from "swr";

interface SearchForm {
  search: string;
}
interface HomeLayoutProps {
  children: ReactNode;
  title: string;
}
interface LogoutResponse {
  ok: boolean;
}

interface HashRankingInfo {
  rank: number | null;
  hash: {
    name: string | null;
    id: number | null;
  };
}

interface IHashRanking {
  ok: boolean;
  hashRanking: [{ id: number; name: string; posts: [{ id: number }] }];
}

export default function HomeLayout({ children, title }: HomeLayoutProps) {
  const { setTheme, theme } = useTheme();
  const [themeMode, setThemeMode] = useState("");
  const { data: ranking } = useSWR<IHashRanking>("/api/ranking");
  const [hashrankingOpen, setHashRankingOpen] = useState(false);
  const [count, setCount] = useState(0);

  const setComuHashs = useSetRecoilState(comuHashsInfo);

  useEffect(() => {
    if (theme && theme !== themeMode) {
      setThemeMode(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (ranking && ranking.ok) {
      const intervalId = setInterval(() => {
        setCount((prev) => (prev + 1) % ranking.hashRanking.length);
      }, 6000);
      return () => clearInterval(intervalId);
    }
  }, [ranking]);

  const router = useRouter();
  const { user, isLoading } = useUser();
  const avatarURL = useImage({ imageId: user?.avatar, method: "avatar" });
  const { register, handleSubmit, getValues, reset } = useForm<SearchForm>();
  const onSearchValid = (data: SearchForm) => {
    reset();
    router.push({
      pathname: "/search",
      query: { params: data.search },
    });
  };
  const [logoutMutation, { data: logoutResponse }] =
    useMutation<LogoutResponse>({
      url: "/api/user/logout",
      method: "POST",
    });
  const open = useRecoilValue(isOpen);
  const [homeMenu, setHomeMenu] = useRecoilState(homeMenuOpen);
  const [homeUserMenu, setHomeUserMenu] = useRecoilState(userMenuOpen);
  const onLogout = () => {
    logoutMutation({});
    router.replace("/");
  };

  useEffect(() => {
    if (logoutResponse && logoutResponse.ok) {
      router.replace("/login");
    }
  }, [logoutResponse, router]);

  return (
    <div
      className={cls(
        "box-border min-h-screen w-full overflow-auto bg-white dark:bg-[#1e272e] dark:text-gray-300"
      )}
    >
      {open && <Modal />}
      <Head>
        <title>{`${title} | #happy_hash`}</title>
      </Head>
      <header className="fixed top-0 z-10 w-full bg-inherit pb-2 pt-8 shadow dark:bg-[#1e272e]">
        <div className="relative mx-auto flex max-w-7xl items-center justify-center">
          <div className="absolute -top-0 left-5 z-50 lg:hidden ">
            <button
              onClick={() => setHomeMenu((prev) => !prev)}
              className={cls(
                ":hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out focus:outline-none",
                homeMenu ? "bg-slate-200 dark:bg-slate-600" : ""
              )}
            >
              <svg
                className="h-5 w-5"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={cls(homeMenu ? "hidden" : "inline-flex")}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
                <path
                  className={cls(homeMenu ? "inline-flex" : "hidden")}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="absolute right-7 top-0 z-50 flex items-center justify-center space-x-1 text-gray-400 sm:space-x-5 lg:right-1/4 xl:space-x-5">
            <button
              onClick={() => setTheme(themeMode === "dark" ? "light" : "dark")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  className={cls(
                    themeMode === "dark" ? "inline-block" : "hidden"
                  )}
                  d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z"
                />

                <path
                  className={cls(
                    themeMode === "dark" ? "hidden" : "inline-block"
                  )}
                  fillRule="evenodd"
                  d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {avatarURL ? (
              <Image
                alt="userAvatar"
                src={avatarURL}
                width={256}
                height={256}
                className="h-8 w-8 cursor-pointer rounded-full object-cover shadow-md"
                onClick={() => setHomeUserMenu((prev) => !prev)}
              />
            ) : (
              <div
                onClick={() => setHomeUserMenu((prev) => !prev)}
                className={cls(
                  "h-8 w-8 cursor-pointer rounded-full bg-slate-400 object-cover shadow-md",
                  isLoading ? "animate-pulse" : ""
                )}
              />
            )}

            {homeUserMenu && <UserMenu />}
            <svg
              className="h-5 w-5 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
            </svg>
          </div>
          <h1 className="text-center font-semibold text-[#3b62a5] sm:px-10">
            <Link
              href={"/"}
              className="font-play text-2xl font-extrabold lg:text-3xl"
            >
              #happy_hash
            </Link>
          </h1>
          <nav className="relative hidden w-full list-none space-x-5 px-4 font-semibold text-gray-600 lg:flex">
            <Link
              href="/"
              className={cls(
                "border-b-2 px-2",
                router.pathname === "/"
                  ? "border-b-2 border-[#3b62a5] px-2 text-[#3b62a5] dark:text-[#3b62a5]"
                  : "border-b-2 border-transparent px-2 dark:text-gray-400"
              )}
            >
              Home
            </Link>
            <Link
              className={cls(
                "border-b-2 px-2",
                router.pathname === "/guide"
                  ? "border-b-2 border-[#3b62a5] px-2 text-[#3b62a5] dark:text-[#3b62a5]"
                  : "border-transparent dark:text-gray-400"
              )}
              href="/guide"
            >
              Q&A
            </Link>
            <Link
              href="/profile"
              className={cls(
                "border-b-2 px-2 dark:text-gray-400",
                router.pathname === "/profile"
                  ? "border-[#3b62a5] px-2 text-[#3b62a5]  dark:text-[#3b62a5]"
                  : "border-transparent dark:text-gray-400"
              )}
            >
              Profile
            </Link>
            <li
              className="cursor-pointer dark:text-gray-400 "
              onClick={onLogout}
            >
              Logout
            </li>
          </nav>
        </div>
        {homeMenu ? <HomeMenu /> : null}
        <form
          className="mx-auto mt-5 flex max-w-2xl justify-center"
          onSubmit={handleSubmit(onSearchValid)}
        >
          <div className="relative w-11/12 ">
            <Input
              type="text"
              placeholder="Search #hash OR Post"
              register={register("search", {
                required: true,
              })}
            />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="absolute right-3 top-2 h-6 w-6 text-gray-400 transition-colors hover:text-[#3b62a5]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        </form>
        <div className="relative mx-auto -mt-4 flex max-w-2xl items-center px-8 text-gray-400">
          {hashrankingOpen ? (
            <div className="space-y-2">
              {ranking?.hashRanking?.map((hash, index) => {
                const hashrank = String(index + 1).padStart(2);
                return (
                  <Link
                    href={`/community/posts?hashId=${hash.id}`}
                    className="flex space-x-3 text-gray-700 dark:text-gray-400"
                    key={index}
                    onClick={() => setComuHashs([{ ...hash }])}
                  >
                    <span>{" " + hashrank}.</span>
                    <span className="text-[#3b62a5] dark:text-[#5f86c9]">
                      {hash.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Link
              onClick={() =>
                setComuHashs([
                  {
                    id: ranking?.hashRanking[count].id!,
                    name: ranking?.hashRanking[count].name!,
                  },
                ])
              }
              href={`/community/posts?hashId=${ranking?.hashRanking[count].id}`}
            >
              <div className="space-x-3 text-gray-700 dark:text-gray-400  ">
                <span>{count + 1}.</span>
                <span className="text-[#3b62a5] dark:text-[#5f86c9]">
                  {ranking?.hashRanking[count]?.name}
                </span>
              </div>
            </Link>
          )}
          <div
            onClick={() => setHashRankingOpen((prev) => !prev)}
            className="absolute right-9 top-0 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={cls(
                  hashrankingOpen
                    ? "M4.5 15.75l7.5-7.5 7.5 7.5"
                    : "M19.5 8.25l-7.5 7.5-7.5-7.5"
                )}
              />
            </svg>
          </div>
        </div>
      </header>
      <div className="mx-auto mb-40 min-h-screen w-full py-4 pt-44 dark:bg-[#1e272e]">
        {children}
      </div>
    </div>
  );
}
