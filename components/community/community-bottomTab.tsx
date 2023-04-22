import { selectFilter } from "@/libs/client/useAtoms";
import { cls } from "@/libs/client/utils";
import { useRecoilState } from "recoil";

export default function CommunityBottomTab() {
  //usePostFeed
  const [select, setSelect] = useRecoilState(selectFilter);
  return (
    <nav className="fixed bottom-0 z-10 w-full bg-white px-2 text-xs text-gray-700 shadow-md dark:bg-[#1e272e] dark:text-gray-200">
      <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center space-x-3">
        <button
          onClick={() => setSelect(false)}
          className={cls(
            "flex-1 border-t-2 py-5 text-center transition-colors ",
            !select
              ? "border-[#3b62a5] dark:border-[#3b62a5]"
              : "dark:border-gray-300"
          )}
        >
          ALL
        </button>
        <button
          onClick={() => setSelect(true)}
          className={cls(
            "transition- flex-1  border-t-2 py-5 text-center  dark:bg-[#1e272e] dark:text-gray-200",
            select
              ? "border-[#3b62a5] dark:border-[#3b62a5]"
              : "dark:border-gray-300"
          )}
        >
          FILTER
        </button>
      </div>
    </nav>
  );
}
