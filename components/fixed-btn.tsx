import Link from "next/link";

interface BtnProps {
  comuId: number;
  [key: string]: any;
}

export default function FixedButton({ comuId, children }: BtnProps) {
  return (
    <Link
      href={`/community/${comuId}/write`}
      className="fixed bottom-24 right-[10%] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-sky-500 text-white transition-colors hover:bg-sky-600 xl:right-[30%]"
    >
      {children}
    </Link>
  );
}
