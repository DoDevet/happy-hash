import { IComuHashsInfo } from "@/libs/client/useAtoms";
import Link from "next/link";
import React from "react";
import { SetterOrUpdater } from "recoil";

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
  setOpen: SetterOrUpdater<boolean>;
  setHashInfo: SetterOrUpdater<{
    hashs: string;
    customName: string;
    id: number;
  }>;
  setComuHashs: SetterOrUpdater<IComuHashsInfo[]>;
}

function TagFeed({
  customName,
  id,
  tags_name,
  hashtags,
  setOpen,
  setHashInfo,
  setComuHashs,
}: TagFeedProps) {
  const onEditTag = () => {
    setOpen(true);
    setHashInfo({
      customName: customName ? customName : "",
      hashs: tags_name,
      id,
    });
  };
  return (
    <div className="relative box-border flex w-full flex-col justify-between overflow-hidden rounded-md bg-[#3b62a5] p-4 font-semibold text-white shadow-xl hover:bg-[#2c5398] hover:transition-colors">
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
              shallow
              className="my-1 rounded-md bg-[#ffaa18] px-2 py-1 text-center shadow-md  hover:scale-105"
              href={{
                pathname: `/community/posts`,
                query: { hashId: hash.id },
              }}
              onClick={() => setComuHashs([{ ...hash }])}
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
        shallow
        onClick={() => setComuHashs(hashtags)}
      >
        <div className="rounded-md bg-gray-100 py-1 text-center text-[#2c5398] shadow-lg hover:scale-105">
          Enter
        </div>
      </Link>
    </div>
  );
}

export default React.memo(TagFeed);
