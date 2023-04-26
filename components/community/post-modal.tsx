import { prevPostInfo, recyclePostInfo } from "@/libs/client/useAtoms";
import usePostFeed from "@/libs/client/usePostFeed";
import usePostInfo from "@/libs/client/usePostInfo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import PostForm from "./post-form";

export default function PostModalDetail() {
  const router = useRouter();
  const {
    query: { postId },
  } = router;
  const { data, mutate } = usePostInfo();
  const { mutate: postFeedMutate } = usePostFeed();
  const setPostInfo = useSetRecoilState(prevPostInfo);

  useEffect(() => {
    if (data && !data.ok) {
      postFeedMutate((prev) => {
        return (
          prev &&
          prev.map((prev) => {
            return {
              ok: true,
              posts: prev.posts.filter((post) => post.id !== +postId!),
            };
          })
        );
      }, false);
      router.back();
    }
    if (data && data.ok) {
      setPostInfo(data);
    }
  }, [data]);
  return (
    <div className="fixed z-50 mx-auto flex h-screen w-full items-center justify-center bg-black bg-opacity-60 ">
      <div className="no-scroll dark:bg mx-auto flex h-full w-full max-w-3xl overflow-auto rounded-md bg-white dark:bg-[#1e272e] xl:h-[90%]">
        <PostForm isModal postInfo={data} mutate={mutate} />
      </div>
    </div>
  );
}
