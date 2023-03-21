import Input from "@/components/input";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginMethod = "Email" | "Phone";

interface LoginForm {
  email?: string;
  phone?: string;
}
interface LoginResult {
  ok: boolean;
}

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("Email");
  const { register, handleSubmit } = useForm<LoginForm>();

  const [createAccount, { loading, data, error }] = useMutation<LoginResult>({
    method: "POST",
    url: "/api/login",
  });

  const onClickMethod = (method: LoginMethod) => {
    setLoginMethod(method);
  };

  const onLoginValid = (data: LoginForm) => {
    console.log(data);
    createAccount(data);
    //email 보내고 token 생성.
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
              loginMethod === "Email"
                ? "border-b-sky-500 text-sky-500"
                : "text-gray-700 transition-colors hover:text-gray-400"
            )}
            onClick={() => onClickMethod("Email")}
          >
            Email
          </span>
          <span
            className={cls(
              "w-full cursor-pointer border-b pb-4 text-center text-gray-700 transition-colors hover:text-gray-400",
              loginMethod === "Phone"
                ? "border-b-sky-500 text-sky-500"
                : "text-gray-700 transition-colors hover:text-gray-400"
            )}
            onClick={() => onClickMethod("Phone")}
          >
            Phone
          </span>
        </div>
        <form
          className="flex w-full flex-col"
          onSubmit={handleSubmit(onLoginValid)}
        >
          {loginMethod === "Email" ? (
            <Input
              type="email"
              register={register("email", { required: true })}
              label="Email Adress"
              name="email"
              placeholder="Input Email Adress"
            />
          ) : (
            <Input
              type="number"
              register={register("phone", { required: true })}
              label="Phone Number"
              name="phone"
              placeholder="Input Phone Number"
            />
          )}
          <button className="my-10 rounded-md bg-sky-400 py-2 font-semibold text-white shadow-md transition-colors hover:bg-sky-600">
            Get Login
          </button>
        </form>
      </div>
    </div>
  );
}
