import { useEffect, useState } from "react";

export function useInfiniteScroll({ isEnd }: { isEnd?: boolean }) {
  const [page, setPage] = useState(1);
  function handleScroll() {
    if (
      document.documentElement.scrollTop + window.innerHeight ===
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
    }
  }
  useEffect(() => {
    if (!isEnd) window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEnd]);

  return page;
}
