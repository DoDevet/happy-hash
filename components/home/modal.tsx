import { cls } from "@/libs/client/utils";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Input from "../input";
import { useForm } from "react-hook-form";
import useHashTags from "@/libs/client/useHashtags";
import useMutation from "@/libs/client/useMutation";

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface HashForm {
  hash: string;
}

export default function Modal({ open, setOpen }: ModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setFocus,
  } = useForm<HashForm>();

  const [createHash, { data }] = useMutation({
    url: "/api/hash",
    method: "POST",
  });

  const onCloseBtn = () => {
    setOpen((prev) => !prev);
    reset({});
  };

  useEffect(() => {
    if (errors?.hash) {
      setFocus("hash");
    }
  }, [errors, setFocus]);

  const onValid = (data: HashForm) => {
    const hashs = useHashTags(data.hash);

    if (hashs.length > 5) {
      setError("hash", { message: "Too many hashtags" });
      return;
    } else {
      createHash({ hashs });
    }
  };
  return (
    <div
      className={cls(
        "absolute flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-40 ",
        open ? "" : "hidden"
      )}
    >
      <div className="relative h-96 w-2/3 rounded-md bg-white px-4 py-5 shadow-md">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-2xl font-semibold text-sky-500">Create hash</h1>
          <button onClick={onCloseBtn}>
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onValid)}>
          <Input
            label="Input Hash"
            name="hash"
            placeholder="Hashtags are separated by , (up to 5)"
            type="text"
            errorMessage={errors?.hash?.message}
            register={register("hash", { required: true })}
          />

          <button className="absolute bottom-5 right-6 rounded-md bg-sky-500 px-2 py-2 font-semibold text-white shadow-md transition-colors hover:bg-sky-600">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
