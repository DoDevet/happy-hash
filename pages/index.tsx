import Modal from "@/components/home/modal";
import { cls } from "@/libs/client/utils";
import { shortcutTag } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

interface HashForm {
  ok: true;
  tags: shortcutTag[];
}

export default function Home() {
  const [modalBtn, setModalBtn] = useState(false);
  const { data } = useSWR<HashForm>("/api/hashs");

  return (
    <>
      <Modal open={modalBtn} setOpen={setModalBtn} />
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-center text-3xl font-semibold text-sky-500">
          #happy_hash
        </h1>

        <nav className="my-9 flex list-none space-x-5 px-4 font-semibold text-gray-600">
          <li>Home</li>
          <li>Search</li>
          <li>Q&A</li>
          <li>Profile</li>
        </nav>

        <div>
          <h1 className="mb-5 text-3xl font-semibold text-sky-500">#My Hash</h1>
          <div className="grid grid-cols-3 gap-3 rounded-md">
            {data?.tags?.map((tag) => {
              return (
                <Link
                  key={tag?.id}
                  href={{
                    pathname: "/community",
                    query: { hashArr: tag?.name, title: tag?.customName },
                  }}
                >
                  <div className="hover: h-full rounded-md bg-sky-400 px-4 py-4 font-semibold text-white shadow-md hover:bg-sky-700 hover:transition-colors">
                    {tag?.customName ? (
                      <>
                        <span className="block">{tag.customName}</span>
                        <div className="px my-2 space-y-1 text-xs">
                          <span>Hashs : </span>
                          <span className="block">{tag?.name}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>Hashs : </span>
                        <span className="block">{tag?.name}</span>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}

            <button onClick={() => setModalBtn((prev) => !prev)}>
              {/** 누르면 모달창 open, 해쉬 create 양식 */}
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
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
