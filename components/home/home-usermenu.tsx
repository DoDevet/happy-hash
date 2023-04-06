import { userMenuOpen } from "@/libs/client/useAtoms";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
interface LogoutResponse {
  ok: boolean;
}
export default function UserMenu() {
  const router = useRouter();
  const setHomeUserMenu = useSetRecoilState(userMenuOpen);
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
      router.replace("/");
      setHomeUserMenu((prev) => !prev);
    }
  }, [logoutResponse]);

  return (
    <div className="absolute right-5 top-8 z-30 mt-2 w-28 rounded-md border border-t-0 bg-white py-1 shadow-lg">
      <div className="divide-y px-2 font-semibold text-gray-600">
        <div className="flex flex-col space-y-3 py-1 outline-none">
          <Link
            href={`/profile`}
            className={cls(
              "rounded-md px-2 py-2 text-base outline-none transition-colors hover:bg-slate-100 hover:text-sky-500"
            )}
            onClick={() => setHomeUserMenu((prev) => !prev)}
          >
            Profile
          </Link>
        </div>
        <div className="py-1">
          <div
            onClick={onLogout}
            className="cursor-pointer rounded-md px-2 py-2 text-base text-red-400 transition-colors hover:bg-red-100"
          >
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}
