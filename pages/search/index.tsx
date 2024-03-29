import HomeLayout from "@/components/home/homeLayout";
import { comuHashsInfo } from "@/libs/client/useAtoms";
import { hashtag, Post } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";

interface PostExtendInfo extends Post {
  _count: {
    comments: boolean;
    likes: boolean;
  };
  hashtag: {
    name: string;
    id: number;
  };
  user: {
    name: string;
  };
  likes: {
    length: number;
  };
}
interface HashtagExtendInfo extends hashtag {
  _count: {
    posts: number;
    shortcutTag: number;
  };
}
interface ISearchPage {
  hashs: HashtagExtendInfo[];
  posts: PostExtendInfo[];
}

export default function SearchPage() {
  const router = useRouter();
  const {
    query: { params },
  } = router;
  const { data } = useSWR<ISearchPage>(`/api/search?params=${params}`);
  const setComuHashs = useSetRecoilState(comuHashsInfo);

  return (
    <HomeLayout title="Search">
      {/** PostDetail */}
      {data && params && (
        <>
          <div className="mx-auto w-full max-w-4xl">
            <p className="mb-10 px-2 text-2xl font-bold">
              Search By <span className="text-darkblue">"{params}"</span>
            </p>
            <div className="mx-auto mb-6 w-full max-w-3xl">
              <p className="mb-2 px-2 text-2xl font-bold">hashs :</p>
              <div className="grid w-fit gap-3 px-4 ">
                {data?.hashs?.map((hash) => (
                  <Link
                    key={hash.id}
                    onClick={() => setComuHashs([{ ...hash }])}
                    href={`/community/posts?hashId=${hash?.id}`}
                  >
                    <div
                      key={hash?.id}
                      className="rounded-md bg-[#3b62a5] px-5 py-2 text-gray-200 shadow-md transition-colors hover:bg-[#2c5398]"
                    >
                      <p className="text-xl font-bold ">#{hash?.name}</p>
                      <span className="text-[#ffaa18]">
                        {hash?._count?.posts}
                        {hash?._count?.posts === 1 ? " Post" : " Posts"}
                      </span>
                      <p className="text-[#ffaa18]">
                        {hash?._count?.shortcutTag}
                        {hash?._count?.posts === 1 ? " Follower" : " Followers"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-3xl">
            <p className="mb-2 px-2 text-2xl font-bold">Posts :</p>
            <div className="flex flex-col items-center space-y-2 divide-y dark:divide-gray-500">
              {data?.posts?.map((post) => (
                <div className="w-full max-w-3xl px-4" key={post?.id}>
                  <Link
                    href={`/community/posts/${post.id}?hashId=${post.hashtag.id}`}
                    onClick={() => setComuHashs([{ ...post.hashtag }])}
                  >
                    <div className="flex items-center">
                      <span className="text-darkblue mr-2 text-sm font-semibold">{`#${post.hashtag.name}`}</span>
                      <span className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-300">{`${post.title}`}</span>
                    </div>
                    <p className="truncate text-gray-500 dark:text-gray-400">
                      {post.payload}
                    </p>
                    <div className="flex items-center space-x-5 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>{post._count.likes}</span>
                        {post.likes.length !== 0 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            fill="currentColor"
                            className="h-4 w-4 text-red-400"
                          >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{post._count.comments}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{post.views}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </HomeLayout>
  );
}
