import { comuHashsInfo } from "@/libs/client/useAtoms";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import React from "react";
import { cls } from "@/libs/client/utils";
import { AnimatePresence, motion, Variants } from "framer-motion";
interface IHashRanking {
  ok: boolean;
  hashRanking: [{ id: number; name: string; posts: [{ id: number }] }];
}

const HashRankingVariants: Variants = {
  start: { translateY: -120 },
  end: {
    translateY: 0,
  },
  exit: {
    translateY: -120,
  },
};

function HashRanking() {
  const { data: ranking } = useSWR<IHashRanking>("/api/ranking");
  const [count, setCount] = useState(0);
  const [isExpand, setIsExpand] = useState(false);
  useEffect(() => {
    if (ranking && ranking.ok && !isExpand) {
      const intervalId = setInterval(() => {
        setCount((prev) => (prev + 1) % ranking.hashRanking.length);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [ranking, isExpand]);
  const setComuHashs = useSetRecoilState(comuHashsInfo);

  return (
    <div className="relative mx-auto mt-2 flex max-w-2xl flex-col items-center overflow-hidden  px-8 py-2 text-gray-400">
      <AnimatePresence mode="wait">
        {ranking?.ok && (
          <>
            <div className="relative w-[90%] rounded-md bg-gray-50 px-2 py-2 dark:bg-[#141c22]">
              <div
                onClick={() => setIsExpand((prev) => !prev)}
                className="absolute right-2 top-2 cursor-pointer"
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
              {isExpand ? (
                <motion.div
                  variants={HashRankingVariants}
                  initial="start"
                  animate="end"
                  exit="exit"
                  className=" space-y-1"
                >
                  {ranking.hashRanking.map((hash, index) => (
                    <Link
                      href={`/community/posts?hashId=${hash.id}`}
                      className="flex w-2/3 items-center space-x-3  text-gray-700 dark:text-gray-400"
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
                  ))}
                </motion.div>
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
                  className="flex w-2/3 items-center"
                  href={`/community/posts?hashId=${ranking?.hashRanking[count]?.id}`}
                >
                  <motion.div
                    key={count}
                    initial={{ rotateX: 90 }}
                    animate={{ rotateX: 0 }}
                    className="space-x-3 text-gray-700 dark:text-gray-400"
                  >
                    <span>{count + 1}.</span>
                    <span
                      className="rounded-md bg-slate-200 px-2 py-1 text-[#3b62a5] dark:bg-slate-900
dark:text-[#5f86c9]"
                    >
                      {ranking?.hashRanking[count]?.name}
                    </span>
                  </motion.div>
                </Link>
              )}
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(HashRanking);
