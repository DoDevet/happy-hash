import Layout from "@/components/layout";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { Like, Post, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

interface PostWithHashtag extends Post {
  hashtag: {
    name: string;
  };
  likes: Like[];
  _count: {
    comments: number;
    likes: number;
  };
  user: User;
}

interface PostForm {
  ok: boolean;
  post: PostWithHashtag;
  isFav: boolean;
}

interface ToggleResponse {
  ok: boolean;
}

export default function PostDetail() {
  const router = useRouter();
  const {
    query: { postId },
  } = router;
  const { data, mutate } = useSWR<PostForm>(`/api/community/posts/${postId}`);
  const [toggleFav, { data: toggleResponse, loading, error }] =
    useMutation<ToggleResponse>({
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
              likes: data?.isFav
                ? prev.post._count.likes - 1
                : prev.post._count.likes + 1,
            },
          },
        },
      false
    );
    toggleFav({ postId });
  };

  return (
    <div>
      <Layout
        title={`${data?.post?.title}`}
        hashTitle={data?.post?.hashtag?.name}
        hasTabbar
        hasBackArrow
      >
        {data?.post?.image ? (
          <Image
            alt="postImage"
            src={useImage({ imageId: data?.post?.image })}
            width={1024}
            height={1024}
            className="w-full object-contain"
          />
        ) : (
          <div className="h-96 w-full rounded-md bg-slate-500" />
        )}
        <div className="-mt-2 w-full rounded-md border border-t-0 border-gray-300 pt-2">
          <div className="my-1 mx-2 flex items-center justify-between">
            <div className="flex">
              <div className="h-6 w-6 rounded-full bg-slate-400" />
              <span className="ml-1">{data?.post?.user.name}</span>
            </div>
            <span className="text-xs text-gray-700">
              {data?.post?.createdAt.toString()}
            </span>
          </div>
          <div className="h-[1px] w-full bg-gray-300" />
          <div className="p-2">
            <p>{data?.post?.payload}</p>
            <span className="cursor-pointer text-sm text-sky-500">
              #{data?.post?.hashtag?.name}
            </span>

            <div className="mt-4 flex items-center">
              <button onClick={onClickFavBtn}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={data?.isFav ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={cls("h-6 w-6", data?.isFav ? "text-red-400" : "")}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
              <span className="ml-1">{data?.post?._count?.likes}</span>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
