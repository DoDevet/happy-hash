import Head from "next/head";
import { useRouter } from "next/router";

interface LayoutProps {
  hasTabbar?: boolean;
  title?: string | string[] | undefined | null;
  hasBackArrow?: boolean;
  [key: string]: any;
}

export default function Layout({
  title,
  hasTabbar,
  children,
  hasBackArrow,
}: LayoutProps) {
  const router = useRouter();
  const onClickBackArrow = () => {
    router.back();
  };
  return (
    <div className="mx-auto w-full max-w-xl">
      {hasTabbar ? (
        <div className="relative flex w-full items-center justify-center border-b py-5 text-lg font-semibold">
          {hasBackArrow ? (
            <button className="absolute left-4" onClick={onClickBackArrow}>
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
          ) : null}
          <h1 className="">{title}</h1>
        </div>
      ) : null}

      {children}
    </div>
  );
}
