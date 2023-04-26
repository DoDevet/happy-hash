import Layout from "@/components/layout";
import { readdirSync } from "fs";
import { GetStaticPropsContext, NextPage } from "next";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import HomeLayout from "@/components/home/homeLayout";
import remarkImages from "remark-images";
import { useRouter } from "next/router";
const Post: NextPage<{ post: string; data: { title: string } }> = ({
  post,
  data,
}) => {
  const router = useRouter();

  return (
    <HomeLayout title="Guide">
      <div className="relative mx-auto w-full">
        <div className="fixed -mt-5 w-full border-b bg-white py-5 text-center dark:border-gray-600 dark:bg-[#1e272e]">
          <div className="relative top-1 mx-auto flex max-w-3xl items-center justify-center">
            <button onClick={() => router.back()} className="absolute left-4">
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
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <span className="text-center text-lg">{data.title}</span>
          </div>
        </div>
        <div
          className={"container mx-auto max-w-3xl space-y-2 break-words pt-20"}
          dangerouslySetInnerHTML={{ __html: post }}
        />
      </div>
    </HomeLayout>
  );
};

export function getStaticPaths() {
  const files = readdirSync("./posts-guide").map((file) => {
    const [name, extension] = file.split(".");
    return {
      params: { slug: name },
    };
  });

  return {
    paths: files,
    fallback: false,
  };
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const { data, content } = matter.read(`./posts-guide/${ctx.params?.slug}.md`);

  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .use(remarkImages)
    .process(content);

  return {
    props: { post: value, data },
  };
}

export default Post;
