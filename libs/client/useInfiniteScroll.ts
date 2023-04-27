import { useEffect, useState } from "react";
import { PostProps } from "./usePostFeed";

export function useInfiniteScroll({
  isEnd,
  isLoading,
  setSize,
}: {
  isEnd?: boolean;
  isLoading: boolean;
  setSize: (
    size: number | ((_size: number) => number)
  ) => Promise<PostProps[] | undefined>;
}) {
  const handleScroll = () => {
    if (
      !isLoading &&
      !isEnd &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
    ) {
      setSize((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (!isEnd && !isLoading) window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEnd, isLoading]);
}
