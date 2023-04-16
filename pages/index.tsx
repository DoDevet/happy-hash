import HomeLayout from "@/components/home/homeLayout";
import TagFeed from "@/components/home/tagFeed";
import { isOpen } from "@/libs/client/useAtoms";
import { shortcutTag } from "@prisma/client";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import useSWR from "swr";

interface shorcutWithHashTag extends shortcutTag {
  hashtags: [
    {
      id: number;
      name: string;
    }
  ];
}

interface HashForm {
  ok: true;
  tags: shorcutWithHashTag[];
}

export default function Home() {
  const { data } = useSWR<HashForm>("/api/hashs", null, {});
  const [open, setOpen] = useRecoilState(isOpen);
  useEffect(() => {
    if (open) {
      window.scrollTo({
        top: 0,
      });
      document.body.style.overflow = "hidden";
    }
    if (open === false) {
      document.body.style.overflow = "unset";
    }
  }, [open]);
  return (
    <HomeLayout title={"Home"}>
      <div className="mx-auto w-full max-w-7xl  items-center justify-center px-4">
        <h1 className="mb-5 font-play text-3xl font-semibold text-[#3b62a5]">
          #My Hash
        </h1>
        <div className="2xl:grid-col grid grid-cols-2 flex-wrap gap-3 overflow-y-auto rounded-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {data?.tags?.map((tag) => (
            <TagFeed
              key={tag?.id}
              id={tag?.id}
              customName={tag?.customName}
              tags_name={tag?.name}
              hashtags={tag.hashtags}
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
