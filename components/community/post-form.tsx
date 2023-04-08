import CommentSection from "@/components/community/comments";
import Layout from "@/components/layout";
import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { Like, Post, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
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

export interface IPostForm {
  ok: boolean;
  post: PostWithHashtag;
  isFav: boolean;
  isMine: boolean;
  error?: string;
}

interface ToggleResponse {
  ok: boolean;
}

interface PostFormProps {
  imageId: string | null | undefined;
  avatarId: string | null | undefined;
  title: string | null | undefined;
  name: string | null | undefined;
  isMine: boolean | null | undefined;
  username: string | null | undefined;
  createdAt: Date | null | undefined;
  payload: string | null | undefined;
  hashtagId: number | null | undefined;
  hashTagName: string | null | undefined;
  views: number | null | undefined;
  isFav: boolean | null | undefined;
  likes: number | null | undefined;
  mutate: KeyedMutator<IPostForm>;
  isModal?: boolean;
}

export default function PostForm({
  imageId,
  isMine,
  title,
  name,
  avatarId,
  username,
  createdAt,
  payload,
  hashtagId,
  hashTagName,
  views,
  isFav,
  likes,
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
  const onClickFavBtn = () => {
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isFav: !prev.isFav,
          post: {
            ...prev.post,
            _count: {
              ...prev.post._count,
              likes: isFav
                ? prev.post._count.likes - 1
                : prev.post._count.likes + 1,
            },
          },
        },
      false
    );
    if (!toggleLoading) {
      toggleFav({ postId });
    }
  };
  const imageURL = useImage({ imageId });
  const avatarURL = useImage({ imageId: avatarId, method: "avatar" });
  const createdAtFormat = getDateTimeFormat(createdAt, "long");
  return (
    <div className="w-full dark:bg-[#1e272e]">
      <Layout
        isModal={isModal}
        title={`${title}`}
        hashTitle={name}
        hasTabbar
        hasBackArrow
        hasPostMenuBar={!!isMine}
      >
        <div className="mb-22 mx-auto min-h-screen w-full  max-w-3xl dark:bg-[#1e272e] dark:text-gray-300">
          {imageURL ? (
            <Image
              alt="postImage"
              src={imageURL}
              width={1024}
              height={600}
              className="h-auto w-full object-contain"
            />
          ) : (
            <div className="h-96 w-full border bg-slate-500" />
          )}
          <div className="-mt-2 w-full border border-t-0 border-gray-300 bg-white pt-2 shadow-sm dark:border-gray-500 dark:bg-[#1e272e]">
            <div className=" flex items-center justify-between border-b p-2">
              <div className="flex items-center">
                <Image
                  alt="avatar"
                  width={256}
                  height={256}
                  src={avatarURL}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="ml-2">{username}</span>
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-500">
                {createdAtFormat}
              </span>
            </div>

            <div className="p-2">
              <span className="block whitespace-pre-wrap">{payload}</span>
              <Link href={`/community/posts/?hashId=${hashtagId}`}>
                <span className="cursor-pointer font-semibold text-[#3b62a5]">
                  #{hashTagName}
                </span>
              </Link>
              <span className="my-1 block text-xs text-gray-600 dark:text-gray-400">
                {`${views} ${views !== 1 ? "views" : "view"}`}
              </span>
              <div className="mt-4 flex items-center">
                <button onClick={onClickFavBtn}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFav ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className={cls("h-6 w-6", isFav ? "text-red-400" : "")}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </button>
                <span className="ml-1">{likes}</span>
              </div>
            </div>
          </div>
          <CommentSection />
        </div>
      </Layout>
    </div>
  );
}
