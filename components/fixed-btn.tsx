import Link from "next/link";
import { useRouter } from "next/router";

interface BtnProps {
  comuId: number;
  [key: string]: any;
}

export default function FixedButton({ children }: BtnProps) {
  const router = useRouter();
  const {
    query: { comuId, hashId },
  } = router;
  return (
    <Link
      href={`/community/posts/write?${
        comuId ? `comuId=${comuId}` : `hashId=${hashId}`
      }`}
      className="bg-darkblue bg-darkerblue  fixed bottom-24 right-[10%] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full text-white transition-colors  xl:right-[30%]"
    >
      {children}
    </Link>
  );
}
