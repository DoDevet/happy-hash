import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import useImage from "@/libs/client/useImage";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EditProfileForm {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  errorMessage?: string;
}

export default function EditProfile() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<EditProfileForm>();

  const [editProfile, { data, loading }] = useMutation<{ ok: boolean }>({
    url: "/api/user/me",
    method: "PATCH",
  });
  const { user } = useUser();
  const avatar = watch("avatar");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [cfLoading, setCFLoading] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(useImage({ imageId: user.avatar, method: "avatar" }));
    }
    if (user?.name) {
      setValue("name", user.name);
    }
    if (user?.email) {
      setValue("email", user.email);
    }
    if (user?.phone) {
      setValue("phone", user.phone);
    }
  }, [user]);
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file as any));
    }
  }, [avatar, setAvatarPreview]);

  const onValid = async ({ avatar, email, name, phone }: EditProfileForm) => {
    if (!phone && !email) {
      setError("errorMessage", {
        message: "Either phone number or email is required.",
      });
      return;
    }
    if (avatar && avatar.length === 0) {
      editProfile({ email, name, phone });
    } else {
      setCFLoading(true);
      const { uploadURL } = await (await fetch("/api/files")).json();
      const file = new FormData();
      file.append("file", avatar[0], `${user?.id}-${Date.now()}`);
      const {
        result: { id: avatarID },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: file,
        })
      ).json();
      editProfile({ avatarID, email, name, phone });
      setCFLoading(false);
    }
  };

  useEffect(() => {
    clearErrors();
  }, [watch("email"), watch("phone")]);
  return (
    <Layout
      hashTitle={"Edit Profile"}
      hasBackArrow
      hasTabbar
      title={"Edit Profile"}
    >
      <div className="mx-auto w-full max-w-3xl px-4">
        <form
          className="flex flex-col space-y-3 py-4"
          onSubmit={handleSubmit(onValid)}
        >
          <div className="flex items-center space-x-3">
            {avatarPreview ? (
              <Image
                alt="ProfileAvatar"
                width={123}
                height={123}
                className="h-16 w-16 rounded-full object-cover"
                src={avatarPreview}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-600" />
            )}

            <label
              htmlFor="avatar"
              className="rounded-md border bg-gray-50 px-2 py-2 hover:bg-gray-200"
            >
              <input
                accept="*/image"
                type={"file"}
                className="hidden"
                id="avatar"
                {...register("avatar")}
              />
              Change Avatar
            </label>
          </div>
          <Input
            label="Username"
            name="username"
            type="text"
            errorMessage={errors?.name?.message}
            placeholder="Input Username"
            register={register("name", {
              required: {
                value: true,
                message: "Username is required.",
              },
            })}
          />
          <Input
            label="Email"
            name="email"
            type="text"
            placeholder="Input Email"
            register={register("email")}
            errorMessage={errors?.errorMessage?.message ? " " : null}
          />
          <Input
            label="Phone Number"
            name="Phone"
            type="number"
            placeholder="Input Phone Number"
            register={register("phone")}
            errorMessage={errors?.errorMessage?.message ? " " : null}
          />
          {errors?.errorMessage?.message ? (
            <span className="text-center font-semibold text-red-500">
              {errors?.errorMessage?.message}
            </span>
          ) : null}
          {data?.ok ? (
            <span className="text-center font-semibold text-green-500">
              Confirm!
            </span>
          ) : null}
          <Button isLoading={loading || cfLoading} btnText="Edit Profile" />
        </form>
      </div>
    </Layout>
  );
}
