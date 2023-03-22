import Button from "@/components/button";
import Input from "@/components/input";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type LoginMethod = "email" | "phone";

interface LoginForm {
  email?: string;
  phone?: string;
}
interface MutationResponse {
  ok: boolean;
}

interface TokenForm {
  token: string;
}

export default function Login() {
  const router = useRouter();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");

  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const [createAccount, { loading, data: loginResponse, error }] =
    useMutation<MutationResponse>({
      url: "/api/user/login",
      method: "POST",
    });

  const { register: tokenRegister, handleSubmit: handleTokenSubmit } =
    useForm<TokenForm>();
  const [
    tokenValid,
    { data: tokenData, error: tokenError, loading: validLoading },
  ] = useMutation<MutationResponse>({
    url: "/api/user/confirm",
    method: "POST",
  });

  useEffect(() => {
    if (tokenData && tokenData.ok) {
      router.replace("/");
    }
  }, [tokenData, router]);

  const onClickMethod = (method: LoginMethod) => {
    reset({});
    setLoginMethod(method);
  };

  const onLoginValid = (data: LoginForm) => {
    createAccount(data);
  };

  const onConfirmValid = (data: TokenForm) => {
    tokenValid(data);
  };

  return (
    <div className="mt-16">
      <div className="mx-3 mt-10 flex flex-col items-center rounded-md border-gray-300 px-5 shadow-md">
        <h1 className="typed-out mt-10 text-center text-4xl font-semibold text-sky-500">
          #happy_hash
        </h1>
        <span className="my-10 block text-center text-gray-700">
          Login with
        </span>
        <div
          className={
            "mb-7 flex w-full space-x-3 text-base shadow-sm transition-colors"
          }
        >
          <span
            className={cls(
              "w-full cursor-pointer border-b pb-4 text-center",
              loginMethod === "email"
                ? "border-b-sky-500 text-sky-500"
                : "text-gray-700 transition-colors hover:text-gray-400"
            )}
            onClick={() => onClickMethod("email")}
          >
            Email
          </span>
          <span
            className={cls(
              "w-full cursor-pointer border-b pb-4 text-center text-gray-700 transition-colors hover:text-gray-400",
              loginMethod === "phone"
                ? "border-b-sky-500 text-sky-500"
                : "text-gray-700 transition-colors hover:text-gray-400"
            )}
            onClick={() => onClickMethod("phone")}
          >
            Phone
          </span>
        </div>
        <form
          className="flex w-full flex-col"
          onSubmit={
            loginResponse?.ok
              ? handleTokenSubmit(onConfirmValid)
              : handleSubmit(onLoginValid)
          }
        >
          {loginResponse?.ok ? (
            <>
              <Input
                type="number"
                register={tokenRegister("token", { required: true })}
                label="Input Token"
                name="token"
                placeholder="Input Token"
              />
              <Button isLoading={validLoading} btnText="Input Token" />
            </>
          ) : (
            <>
              {loginMethod === "email" ? (
                <Input
                  type="email"
                  register={register("email", { required: true })}
                  label="Email Adress"
                  name="email"
                  placeholder="Input Email Adress"
                />
              ) : null}
              {loginMethod === "phone" ? (
                <Input
                  type="number"
                  register={register("phone", { required: true })}
                  label="Phone Number"
                  name="phone"
                  placeholder="Input Phone Number"
                />
              ) : null}
              <Button isLoading={loading} btnText="Get Login" />
            </>
          )}
        </form>
      </div>
    </div>
  );
}
