import ComuFeed from "@/components/community/ComuFeed";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";

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
      };
    }
  ];
}

export default function HashCommunity() {
  const router = useRouter();
  const { hashArr, title: reqTitle } = router.query;
  const baseUrl = "/api/community";
  const config = {
    hashArr: hashArr ? hashArr.toString() : "",
  };
  const params = new URLSearchParams(config).toString();

  const { data } = useSWR<PostProps>(`${baseUrl}?${params}`);
  const title = reqTitle ? reqTitle : hashArr?.toString();

  return (
    <Layout title={title} hasTabbar hasBackArrow>
      <div className="flex flex-col divide-y">
        {data?.posts?.map((post) => (
          <ComuFeed
            comments={post._count.comments}
            title={post.title}
            createdAt={post.createdAt}
            hashtag={post.hashtag.name}
            id={post.id}
            likes={0}
            username={post.user.name}
            key={post.id}
          />
        ))}
      </div>
    </Layout>
  );
}
