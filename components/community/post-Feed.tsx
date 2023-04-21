import { cls } from "@/libs/client/utils";
import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import React from "react";

export interface PostFeedProps {
  title: string;
  hashtag: string;
  username: string;
  createdAt: Date;
  likes: number;
  comments: number;
  params?: string;
  isLiked: boolean;
  views: number;
  comuId: string | undefined;
  hashId: string | undefined;
  postId: number;
  [key: string]: any;
}

function PostFeed({
  title,
  hashtag,
  username,
  createdAt,
  likes,
  comments,
  isLiked,
  views,
}: PostFeedProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 dark:bg-[#1e272e] dark:text-gray-200">
      <div>
        <span className="text-darkblue text-base font-semibold">
          #{hashtag}
        </span>
        <span className="ml-2 text-base font-semibold">{title}</span>

        <p className="text-sm text-gray-600 dark:text-gray-300">{username}</p>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {getDateTimeFormat(createdAt)}
          </span>
          <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">{`${views} ${
            views !== 1 ? "views" : "view"
          } `}</span>
        </div>
      </div>
      <div className="flex space-x-2 ">
        <div className="relative flex flex-col items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={cls("h-6 w-6", isLiked ? "text-red-400" : "")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span className="absolute -bottom-3 text-xs">{likes}</span>
        </div>
        <div className="relative flex flex-col items-center justify-center">
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
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
            />
          </svg>
          <span className="absolute -bottom-3 text-xs">{comments}</span>
        </div>
      </div>
    </div>
  );
}
export default React.memo(PostFeed);
