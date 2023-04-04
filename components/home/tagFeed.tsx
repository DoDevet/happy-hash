import { hashInfo, isOpen } from "@/libs/client/useAtoms";
import Link from "next/link";
import { useSetRecoilState } from "recoil";

interface TagFeedProps {
  id: number;
  tags_name: string;
  customName: string | null | undefined;
}

export default function TagFeed({ customName, id, tags_name }: TagFeedProps) {
  const setOpen = useSetRecoilState(isOpen);
  const setHashInfo = useSetRecoilState(hashInfo);
  const onEditTag = () => {
    setOpen(true);
    setHashInfo({
      customName: customName ? customName : "",
      hashs: tags_name,
      id,
    });
  };

  return (
    <div className="relative  flex h-full flex-col justify-between overflow-hidden rounded-md bg-sky-500 px-4 py-4 font-semibold text-white shadow-xl hover:bg-sky-600 hover:transition-colors">
      <div className="absolute right-3 space-x-1 font-semibold">
        <button onClick={onEditTag}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4 opacity-30 transition-opacity hover:opacity-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </div>

      {customName ? (
        <>
          <span className="block">{customName}</span>
          <div className="my-2 space-y-1 text-xs">
            <span>Hashs : </span>
            <div className="grid gap-2 text-center ">
              {tags_name?.split(",")?.map((hash, index) => (
                <span
                  key={index}
                  className="rounded-md bg-sky-400 py-1 text-center shadow-md hover:scale-105"
                >
                  #{hash}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <span>Hashs : </span>
          <span className="block">
            <div className="grid gap-2 text-center">
              {tags_name?.split(",").map((hash, index) => (
                <span
                  key={index}
                  className="my-2 rounded-md bg-sky-400 py-1 text-center text-xs shadow-md hover:scale-110"
                >
                  #{hash}
                </span>
              ))}
            </div>
          </span>
        </>
      )}
      <Link href={`/community/${id}/posts`}>
        <div className="rounded-md bg-gray-100 py-1 text-center text-sky-400 shadow-lg hover:scale-105">
          Enter
        </div>
      </Link>
    </div>
  );
}
