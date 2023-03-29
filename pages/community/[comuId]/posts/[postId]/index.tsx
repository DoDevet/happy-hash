import Layout from "@/components/layout";
import useImage from "@/libs/client/useImage";
import { Post, User } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

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
    query: { postId },
  } = router;
  const { data } = useSWR<PostForm>(`/api/community/posts/${postId}`);

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

        <div className="flex">
          <div className="h-6 w-6 rounded-full bg-slate-400" />
          <span>{data?.post?.user.name}</span>
        </div>
        <span>{data?.post?.payload}</span>
      </Layout>
    </div>
  );
}
