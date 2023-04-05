import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import { commentsMenuOpen } from "@/libs/client/useAtoms";
import useImage from "@/libs/client/useImage";
import Image from "next/image";
import { useRecoilState } from "recoil";
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
  const [commentsMenuOpenInfo, setCommentsMenuOpenInfo] =
    useRecoilState(commentsMenuOpen);

  const onClickEditIcon = (commentsId: number) => {
    if (commentsId === commentsMenuOpenInfo.commentsId) {
      setCommentsMenuOpenInfo({ commentsId: 0, open: false });
    } else setCommentsMenuOpenInfo({ commentsId, open: true });
  };
  return (
    <div className="group flex">
      <div className="flex max-w-[25%] flex-1 items-center border-r px-2">
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

        <span className="ml-2 text-ellipsis text-sm">{username}</span>
      </div>
      <div className="relative flex w-full max-w-xl flex-1 flex-col justify-center break-all py-1 pb-5">
        <span className="px-1 text-sm">{message}</span>
        <span className="absolute bottom-0 left-0 w-full border-t bg-gray-100 px-1 text-xs text-gray-600">
          {createDate}
        </span>
        {isMine && (
          <span className="absolute bottom-0 right-3 text-xs text-gray-600 ">
            <button onClick={() => onClickEditIcon(commentsId)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="inline-flex h-5 w-5 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
            {commentsMenuOpenInfo.commentsId === commentsId &&
              commentsMenuOpenInfo.open && <CommentsMenu />}
          </span>
        )}
      </div>
    </div>
  );
}
