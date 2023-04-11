import { NextPageContext } from "next";
import { withSsrSession } from "@/libs/server/withSession";
import client from "@/libs/server/client";
import { Post } from "@prisma/client";
import PostInputForm from "@/components/community/post-inputForm";
import usePostInfo from "@/libs/client/usePostInfo";
import useUser from "@/libs/client/useUser";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface EditPropsWithHashTags extends Post {
  hashtag: {
    name: string;
  };
}

interface EditProps {
  ok: boolean;
  post: EditPropsWithHashTags;
  isFav: boolean;
  isMine: boolean;
}

export default function EditPost() {
  const { data } = usePostInfo();
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (data && user && data.post.userId !== user.id) {
      router.back();
    }
  }, [data, user]);

  return (
    data &&
    data.post.userId === user?.id && (
      <PostInputForm
        edit={true}
        imageId={data?.post.image}
        payload={data?.post.payload}
        hashName={data?.post.hashtag.name}
        title={data?.post.title}
        isMine={data?.post.userId === user?.id}
      />
    )
  );
}
