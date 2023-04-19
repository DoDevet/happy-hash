import { prevPostInfo } from "@/libs/client/useAtoms";
import usePostFeed from "@/libs/client/usePostFeed";
import usePostInfo from "@/libs/client/usePostInfo";
import useUser from "@/libs/client/useUser";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import postFeed, { PostFeedProps } from "./post-Feed";
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
  userId,
}: PostFeedProps) {
  const router = useRouter();
  const { user } = useUser();
  const { data, mutate } = usePostInfo();
  const setPostInfo = useSetRecoilState(prevPostInfo);
  const { mutate: postFeedMutate } = usePostFeed({});

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
      setPostInfo({ ...data });
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
        isMine={userId === user?.id}
        hashtagId={data?.post.hashtagId}
      />
    </div>
  );
}
