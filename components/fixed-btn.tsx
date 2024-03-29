import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
interface BtnProps {
  [key: string]: any;
  comuId?: string;
  hashId?: string;
}

function FixedButton({ children }: BtnProps) {
  const router = useRouter();
  return (
    <Link
      href={{ pathname: router.pathname + "/write", query: router.query }}
      className="bg-darkblue bg-darkerblue fixed bottom-24 right-[10%] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none text-white shadow-md transition-colors  xl:right-[30%]"
    >
      {children}
    </Link>
  );
}

export default FixedButton;
