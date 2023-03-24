import { cls } from "@/libs/client/utils";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Input from "../input";
import { useForm } from "react-hook-form";
import useHashTags from "@/libs/client/useHashtags";
import useMutation from "@/libs/client/useMutation";
import Button from "../button";

import useSWR, { useSWRConfig } from "swr";
import { shortcutTag } from "@prisma/client";

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface HashForm {
  hash: string;
  shName: string;
}

interface MutationResponse {
  ok: boolean;
  tag: shortcutTag;
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

  const [createHash, { data, loading }] = useMutation<MutationResponse>({
    url: "/api/hashs",
    method: "POST",
  });

  const { mutate } = useSWRConfig();

  const onCloseBtn = () => {
    reset({ hash: "", shName: "" });
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (errors?.hash) {
      setFocus("hash");
    }
  }, [errors, setFocus]);

  useEffect(() => {
    if (data && data.ok) {
      mutate("/api/hashs", (prev: any) => {
        prev && {
          ...prev,
          tags: {
            ...prev.tags.push(data.tag),
          },
        };
      });
      onCloseBtn();
    }
  }, [data]);

  const onValid = (data: HashForm) => {
    const hashs = useHashTags(data.hash);

    if (hashs.length > 5) {
      setError("hash", { message: "Too many hashtags" });
      return;
    } else {
      createHash({ hashs, shName: data.shName });
    }
  };
  return (
    <>
      <div
        className={cls(
          "absolute flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-40 ",
          open ? "" : "hidden"
        )}
      >
        <div className="relative h-96 w-2/3 max-w-md rounded-md bg-white px-4 py-5 shadow-md">
          <div className="mb-4 flex w-full items-center justify-between">
            <h1 className="text-2xl font-semibold text-sky-500">Create hash</h1>
            <button onClick={onCloseBtn}>
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onValid)} className="space-y-3">
            <Input
              label="Input Hash"
              name="hash"
              placeholder="Hashtags are separated by , (up to 5)"
              type="text"
              errorMessage={errors?.hash?.message}
              register={register("hash", { required: true })}
            />
            <Input
              label="Input Shortcut name (optional)"
              name="Shortcut"
              placeholder="Shortcut name (optional)"
              type="text"
              register={register("shName", { required: false })}
            />
            <Button
              isLoading={loading}
              btnText="Save"
              className="absolute bottom-5 right-6 rounded-md bg-sky-500 px-2 py-2 font-semibold text-white shadow-md transition-colors hover:bg-sky-600"
            />
          </form>
        </div>
      </div>
    </>
  );
}
