import { comuHashsInfo } from "@/libs/client/useAtoms";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import React from "react";
import { cls } from "@/libs/client/utils";
interface IHashRanking {
  ok: boolean;
  hashRanking: [{ id: number; name: string; posts: [{ id: number }] }];
}
function HashRanking() {
  const { data: ranking } = useSWR<IHashRanking>("/api/ranking");
  const [count, setCount] = useState(0);
  const [isExpand, setIsExpand] = useState(false);
  useEffect(() => {
    if (ranking && ranking.ok && !isExpand) {
      const intervalId = setInterval(() => {
        setCount((prev) => (prev + 1) % ranking.hashRanking.length);
      }, 6000);
      return () => clearInterval(intervalId);
    }
  }, [ranking, isExpand]);
  const setComuHashs = useSetRecoilState(comuHashsInfo);

  return (
    <div className="relative mx-auto -mt-4 flex max-w-2xl items-center px-8 text-gray-400">
      {ranking?.ok && (
        <>
          <div className="w-[90%] space-y-1">
            {isExpand ? (
              ranking?.hashRanking?.map((hash, index) => (
                <Link
                  href={`/community/posts?hashId=${hash.id}`}
                  className="flex items-center space-x-3 text-gray-700 dark:text-gray-400"
                  key={index}
                  onClick={() => setComuHashs([{ ...hash }])}
                >
                  <span>{index + 1}.</span>
                  <span
                    className="rounded-md bg-slate-200 px-2 py-1 
text-[#3b62a5] dark:bg-slate-900 dark:text-[#5f86c9]"
                  >
                    {hash.name}
                  </span>
                </Link>
              ))
            ) : (
              <Link
                onClick={() =>
                  setComuHashs([
                    {
                      id: ranking?.hashRanking[count].id!,
                      name: ranking?.hashRanking[count].name!,
                    },
                  ])
                }
                className="flex items-center"
                href={`/community/posts?hashId=${ranking?.hashRanking[count]?.id}`}
              >
                <div className="space-x-3 text-gray-700 dark:text-gray-400">
                  <span>{count + 1}.</span>
                  <span
                    className="rounded-md bg-slate-200 px-2 py-1 text-[#3b62a5] dark:bg-slate-900
dark:text-[#5f86c9]"
                  >
                    {ranking?.hashRanking[count]?.name}
                  </span>
                </div>
              </Link>
            )}
          </div>
          <div
            onClick={() => setIsExpand((prev) => !prev)}
            className="absolute right-9 top-0 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={cls(
                  isExpand
                    ? "M4.5 15.75l7.5-7.5 7.5 7.5"
                    : "M19.5 8.25l-7.5 7.5-7.5-7.5"
                )}
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(HashRanking);
