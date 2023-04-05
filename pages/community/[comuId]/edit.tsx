import Input from "@/components/input";
import Layout from "@/components/layout";
import usePostInfo from "@/libs/client/usePostInfo";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import getHashTags from "@/libs/client/getHashtags";
import Button from "@/components/button";
import { cls } from "@/libs/client/utils";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import { NextPageContext } from "next";
import { withSsrSession } from "@/libs/server/withSession";
import client from "@/libs/server/client";
import { Post } from "@prisma/client";

interface PostForm {
  title: string;
  payload: string;
  image?: FileList | null;
  error?: string;
}

interface EditPropsWithHashTags extends Post {
  hashtag: {
    name: string;
  };
}

interface EditProps {
  ok: boolean;
  post: EditPropsWithHashTags;
  isFav: boolean;
  isMine: boolean;
}

interface EditResponseData {
  ok: boolean;
}

export default function EditPost({ isMine, post }: EditProps) {
  const router = useRouter();
  const {
    query: { comuId, postId },
  } = router;
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<PostForm>();

  const hashArr = getHashTags({ comuId: +comuId! });

  const [imagePreview, setImagePreview] = useState("");
  const [selectedHash, setSelectedHash] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const image = watch("image");

  const [editPost, { data: editResponse, loading }] =
    useMutation<EditResponseData>({
      url: `/api/community/posts?${postId}`,
      method: "PATCH",
    });

  const onValid = async ({ title, payload, image }: PostForm) => {
    if (loading) return;
    if (!imagePreview) {
      setError("image", { message: "Image Required" });
      return;
    }
    if (!image || image?.length === 0) {
      editPost({ title, payload, selectedHash, postId });
    } else {
      setImageLoading(true);
      const { uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      form.append("file", image[0], `${postId}-${Date.now()}`);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      editPost({ title, payload, selectedHash, imageURL: id, postId });
      setImageLoading(false);
    }
  };
  useEffect(() => {
    if (!isMine || !post) {
      router.back();
    }
  }, [isMine, post]);
  useEffect(() => {
    if (post && post.title) {
      setValue("title", post.title);
    }
    if (post && post?.payload) {
      setValue("payload", post.payload);
    }
    if (post && post?.image) {
      setImagePreview(useImage({ imageId: post.image }));
    }
  }, [post]);
  useEffect(() => {
    if (hashArr) {
      setSelectedHash(
        hashArr[hashArr.findIndex((hash) => hash === post?.hashtag?.name)]
      );
    }
  }, [hashArr, post]);
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file as any));
    }
  }, [image]);
  useEffect(() => {
    if (editResponse && editResponse.ok) {
      router.replace(`/community/${comuId}/posts/${postId}`);
    }
  }, [editResponse, router]);

  const onClickHash = (hash: string) => {
    setSelectedHash(hash);
  };
  const onClearImagePreview = () => {
    setImagePreview("");
    setValue("image", null);
  };

  return (
    post &&
    isMine && (
      <Layout hasBackArrow hasTabbar title={"EditPost"}>
        <form className="space-y-5 px-2 pb-10" onSubmit={handleSubmit(onValid)}>
          {imagePreview ? (
            <div className="relative">
              <Image
                src={imagePreview}
                width={1024}
                height={1024}
                className="w-full object-contain"
                alt="ImageFile"
              />
              <div
                onClick={onClearImagePreview}
                className="absolute right-5 top-5 cursor-pointer text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-8 w-8 rounded-md bg-sky-500"
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
            <p className="mb-4 ml-1 text-xl font-semibold">Select Hashtag</p>
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
            btnText="Edit Post"
            isLoading={loading || imageLoading}
            className="w-full rounded-md bg-sky-500 py-3 text-white shadow-md outline-none transition-colors hover:bg-sky-600"
          />
        </form>
      </Layout>
    )
  );
}

export const getServerSideProps = withSsrSession(
  async (ctx: NextPageContext) => {
    const {
      query: { postId },
    } = ctx;
    const user = ctx?.req?.session?.user;
    const isFav = Boolean(
      await client.like.findFirst({
        where: {
          user: {
            id: +user?.id!,
          },
          postId: +postId!,
        },
      })
    );
    const postInfo = await client.post.findFirst({
      where: {
        AND: [{ id: +postId! }, { userId: +user?.id! }],
      },
      include: {
        hashtag: {
          select: { name: true },
        },
      },
    });

    return {
      props: {
        ok: true,
        post: JSON.parse(JSON.stringify(postInfo)),
        isFav,
        isMine: postInfo?.userId === user?.id,
      },
    };
  }
);
