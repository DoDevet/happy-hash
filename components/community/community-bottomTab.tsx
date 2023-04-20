import { selectFilter } from "@/libs/client/useAtoms";
import { cls } from "@/libs/client/utils";
import { useRecoilState } from "recoil";

export default function CommunityBottomTab() {
  //usePostFeed
  const [select, setSelect] = useRecoilState(selectFilter);
  return (
    <nav className="fixed bottom-0 z-10 w-full bg-white px-2 py-1 pb-8 text-xs text-gray-700 shadow-md dark:bg-[#1e272e] dark:text-gray-200">
      <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center space-x-3">
        <button
          onClick={() => setSelect(false)}
          className={cls(
            "flex-1 border-t-2  pt-3 text-center ",
            !select ? "border-[#3b62a5]" : ""
          )}
        >
          ALL
        </button>
        <button
          onClick={() => setSelect(true)}
          className={cls(
            "flex-1 border-t-2  pt-3 text-center dark:bg-[#1e272e] dark:text-gray-200",
            select ? "border-[#3b62a5]" : ""
          )}
        >
          FILTER
        </button>
      </div>
    </nav>
  );
}
