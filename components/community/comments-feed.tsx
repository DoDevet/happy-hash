import getDateTimeFormat from "@/libs/client/getDateTimeFormat";
import useImage from "@/libs/client/useImage";
import Image from "next/image";

interface CommentsProps {
  imageId: string | null;
  username: string;
  message: string;
  createdAt: Date;
}

export default function CommentsFeed({
  imageId,
  username,
  message,
  createdAt,
}: CommentsProps) {
  const imageURL = imageId ? useImage({ imageId, method: "avatar" }) : null;
  const createDate = getDateTimeFormat(createdAt, "short");
  return (
    <div className="flex">
      <div className="flex max-w-[25%] flex-1 items-center  border-r px-2">
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
      </div>
    </div>
  );
}
