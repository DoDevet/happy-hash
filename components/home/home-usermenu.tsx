import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { motion } from "framer-motion";
interface LogoutResponse {
  ok: boolean;
}
export default function UserMenu() {
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
  }, [logoutResponse]);

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute right-5 top-8 z-30 mt-2 w-28 rounded-md border border-t-0 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-[#1e272e]"
      >
        <div className="divide-y px-2 font-semibold text-gray-600 dark:divide-gray-500">
          <div className="flex flex-col space-y-3 py-1 outline-none">
            <Link
              href={`/profile`}
              className={cls(
                "rounded-md px-2 py-2 text-base outline-none transition-colors hover:bg-slate-100 hover:text-[#3b62a5] dark:text-gray-400 dark:hover:bg-slate-900"
              )}
            >
              Profile
            </Link>
          </div>
          <div className="py-1">
            <div
              onClick={onLogout}
              className="cursor-pointer rounded-md px-2 py-2 text-base text-red-400 transition-colors hover:bg-red-100 dark:hover:bg-slate-900 "
            >
              Logout
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
