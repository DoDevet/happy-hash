import Modal from "@/components/home/modal";
import { cls } from "@/libs/client/utils";
import { useState } from "react";

export default function Home() {
  const [modalBtn, setModalBtn] = useState(false);

  return (
    <>
      <Modal open={modalBtn} setOpen={setModalBtn} />
      <div className="px-4">
        <h1 className="text-center text-2xl font-semibold text-sky-500">
          #happy_hash
        </h1>

        <div className="my-9 flex space-x-5 px-4 font-semibold text-gray-600">
          <div>Home</div>
          <div>Search</div>
          <div>Q&A</div>
        </div>

        <div>
          <h1 className="mb-5 text-3xl font-semibold text-sky-500">#My Hash</h1>
          <div className="grid grid-cols-5 items-center gap-3">
            <span className="rounded-md bg-gray-100 py-4 text-center">
              #게임
            </span>
            <span className="rounded-md bg-gray-100 py-4 text-center">
              #게임
            </span>
            <button onClick={() => setModalBtn((prev) => !prev)}>
              {/** 누르면 모달창 open, 해쉬 create 양식 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
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
