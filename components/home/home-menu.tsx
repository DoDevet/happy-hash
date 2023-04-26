import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface LogoutResponse {
  ok: boolean;
}
export default function HomeMenu({
  setHomeMenu,
}: {
  setHomeMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
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
    <div className="absolute top-9 z-30 w-full bg-white py-5 shadow-md dark:bg-[#1e272e]">
      <div className="divide-y px-4 font-semibold text-gray-600 dark:divide-gray-500">
        <div className="flex flex-col space-y-3 py-1 outline-none">
          <Link
            href="/"
            className={cls(
              "outline-none",
              router.pathname === "/"
                ? "px-2 py-2 text-[#3b62a5]"
                : "rounded-md px-2 py-2 transition-colors hover:bg-slate-100 hover:text-[#3b62a5] dark:text-gray-400 dark:hover:bg-slate-900"
            )}
            onClick={() => setHomeMenu(false)}
          >
            Home
          </Link>
          <Link
            className={cls(
              "outline-none",
              router.pathname.includes("/guide")
                ? "px-2 py-2 text-[#3b62a5]"
                : "rounded-md px-2 py-2 transition-colors hover:bg-slate-100 hover:text-[#3b62a5] dark:text-gray-400 dark:hover:bg-slate-900"
            )}
            onClick={() => setHomeMenu(false)}
            href="/guide"
          >
            Guide
          </Link>
          <Link
            href="/profile"
            onClick={() => setHomeMenu(false)}
            className={cls(
              "outline-none",
              router.pathname === "/profile"
                ? "px-2 py-2 text-[#3b62a5]"
                : "rounded-md px-2 py-2 transition-colors hover:bg-slate-100 hover:text-[#3b62a5] dark:text-gray-400 dark:hover:bg-slate-900"
            )}
          >
            Profile
          </Link>
        </div>
        <div className="py-1">
          <div
            className="cursor-pointer rounded-md px-2 py-2 text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-slate-900"
            onClick={onLogout}
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}
