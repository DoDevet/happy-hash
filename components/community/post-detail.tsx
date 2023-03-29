import useImage from "@/libs/client/useImage";
import { Post, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import Layout from "../layout";

interface PostWithHashtag extends Post {
  hashtag: {
    name: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
  user: User;
}

interface PostForm {
  ok: boolean;
  post: PostWithHashtag;
}

export default function PostDetail() {
  const router = useRouter();
  const {
    query: { postId, comuId },
  } = router;
  const { data } = useSWR<PostForm>(`/api/community/posts/${postId}`);

  return (
    <div className="no-scroll min-w-[300px] max-w-xl overflow-y-auto scroll-smooth rounded-md bg-white">
      <div className="relative flex w-full items-center justify-center py-4">
        <span className="text-xl font-bold">{data?.post?.title}</span>
        <Link
          className="absolute right-4 cursor-pointer text-xl"
          href={`/community/${comuId}/posts`}
          scroll={false}
        >
          <span>X</span>
        </Link>
      </div>
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
      <div className="px-2 py-2">
        <div className="flex">
          <div className="h-6 w-6 rounded-full bg-slate-400" />
          <span>{data?.post?.user.name}</span>
        </div>
        <span>{data?.post?.payload}</span>
      </div>
    </div>
  );
}
