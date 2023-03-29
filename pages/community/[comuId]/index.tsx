import ComuFeed from "@/components/community/comuFeed";
import FixedButton from "@/components/fixed-btn";
import Layout from "@/components/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import Modal from "react-modal";

interface PostProps {
  ok: boolean;
  posts: [
    {
      hashtag: { name: string };
      id: number;
      title: string;
      createdAt: string;
      user: {
        name: string;
        id: number;
        avatar: string | null;
      };
      _count: {
        comments: number;
        likes: number;
      };
    }
  ];
  error?: string;
  title: { customName?: string | null | undefined; name: string };
}

export default function HashCommunity() {
  const router = useRouter();
  const { comuId, postId } = router.query;
  const { data } = useSWR<PostProps>(`/api/community/posts?comuId=${comuId}`);
  console.log(postId);
  return (
    <Layout
      title={
        data?.title?.customName ? data?.title?.customName : data?.title?.name
      }
      hasTabbar
      hasBackArrow
      bottomTab
    >
      {data?.error ? <span>{data.error.toString()}</span> : ""}
      <ul className="relative flex h-full flex-col divide-y">
        {data?.posts?.map((post) => (
          <Link
            key={post.id}
            href={`/community/${comuId}?postId=${post.id}`}
            as={`/community/${comuId}/posts/${post.id}`}
            scroll={false}
          >
            <ComuFeed
              comments={post?._count?.comments}
              title={post?.title}
              createdAt={post?.createdAt}
              hashtag={post?.hashtag?.name}
              id={post?.id}
              likes={post?._count?.likes}
              username={post?.user?.name}
            />
          </Link>
        ))}
        <FixedButton comuId={+comuId!}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </FixedButton>
      </ul>
    </Layout>
  );
}
