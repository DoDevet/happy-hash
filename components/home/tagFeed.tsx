import { hashInfo, isOpen } from "@/libs/client/useAtoms";
import Link from "next/link";
import { useSetRecoilState } from "recoil";

interface TagFeedProps {
  id: number;
  tags_name: string;
  customName: string | null | undefined;
  hashtags: [
    {
      id: number;
      name: string;
    }
  ];
}

export default function TagFeed({
  customName,
  id,
  tags_name,
  hashtags,
}: TagFeedProps) {
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
    <div className="relative box-border flex w-full flex-col justify-between overflow-hidden rounded-md bg-sky-500 p-4 font-semibold text-white shadow-xl hover:bg-sky-600 hover:transition-colors">
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
        <span className="block">{customName}</span>
      ) : (
        <span className="block">Hashs:</span>
      )}
      <div className="my-2 text-sm">
        {customName && <span className="">Hashs : </span>}
        <div className="flex flex-wrap space-x-1">
          {hashtags?.map((hash, index) => (
            <Link
              key={index}
              className="my-1 rounded-md bg-sky-400 px-2 py-1 text-center shadow-md  hover:scale-105"
              href={{
                pathname: `/community/posts`,
                query: { hashId: hash.id },
              }}
            >
              #{hash.name}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href={{
          pathname: `/community/posts`,
          query: {
            comuId: id,
          },
        }}
      >
        <div className="rounded-md bg-gray-100 py-1 text-center text-sky-400 shadow-lg hover:scale-105">
          Enter
        </div>
      </Link>
    </div>
  );
}
