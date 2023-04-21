import Input from "@/components/input";
import Layout from "@/components/layout";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import getHashTags from "@/libs/client/getHashtags";
import Button from "@/components/button";
import { cls } from "@/libs/client/utils";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import usePostInfo from "@/libs/client/usePostInfo";
import useUser from "@/libs/client/useUser";

interface PostForm {
  title: string;
  payload: string;
  image?: FileList | null;
  error?: string;
}

interface PostInputPorps {
  title?: string;
  payload?: string;
  imageId?: string;
  edit?: boolean;
  hashName?: string;
  isMine?: boolean;
}

interface PostMutationResponse {
  ok: boolean;
  postId?: number;
}

interface MutateSetProps {
  title: string;
  payload: string;
  image: string;
  hashtag: {
    id: number;
    name: string;
  };
  hashtagId: number;
}

export default function PostInputForm({
  title,
  payload,
  imageId,
  edit = false,
  hashName,
  isMine,
}: PostInputPorps) {
  const router = useRouter();
  const { mutate } = usePostInfo();
  const {
    query: { comuId, postId, hashId },
  } = router;
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<PostForm>();
  const hashArr = getHashTags({
    comuId: comuId?.toString(),
    hashId: hashId?.toString(),
  });
  const { user } = useUser();
  const [imagePreview, setImagePreview] = useState("");
  const [selectedHash, setSelectedHash] = useState<{
    id: number;
    name: string;
  }>();
  const [imageLoading, setImageLoading] = useState(false);
  const image = watch("image");
  const [mutateSet, setMutateSet] = useState<MutateSetProps>();
  const [postMutation, { data: postMutationResponse, loading }] =
    useMutation<PostMutationResponse>({
      url: edit
        ? `/api/community/posts/${postId}`
        : `/api/community/posts?${postId}`,
      method: edit ? "PATCH" : "POST",
    });

  const onValid = async ({ title, payload, image }: PostForm) => {
    if (loading) return;
    if (!imagePreview) {
      setError("image", { message: "Image Required" });
      return;
    }
    if (!image || image?.length === 0) {
      setMutateSet({
        image: imageId!,
        title,
        payload,
        hashtag: { id: selectedHash?.id!, name: selectedHash?.name! },
        hashtagId: selectedHash?.id!,
      });
      postMutation({
        title,
        payload,
        selectedHash: selectedHash?.name,
        postId,
      });
    } else {
      setImageLoading(true);
      const { uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      form.append("file", image[0], `post-${user?.id}-${Date.now()}`);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();
      setMutateSet({
        image: id!,
        title,
        payload,
        hashtag: { id: selectedHash?.id!, name: selectedHash?.name! },
        hashtagId: selectedHash?.id!,
      });

      postMutation({
        title,
        payload,
        selectedHash: selectedHash?.name,
        imageURL: id,
        postId,
      });

      setImageLoading(false);
    }
  };
  useEffect(() => {
    if (edit && !isMine) {
      router.back();
    }
  }, [isMine]);
  useEffect(() => {
    if (edit) {
      if (title) {
        setValue("title", title);
      }
      if (payload) {
        setValue("payload", payload);
      }
      if (imageId) {
        setImagePreview(useImage({ imageId }));
      }
    }
  }, [edit]);
  useEffect(() => {
    if (hashArr) {
      setSelectedHash(
        edit
          ? hashArr[hashArr.findIndex((hash) => hash.name === hashName)]
          : hashArr[0]
      );
    }
  }, [hashArr]);

  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file as any));
    }
  }, [image]);

  useEffect(() => {
    if (postMutationResponse && postMutationResponse.postId) {
      if (edit) {
        mutate(
          (prev) =>
            prev && {
              ...prev,
              post: {
                ...prev.post,
                ...mutateSet,
              },
            },
          false
        );
      }

      router.replace(
        `/community/posts/${postMutationResponse.postId}?${
          comuId ? `comuId=${comuId}` : `hashId=${hashId}`
        }`,
        undefined,
        { shallow: false }
      );
    }
  }, [postMutationResponse, router]);

  useEffect(() => {
    document.body.style.overflow = "unset";
  }, []);

  const onClickHash = (hash: { id: number; name: string }) => {
    setSelectedHash(hash);
  };
  const onClearImagePreview = () => {
    setImagePreview("");
    setValue("image", null);
  };

  return (
    <Layout hasBackArrow hasTabbar title={edit ? "Edit Post" : "Write Post"}>
      <form
        className="mx-auto w-full max-w-3xl space-y-5 px-2 pb-10"
        onSubmit={handleSubmit(onValid)}
      >
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
                className="bg-darkblue h-8 w-8 rounded-md"
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
              className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dotted text-gray-600 transition-colors hover:border-[#3b62a5] hover:text-[#3b62a5] dark:border-gray-500 dark:hover:border-[#3b62a5]"
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
          <div className="flex flex-wrap space-x-5">
            {hashArr?.map((hash, index) => (
              <div
                key={index}
                className={cls(
                  "bg-darkerblue w-fit cursor-pointer rounded-full px-2 py-1 shadow-md transition-colors hover:text-white",
                  selectedHash?.name === hash.name
                    ? "bg-darkblue text-white"
                    : "bg-slate-300 text-gray-100"
                )}
                onClick={() => onClickHash(hash)}
              >
                <span>#{hash.name}</span>
              </div>
            ))}
          </div>
        </div>
        <Button
          btnText={edit ? "Edit Post" : "Write Post"}
          isLoading={loading || imageLoading}
          className="bg-darkblue bg-darkerblue w-full rounded-md py-3 text-white shadow-md outline-none transition-colors"
        />
      </form>
    </Layout>
  );
}
