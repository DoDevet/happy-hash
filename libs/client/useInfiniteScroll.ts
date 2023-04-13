import { useEffect, useState } from "react";

export function useInfiniteScroll({
  isEnd,
  isLoading,
}: {
  isEnd?: boolean;
  isLoading: boolean;
}) {
  const [page, setPage] = useState(1);
  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage((prev) => prev + 1);
    }
  }
  useEffect(() => {
    if (!isEnd || !isLoading) window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isEnd]);

  return page;
}
