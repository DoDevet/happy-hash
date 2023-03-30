import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import getHashTags from "@/libs/client/getHashtags";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import Image from "next/image";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface PostForm {
  title: string;
  payload: string;
  image?: FileList;
}

interface WritePostResponse {
  ok: boolean;
  id: number;
}

export default function WritePost() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PostForm>();

  const {
    query: { comuId },
  } = router;

  const [imageLoading, setImageLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const imageFile = watch("image");

  const [selectedHash, setSelectedHash] = useState("");
  const hashArr = getHashTags({ comuId: +comuId! });

  const [writePost, { data, loading, error }] = useMutation<WritePostResponse>({
    url: "/api/community/posts",
    method: "POST",
  });

  const onClickHash = (hash: string) => {
    setSelectedHash(hash);
  };

  const onClearImagePreview = () => {
    setImagePreview("");
  };
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [imageFile]);

  useEffect(() => {
    if (hashArr) {
      setSelectedHash(hashArr[0]);
    }
  }, [hashArr]);

  useEffect(() => {
    if (data && data.ok) {
      router.back();
    }
  }, [data, router]);

  const onValid = async ({ image, payload, title }: PostForm) => {
    setImageLoading(true);
    const { uploadURL } = await (await fetch(`/api/files`)).json();
    const form = new FormData();
    if (image && image.length > 0) {
      form.append("file", image[0], `${Date.now()}`);
      const {
        result: { id: imageURL },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      writePost({ image: imageURL, payload, title, selectedHash });
      setImageLoading(false);
    }
  };

  return (
    <Layout hasBackArrow hasTabbar title={"Write"}>
      <form className="space-y-5 px-2 pb-10" onSubmit={handleSubmit(onValid)}>
        {imagePreview ? (
          <div className="relative">
            <Image
              src={imagePreview}
              width={30}
              height={30}
              className="w-full object-contain"
              alt="ImageFile"
            />
            <div
              onClick={onClearImagePreview}
              className="absolute top-5 right-5 text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        ) : (
          <>
            <label
              htmlFor="image"
              className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dotted text-gray-600 transition-colors hover:border-sky-400 hover:text-sky-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </label>
            <input
              id="image"
              type={"file"}
              className="hidden"
              {...register("image")}
            />
          </>
        )}

        <Input
          register={register("title", {
            required: { value: true, message: "Title must not be empty" },
            maxLength: {
              value: 30,
              message: "Too long. Must be less than or equal to 30 chars",
            },
          })}
          errorMessage={errors?.title?.message}
          label="Title"
          placeholder="Input Title"
          type="text"
          name="title"
        />
        <div>
          <Input
            label="Payload"
            name="payload"
            type="textArea"
            register={register("payload", {
              required: {
                value: true,
                message: "Payload must not be empty",
              },
            })}
            id="payload"
            placeholder="Write...."
            errorMessage={errors?.payload?.message}
          />
        </div>
        <div>
          <p className="ml-1 mb-4 text-xl font-semibold">Select Hashtag</p>
          <div className="grid grid-cols-5 place-items-center">
            {hashArr?.map((hash, index) => (
              <div
                key={index}
                className={cls(
                  "w-fit cursor-pointer rounded-full px-2 py-1 shadow-md transition-colors hover:bg-sky-500 hover:text-white",
                  selectedHash === hash
                    ? "bg-sky-500 text-white"
                    : "bg-slate-300 text-gray-100"
                )}
                onClick={() => onClickHash(hash)}
              >
                <span>#{hash}</span>
              </div>
            ))}
          </div>
        </div>
        <Button
          btnText="Write Post"
          isLoading={loading || imageLoading}
          className="w-full rounded-md bg-sky-500 py-3 text-white shadow-md outline-none transition-colors hover:bg-sky-600"
        />
      </form>
    </Layout>
  );
}
