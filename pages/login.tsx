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
  token: string;
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

  const {
    register: tokenRegister,
    handleSubmit: handleTokenSubmit,
    setValue,
  } = useForm<TokenForm>();
  const [
    tokenValid,
    { data: tokenData, error: tokenError, loading: validLoading },
  ] = useMutation<MutationResponse>({
    url: "/api/user/confirm",
    method: "POST",
  });

  useEffect(() => {
    if (loginResponse && loginResponse.ok) {
      setValue("token", loginResponse.token);
    }
  }, [loginResponse]);

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
    <div className="mx-auto h-screen w-full bg-white pt-20 dark:bg-[#1e272e]">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-md border-gray-300 px-5 shadow-xl dark:bg-[#1e272e]">
        <h1 className="typed-out text-darkblue mt-10 text-center font-play text-4xl font-semibold">
          #happy_hash
        </h1>
        <span className="my-10 block text-center text-gray-700 dark:text-gray-300">
          Login with
        </span>
        <div
          className={
            "mb-7 flex w-full space-x-3 text-base shadow-sm transition-colors"
          }
        >
          <span
            className={cls(
              "w-full cursor-pointer border-b pb-4 text-center transition-colors dark:border-gray-500",
              loginMethod === "email"
                ? "text-darkblue border-b-[#3b62a5] dark:border-b-[#3b62a5]"
                : "text-gray-700 transition-colors dark:text-gray-400"
            )}
            onClick={() => onClickMethod("email")}
          >
            Email
          </span>
          <span
            className={cls(
              "w-full cursor-pointer border-b pb-4 text-center transition-colors dark:border-gray-500",
              loginMethod === "phone"
                ? "text-darkblue border-b-[#3b62a5] dark:border-b-[#3b62a5]"
                : "text-gray-700 transition-colors  dark:text-gray-400"
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
        <p>Test Account</p>
        <div className="text-gray-400">
          <p>Email : test@test.test</p>
          <p>Phone : 1234</p>
        </div>
      </div>
    </div>
  );
}
