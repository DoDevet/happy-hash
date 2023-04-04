import { cls } from "@/libs/client/utils";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Input from "../input";
import { useForm } from "react-hook-form";
import useHashTags from "@/libs/client/useHashtags";
import useMutation from "@/libs/client/useMutation";
import Button from "../button";

import { useSWRConfig } from "swr";
import { shortcutTag } from "@prisma/client";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { hashInfo, isOpen } from "@/libs/client/useAtoms";

interface ModalProps {
  open: boolean;
}

interface HashForm {
  hash: string;
  shName: string;
}

interface MutationResponse {
  ok: boolean;
  tag: shortcutTag;
}

interface DeleteResponse {
  ok: boolean;
}

export default function Modal({ open }: ModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setFocus,
    setValue,
  } = useForm<HashForm>();

  const { handleSubmit: handleDeleteSubmit } = useForm();

  const { mutate } = useSWRConfig();

  const [useHashInfo, setHashInfo] = useRecoilState(hashInfo);
  const setOpen = useSetRecoilState(isOpen);
  const EDIT_MODE = useHashInfo.id !== 0 ? true : false;

  const [hashMutation, { data, loading }] = useMutation<MutationResponse>({
    url: "/api/hashs",
    method: EDIT_MODE ? "PATCH" : "POST",
  });
  const [deleteMutation, { data: deleteResponse, loading: DeleteLoading }] =
    useMutation<DeleteResponse>({
      url: "/api/hashs",
      method: "DELETE",
    });
  const onCloseBtn = () => {
    setOpen(false);
    reset({ hash: "", shName: "" });
    setHashInfo({ customName: "", hashs: "", id: 0 });
  };

  useEffect(() => {
    if (errors?.hash) {
      setFocus("hash");
    }
  }, [errors, setFocus]);

  useEffect(() => {
    if (data && data.ok) {
      mutate("/api/hashs");
      onCloseBtn();
    }
  }, [data]);

  useEffect(() => {
    if (deleteResponse && deleteResponse.ok) {
      mutate("/api/hashs");
      onCloseBtn();
    }
  }, [deleteResponse]);

  useEffect(() => {
    if (useHashInfo.customName) {
      setValue("shName", useHashInfo.customName);
    }
    if (useHashInfo.hashs) {
      setValue("hash", useHashInfo.hashs);
    }
  }, [useHashInfo]);

  const onValid = (data: HashForm) => {
    if (loading) return;
    const hashs = useHashTags(data.hash);
    if (hashs.length > 5) {
      setError("hash", { message: "Too many hashtags" });
      return;
    } else {
      EDIT_MODE
        ? hashMutation({ hashs, shName: data.shName, id: useHashInfo.id })
        : hashMutation({ hashs, shName: data.shName });
    }
  };

  const onDeleteValid = () => {
    if (DeleteLoading) return;
    deleteMutation({ id: useHashInfo.id });
  };

  return (
    <div
      className={cls(
        "absolute z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-30",
        open ? "" : "hidden"
      )}
    >
      <div className="relative h-96 w-2/3 max-w-md rounded-md bg-white px-4 py-5 shadow-md">
        <div className="mb-4 flex w-full items-center justify-between">
          <h1 className="text-2xl font-semibold text-sky-500">
            {EDIT_MODE ? "Edit hash" : "Create hash"}
          </h1>
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
            btnText={EDIT_MODE ? "Edit" : "Create"}
            className="absolute bottom-5 right-6 rounded-md bg-sky-500 px-4 py-2 font-semibold text-white shadow-md ring-sky-500 transition-colors hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
          />
        </form>
        {EDIT_MODE ? (
          <form onSubmit={handleDeleteSubmit(onDeleteValid)}>
            <Button
              isLoading={DeleteLoading}
              btnText={"Delete"}
              className="absolute bottom-5 left-6 rounded-md bg-red-400 px-4 py-2 font-semibold text-white shadow-md ring-red-500 transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
            />
          </form>
        ) : null}
      </div>
    </div>
  );
}