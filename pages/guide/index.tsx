import HomeLayout from "@/components/home/homeLayout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import Link from "next/link";

interface IBlogPosts {
  title: string;
  date: string;
  slug: string;
}

export default function GuideFeed({ posts }: { posts: IBlogPosts[] }) {
  return (
    <HomeLayout title="Guide">
      <div className="mx-auto w-full max-w-3xl">
        {/** Container */}
        <div className="mx-3 my-3">
          <div className="space-y-6">
            {posts.map((post, index) => (
              <Link key={index} className="block" href={`/guide/${post.slug}`}>
                <div className="rounded-md bg-slate-200 px-4 py-4 dark:bg-slate-900">
                  <span className="ed-md bg-sl text-lg text-[#3b62a5] dark:text-[#5f86c9]">
                    {post.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts-guide").map((file) => {
    const content = readFileSync(`./posts-guide/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });

  return {
    props: {
      posts: blogPosts,
    },
  };
}
