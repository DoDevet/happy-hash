import usePostInfo from "@/libs/client/usePostInfo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PostForm from "./post-form";

export default function PostModalDetail() {
  const router = useRouter();
  const { data, mutate } = usePostInfo();

  useEffect(() => {
    if (data && !data.ok) {
      router.back();
    }
  }, [data]);

  return (
    <div className="no-scroll dark:bg mx-auto flex h-full w-full max-w-3xl overflow-auto rounded-md bg-white dark:bg-[#1e272e] xl:h-[90%]">
      {data && data?.ok && (
        <PostForm
          isModal
          avatarId={data.post.user.avatar}
          createdAt={data.post.createdAt}
          hashTagName={data.post.hashtag.name}
          hashtagId={data.post.hashtagId}
          imageId={data.post.image}
          isFav={data.isFav}
          isMine={data.isMine}
          likes={data.post._count.likes}
          mutate={mutate}
          name={data.post.user.name}
          payload={data.post.payload}
          title={data.post.title}
          username={data.post.user.name}
          views={data.post.views}
        />
      )}
    </div>
  );
}
