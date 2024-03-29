import PostInfo from "@/components/community/post-form";
import { IPostForm } from "@/components/community/post-form";
import client from "@/libs/server/client";
import { withSsrSession } from "@/libs/server/withSession";
import { NextPageContext } from "next";
import { useEffect } from "react";
import { SWRConfig } from "swr";

function PostDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <PostInfo />;
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
    if (!post) {
      return {
        props: { ok: false, error: "No post found" },
      };
    }

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
