import usePostInfo from "@/libs/client/usePostInfo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { PostFeedProps } from "./post-Feed";
import PostForm from "./post-form";

export default function PostModalDetail({
  title,
  hashtag,
  username,
  createdAt,
  likes,
  comments,
  isLiked,
  comuId,
  hashId,
  postId,
  views,
  image,
  payload,
  avatarId,
}: PostFeedProps) {
  const router = useRouter();
  const { data, mutate } = usePostInfo();
  useEffect(() => {
    if (data && !data.ok) {
      router.back();
    }
  }, [data]);
  return (
    <div className="no-scroll dark:bg mx-auto flex h-full w-full max-w-3xl overflow-auto rounded-md bg-white dark:bg-[#1e272e] xl:h-[90%]">
      <PostForm
        isModal
        createdAt={createdAt}
        hashTagName={hashtag}
        title={title}
        views={views + 1}
        username={username}
        name={username}
        avatarId={avatarId}
        imageId={image}
        payload={payload}
        mutate={mutate}
        isFav={data?.isFav}
        likes={data?.post._count.likes}
        isMine={data?.isMine}
        hashtagId={data?.post.hashtagId}
      />
    </div>
  );
}
