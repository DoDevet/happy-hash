import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import { commentsEditSelector, commentsSelector } from "@/libs/client/useAtoms";
import useImage from "@/libs/client/useImage";
import { cls } from "@/libs/client/utils";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import EditComments from "./comments-editForm";
import CommentsMenu from "./comments-menu";

interface CommentsProps {
  commentsId: number;
  imageId: string | null;
  username: string;
  message: string;
  createdAt: Date;
  isMine: boolean;
}

export default function CommentsFeed({
  commentsId,
  imageId,
  username,
  message,
  createdAt,
  isMine,
}: CommentsProps) {
  const imageURL = imageId ? useImage({ imageId, method: "avatar" }) : null;
  const createDate = getDateTimeFormat(createdAt, "short");
  const [commentsInfo, setCommentsInfo] = useRecoilState(commentsSelector);
  const editor = useRecoilValue(commentsEditSelector);
  const onClickEditIcon = (commentsId: number, message: string) => {
    setCommentsInfo((prev) => ({
      menuOpen: !prev.menuOpen,
      commentsId: prev.menuOpen ? 0 : commentsId,
      message: prev.menuOpen ? "" : message,
      editModalOpen: false,
    }));
  };

  const COMMENT_MENU =
    commentsInfo.commentsId === commentsId && commentsInfo.menuOpen;
  const EDIT = commentsInfo.commentsId === commentsId && editor.editModalOpen;
  return (
    <div className="group flex  dark:divide-gray-500 dark:border-gray-500 ">
      <div className="flex w-full max-w-[21%] items-center border-r px-2 dark:border-gray-500">
        {imageURL ? (
          <Image
            alt="Avatar"
            width={500}
            height={500}
            className="h-7 w-7 rounded-full object-cover"
            src={imageURL}
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-slate-400" />
        )}
        <span className="ml-2 truncate text-ellipsis text-sm">{username}</span>
      </div>
      <div className="relative flex w-full max-w-3xl flex-col justify-center break-all py-1 pb-5">
        {EDIT ? (
          <EditComments />
        ) : (
          <>
            <span className="px-1 text-sm">{message}</span>
            <span className="absolute bottom-0 left-0 w-full border-t bg-gray-100 px-1 text-xs text-gray-600 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300">
              {createDate}
            </span>
          </>
        )}
        {isMine && (
          <span
            className={cls(
              "absolute bottom-0 right-3 text-xs text-gray-600",
              EDIT ? "hidden" : ""
            )}
          >
            <button onClick={() => onClickEditIcon(commentsId, message)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={cls(
                  "inline-flex h-6 w-6 rounded-md text-gray-400 transition-colors hover:text-gray-700 focus:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400",
                  COMMENT_MENU
                    ? "bg-slate-300 text-gray-700 shadow-md dark:border-gray-500 dark:bg-slate-800"
                    : ""
                )}
              >
                <path
                  className={cls(COMMENT_MENU ? "hidden" : "inline-block")}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />

                <path
                  className={cls(
                    "transition-colors",
                    COMMENT_MENU ? "inline-block" : "hidden"
                  )}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {COMMENT_MENU && <CommentsMenu />}
          </span>
        )}
      </div>
    </div>
  );
}
