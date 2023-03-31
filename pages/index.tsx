import Modal from "@/components/home/modal";
import TagFeed from "@/components/home/tagFeed";
import { shortcutTag } from "@prisma/client";
import Head from "next/head";
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
    <div>
      <Head>
        <title>Home | #happy_hash</title>
      </Head>
      <Modal open={modalBtn} setOpen={setModalBtn} />
      <div className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-center text-3xl font-semibold text-sky-500">
          #happy_hash
        </h1>

        <nav className="my-9 flex list-none space-x-5 px-4 font-semibold text-gray-600">
          <li className="text-sky-500">Home</li>
          <li>Search</li>
          <li>Q&A</li>
          <li>
            <Link href="profile" as="/34">
              Profile
            </Link>
          </li>
        </nav>

        <div>
          <h1 className="mb-5 text-3xl font-semibold text-sky-500">#My Hash</h1>
          <div className="grid grid-cols-3 gap-3 rounded-md">
            {data?.tags?.map((tag) => (
              <TagFeed
                key={tag?.id}
                id={tag?.id}
                customName={tag?.customName}
                tags_name={tag?.name}
              />
            ))}
            <div className="flex h-full w-full items-center justify-center">
              <button onClick={() => setModalBtn((prev) => !prev)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-8 w-8 rounded-full text-gray-500 transition-colors hover:text-gray-700"
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
      </div>
    </div>
  );
}
