import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserMenu from "./home-usermenu";
import React from "react";
import HomeMenu from "./home-menu";
interface LogoutResponse {
  ok: boolean;
}
function HomeNav() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const avatarURL = useImage({ imageId: user?.avatar, method: "avatar" });
  const { setTheme, theme } = useTheme();
  const [homeMenu, setHomeMenu] = useState(false);
  const [homeUserMenu, setHomeUserMenu] = useState(false);

  const [logoutMutation, { data: logoutResponse }] =
    useMutation<LogoutResponse>({
      url: "/api/user/logout",
      method: "POST",
    });

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
    <div className="relative mx-auto flex max-w-7xl items-center justify-center">
      <div className="absolute -top-0 left-5 z-50 lg:hidden ">
        <button
          onClick={() => setHomeMenu((prev) => !prev)}
          className={cls(
            "inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out focus:outline-none lg:hidden",
            homeMenu ? "bg-slate-200 dark:bg-slate-600" : ""
          )}
        >
          <svg
            className="h-5 w-5"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            {!homeMenu ? (
              <path
                className="inline-flex"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            ) : (
              <path
                className="inline-flex"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            )}
          </svg>
        </button>
      </div>
      <div className="absolute right-7 top-0 z-50 flex items-center justify-center space-x-1 text-gray-400 sm:space-x-5 lg:right-1/4 xl:space-x-5">
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5"
          >
            {theme === "dark" ? (
              <path
                className={"inline-block text-gray-400"}
                d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z"
              />
            ) : (
              <path
                className={"inline-block text-gray-400"}
                fillRule="evenodd"
                d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                clipRule="evenodd"
              />
            )}
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
            router.pathname.includes("/guide")
              ? "border-b-2 border-[#3b62a5] px-2 text-[#3b62a5] dark:text-[#3b62a5]"
              : "border-transparent dark:text-gray-400"
          )}
          href="/guide"
        >
          Guide
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
        <li className="cursor-pointer dark:text-gray-400 " onClick={onLogout}>
          Logout
        </li>
      </nav>
      {homeMenu && <HomeMenu setHomeMenu={setHomeMenu} />}
    </div>
  );
}
export default HomeNav;
