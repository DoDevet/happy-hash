import { homeMenuOpen } from "@/libs/client/useAtoms";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
interface LogoutResponse {
  ok: boolean;
}
export default function HomeMenu() {
  const router = useRouter();
  const setOpen = useSetRecoilState(homeMenuOpen);
  const [logoutMutation, { data: logoutResponse }] =
    useMutation<LogoutResponse>({
      url: "/api/user/logout",
      method: "POST",
    });
  const onLogout = () => {
    setOpen(false);
    logoutMutation({});
    router.replace("/");
  };
  useEffect(() => {
    if (logoutResponse && logoutResponse.ok) {
      router.replace("/login");
    }
  }, [logoutResponse, router]);

  return (
    <div className="absolute z-30 w-full bg-white py-5 shadow-md dark:bg-[#1e272e]">
      <div className="divide-y px-4 font-semibold text-gray-600 dark:divide-gray-500">
        <div className="flex flex-col space-y-3 py-1 outline-none">
          <Link
            href="/"
            className={cls(
              "outline-none",
              router.pathname === "/"
                ? "px-2 py-2 text-[#3b62a5]"
                : "rounded-md px-2 py-2 transition-colors hover:bg-slate-100 hover:text-[#3b62a5] dark:text-gray-400"
            )}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            className={cls(
              "outline-none",
              router.pathname === "/guide"
                ? "px-2 py-2 text-[#3b62a5]"
                : "rounded-md px-2 py-2 transition-colors hover:bg-slate-100 hover:text-[#3b62a5] dark:text-gray-400 dark:hover:bg-slate-900"
            )}
            onClick={() => setOpen(false)}
            href="/guide"
          >
            Q&A
          </Link>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={cls(
              "outline-none",
              router.pathname === "/profile"
                ? "px-2 py-2 text-[#3b62a5]"
                : "rounded-md px-2 py-2 transition-colors hover:text-[#3b62a5] dark:text-gray-400 dark:hover:bg-slate-900"
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
