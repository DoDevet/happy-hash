import { postMenuOpen } from "@/libs/client/useAtoms";
import { cls } from "@/libs/client/utils";
import { useRecoilState } from "recoil";
import PostMenu from "./post-menu";

export default function PostMenuLayout() {
  const [postMenu, setPostMenu] = useRecoilState(postMenuOpen);
  return (
    <div className="absolute right-4">
      <button
        onClick={() => setPostMenu((prev) => !prev)}
        className={cls(
          "inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out focus:outline-none",
          postMenu ? "bg-slate-200 dark:bg-slate-800" : ""
        )}
      >
        <svg
          className="h-6 w-6"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            className={cls(postMenu ? "hidden" : "inline-flex")}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          ></path>
          <path
            className={cls(postMenu ? "inline-flex" : "hidden")}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      {postMenu && <PostMenu />}
    </div>
  );
}
