import usePostInfo from "@/libs/client/usePostInfo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PostForm from "./post-form";
interface PostFeedProps {
  comments: number | undefined;
  title: string | undefined;
  createdAt: Date | undefined;
  hashtag: string | undefined;
  hashId: string | undefined;
  postId: number | undefined;
  comuId: string | undefined;
  likes: number | undefined;
  username: string | undefined;
  isLiked: boolean | undefined;
  views: number | undefined;
  avatarId: string | undefined | null;
}

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
        isFav={isLiked}
        likes={likes}
        mutate={mutate}
        title={title}
        views={views}
        username={username}
        name={username}
        avatarId={avatarId}
        hashtagId={data?.post.hashtagId}
        imageId={data?.post.image}
        isMine={data?.isMine}
        payload={data?.post.payload}
      />
    </div>
  );
}
