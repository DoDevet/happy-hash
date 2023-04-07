import { homeMenuOpen, isOpen, userMenuOpen } from "@/libs/client/useAtoms";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { cls } from "@/libs/client/utils";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import Input from "../input";
import HomeMenu from "./home-menu";
import UserMenu from "./home-usermenu";
import Modal from "./modal";

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
export default function HomeLayout({ children, title }: HomeLayoutProps) {
  const router = useRouter();
  const { user } = useUser();
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
      className={cls("box-border min-h-screen w-full overflow-auto bg-white")}
    >
      {open && <Modal />}
      <Head>
        <title>{`${title} | #happy_hash`}</title>
      </Head>
      <header className="fixed top-0 z-10 w-full bg-inherit pt-8 shadow dark:bg-black">
        <div className="relative mx-auto flex max-w-7xl items-center justify-center">
          <div className="absolute -top-2 left-5 z-50 lg:hidden">
            <button
              onClick={() => setHomeMenu((prev) => !prev)}
              className={cls(
                "inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out focus:outline-none",
                homeMenu ? "bg-slate-200" : ""
              )}
            >
              <svg
                className="h-6 w-6"
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
          {/** darkMode, notification icon */}

          <div className="absolute -top-1 right-7 z-50 flex items-center justify-center space-x-5 text-gray-400 lg:right-1/4">
            {/*  <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
            </svg> */}

            {avatarURL ? (
              <Image
                alt="userAvatar"
                src={avatarURL}
                width={256}
                height={256}
                className="h-7 w-7 cursor-pointer rounded-full object-cover shadow-md"
                onClick={() => setHomeUserMenu((prev) => !prev)}
              />
            ) : (
              <div className="h-10 w-10 animate-pulse cursor-pointer rounded-full bg-slate-400 object-cover shadow-md" />
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
          <h1 className="text-center font-semibold text-sky-500 sm:px-10">
            <Link href={"/"} className="text-xl md:text-2xl lg:text-3xl">
              #happy_hash
            </Link>
          </h1>
          <nav className="relative hidden w-full list-none space-x-5 px-4 font-semibold text-gray-600 lg:flex">
            <Link
              href="/"
              className={cls(
                router.pathname === "/"
                  ? "border-b-2 border-sky-400 px-2 text-sky-500"
                  : "border-b-2 border-transparent px-2"
              )}
            >
              Home
            </Link>
            <Link
              className={cls(
                "border-b-2 px-2",
                router.pathname === "/guide"
                  ? "border-b-2 border-sky-400 px-2 text-sky-500"
                  : "border-transparent "
              )}
              href="/guide"
            >
              Q&A
            </Link>
            <Link
              href="/profile"
              className={cls(
                "border-b-2 px-2",
                router.pathname === "/profile"
                  ? "border-sky-400 px-2 text-sky-500"
                  : "border-transparent"
              )}
            >
              Profile
            </Link>
            <li className="cursor-pointer" onClick={onLogout}>
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
                className="absolute right-3 top-2 h-6 w-6 text-gray-400 transition-colors hover:text-sky-500"
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
      </header>
      <div className="mx-auto mt-40 w-full max-w-7xl  py-8">{children}</div>
    </div>
  );
}
