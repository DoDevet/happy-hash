import HomeLayout from "@/components/home/homeLayout";
import TagFeed from "@/components/home/tagFeed";
import { isOpen } from "@/libs/client/useAtoms";
import { shortcutTag } from "@prisma/client";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";

interface HashForm {
  ok: true;
  tags: shortcutTag[];
}

export default function Home() {
  const { data } = useSWR<HashForm>("/api/hashs");
  const setOpen = useSetRecoilState(isOpen);
  return (
    <HomeLayout title={"Home"}>
      <div>
        <h1 className="mb-5 text-3xl font-semibold text-sky-500">#My Hash</h1>
        <div className="grid grid-cols-3 gap-3 overflow-y-auto rounded-md ">
          {data?.tags?.map((tag) => (
            <TagFeed
              key={tag?.id}
              id={tag?.id}
              customName={tag?.customName}
              tags_name={tag?.name}
            />
          ))}
          <div className="flex h-full w-full items-center justify-center">
            <button onClick={() => setOpen((prev) => !prev)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-8 w-8 rounded-full text-gray-500 transition-colors hover:text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
