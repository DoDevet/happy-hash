import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../input";

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

  const { register, handleSubmit } = useForm<SearchForm>();

  const onSearchValid = (data: SearchForm) => {
    console.log(data);
  };
  const [logoutMutation, { data: logoutResponse }] =
    useMutation<LogoutResponse>({
      url: "/api/user/logout",
      method: "POST",
    });
  const onLogout = () => {
    logoutMutation({});
  };
  useEffect(() => {
    if (logoutResponse && logoutResponse.ok) {
      router.replace("/login");
    }
  }, [logoutResponse, router]);

  return (
    <div className="h-screen overflow-auto pb-20">
      <Head>
        <title>{`${title} | #happy_hash`}</title>
      </Head>
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-center text-3xl font-semibold text-sky-500">
          <Link href={"/"}>#happy_hash</Link>
        </h1>
        <form
          className="mt-5 flex justify-center"
          onSubmit={handleSubmit(onSearchValid)}
        >
          <div className="relative w-11/12">
            <Input
              type="text"
              placeholder="Search #hash OR Post"
              register={register("search", {
                required: true,
              })}
            />
            <button className="">
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
        <nav className="relative mb-10 flex w-full list-none space-x-5 px-4 font-semibold text-gray-600">
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
        {children}
      </div>
    </div>
  );
}
