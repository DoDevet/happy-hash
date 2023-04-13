import { useEffect, useState } from "react";

export function useInfiniteScroll({ isEnd }: { isEnd?: boolean }) {
  const [page, setPage] = useState(1);
  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
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
