import PostForm, { IPostForm } from "@/components/community/post-form";
import usePostInfo from "@/libs/client/usePostInfo";
import client from "@/libs/server/client";
import { withSsrSession } from "@/libs/server/withSession";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SWRConfig } from "swr";

function PostDetail() {
  const router = useRouter();
  const { data, mutate } = usePostInfo();

  useEffect(() => {
    if (data && !data.ok) {
      router.back();
    }
  }, [data]);

  return (
    <PostForm
      avatarId={data?.post.user.avatar}
      createdAt={data?.post.createdAt}
      hashTagName={data?.post.hashtag.name}
      hashtagId={data?.post.hashtagId}
      imageId={data?.post.image}
      isFav={data?.isFav}
      isMine={data?.isMine}
      likes={data?.post._count.likes}
      mutate={mutate}
      name={data?.post.user.name}
      payload={data?.post.payload}
      title={data?.post.title}
      username={data?.post.user.name}
      views={data?.post.views}
    />
  );
}

export default function Page({ post, ok, error, isMine, isFav }: IPostForm) {
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/community/posts/${post?.id}`]: {
            ok,
            post,
            error,
            isMine,
            isFav,
          },
        },
      }}
    >
      <PostDetail />
    </SWRConfig>
  );
}

export const getServerSideProps = withSsrSession(
  async (ctx: NextPageContext) => {
    const user = ctx?.req?.session?.user;
    const post = await client.post.findUnique({
      where: {
        id: +ctx.query.postId!,
      },
      include: {
        hashtag: {
          select: {
            name: true,
            id: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        likes: true,
        user: true,
      },
    });
    const isFav = Boolean(
      await client.like.findFirst({
        where: {
          user: {
            id: +user?.id!,
          },
          postId: +ctx.query.postId!,
        },
      })
    );
    if (!post) {
      return {
        props: { ok: false, error: "No post found" },
      };
    }

    return {
      props: {
        ok: true,
        post: JSON.parse(JSON.stringify(post)),
        isMine: user?.id === post.userId,
        isFav,
      },
    };
  }
);
