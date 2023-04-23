import CommentSection from "@/components/community/comments";
import Layout from "@/components/layout";
import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import { prevPostInfo, recyclePostInfo } from "@/libs/client/useAtoms";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import { PostForm } from "@/libs/client/usePostInfo";
import { cls } from "@/libs/client/utils";
import { Comment, Like, Post, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { KeyedMutator } from "swr";

interface PostWithHashtag extends Post {
  hashtag: {
    id: number;
    name: string;
  };
  likes: Like[];
  _count: {
    comments: number;
    likes: number;
  };
  user: User;
}

interface commentsWithUserInfo extends Comment {
  user: {
    avatar: string | null;
    id: number;
    name: string;
  };
}

interface Comments {
  ok: boolean;
  comments: commentsWithUserInfo[];
  totalComments: number;
}

export interface IPostForm {
  ok: boolean;
  post: PostWithHashtag;
  isFav: boolean;
  isMine: boolean;
  comments: Comments;
  error?: string;
}

interface ToggleResponse {
  ok: boolean;
}

interface PostFormProps {
  postInfo: PostForm | undefined;
  isModal?: boolean;
  mutate: KeyedMutator<PostForm>;
}

export default function PostInfo({
  postInfo,
  mutate,
  isModal = false,
}: PostFormProps) {
  const router = useRouter();
  const {
    query: { postId },
  } = router;
  const [toggleFav, { loading: toggleLoading }] = useMutation<ToggleResponse>({
    url: `/api/community/posts/${postId}/fav`,
    method: "POST",
  });
  const setPostInfo = useSetRecoilState(prevPostInfo);
  const getRecyclePostInfo = useRecoilValue(recyclePostInfo);
  const onClickFavBtn = () => {
    if (toggleLoading) return;
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isFav: !prev.isFav,
          post: {
            ...prev.post,
            likesNum: postInfo?.isFav
              ? prev.post.likesNum - 1
              : prev.post.likesNum + 1,

            _count: {
              ...prev.post._count,
              likes: postInfo?.isFav
                ? prev.post._count.likes - 1
                : prev.post._count.likes + 1,
            },
          },
        },
      false
    );
    setPostInfo(postInfo && { ...postInfo, isFav: !postInfo.isFav });
    toggleFav({ postId });
  };

  const imageURL = useImage({
    imageId: postInfo ? postInfo?.post.image : getRecyclePostInfo?.image,
  });
  const avatarURL = useImage({
    imageId: postInfo
      ? postInfo.post.user.avatar
      : getRecyclePostInfo?.user.avatar,
    method: "avatar",
  });
  const createdAtFormat = getDateTimeFormat(
    postInfo ? postInfo.post.createdAt : getRecyclePostInfo?.createdAt,
    "long"
  );
  return (
    <Layout
      isModal={isModal}
      title={`${postInfo ? postInfo?.post.title : getRecyclePostInfo?.title}`}
      hashTitle={
        postInfo ? postInfo.post.hashtag.name : getRecyclePostInfo?.hashtag.name
      }
      hasTabbar
      hasBackArrow
      hasPostMenuBar={!!postInfo?.isMine}
    >
      <div className="mb-22 mx-auto min-h-screen w-full  max-w-3xl dark:bg-[#1e272e] dark:text-gray-300">
        {imageURL ? (
          <Image
            quality={75}
            priority
            alt="postImage"
            src={imageURL}
            width={1024}
            height={600}
            className="h-auto w-full object-contain"
          />
        ) : (
          <div className="h-96 w-full animate-pulse border bg-slate-500" />
        )}
        <div className="-mt-2 w-full border border-t-0 border-gray-300 bg-white pt-2 shadow-sm dark:border-gray-500 dark:bg-[#1e272e]">
          <div className=" flex items-center justify-between border-b p-2 dark:border-gray-500">
            <div className="flex items-center">
              {avatarURL ? (
                <Image
                  alt="avatar"
                  width={256}
                  height={256}
                  src={avatarURL}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-slate-400" />
              )}
              <span className="ml-2">
                {postInfo
                  ? postInfo.post.user.name
                  : getRecyclePostInfo?.user.name}
              </span>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-400">
              {createdAtFormat}
            </span>
          </div>

          <div className="p-2">
            <span className="block whitespace-pre-wrap">
              {postInfo ? postInfo?.post.payload : getRecyclePostInfo?.payload}
            </span>
            <Link
              href={`/community/posts/?hashId=${postInfo?.post.hashtagId}`}
              replace
            >
              <span className="cursor-pointer font-semibold text-[#3b62a5]">
                #
                {postInfo
                  ? postInfo.post.hashtag.name
                  : getRecyclePostInfo?.hashtag.name}
              </span>
            </Link>
            <span className="my-1 block text-xs text-gray-600 dark:text-gray-400">
              {`${postInfo ? postInfo.post.views : getRecyclePostInfo?.views} ${
                postInfo?.post.views !== 1 ? "views" : "view"
              }`}
            </span>
            <div className="mt-4 flex items-center">
              <button onClick={onClickFavBtn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={postInfo?.isFav ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={cls(
                    "h-6 w-6",
                    postInfo?.isFav ? "text-red-400" : ""
                  )}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
              <span className="ml-1">
                {postInfo
                  ? postInfo.post.likesNum
                  : getRecyclePostInfo?.likesNum}
              </span>
            </div>
          </div>
        </div>
        <CommentSection />
      </div>
    </Layout>
  );
}
