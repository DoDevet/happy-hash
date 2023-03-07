import { useState } from "react";

type LoginMethod = "Email" | "Phone";

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("Email");

  const onClickMethod = (method: LoginMethod) => {
    setLoginMethod(method);
  };
  return (
    <div className="mt-16">
      <h1 className="m-10 text-center text-2xl font-semibold text-sky-500">
        Happy Hash
      </h1>
      <div className="mx-3 mt-10 flex flex-col items-center rounded-md border-2 border-gray-400 px-5">
        <span className="my-10 block text-center text-gray-700">
          Login with
        </span>
        <div className="mb-7 flex w-full space-x-3 text-lg transition-colors">
          <span
            className={
              "w-full cursor-pointer border-b-2 text-center text-gray-400 transition-colors" +
              (loginMethod === "Email" ? "  border-b-sky-500" : "")
            }
            onClick={() => onClickMethod("Email")}
          >
            Email
          </span>
          <span
            className={
              "w-full cursor-pointer border-b-2 text-center text-gray-400 transition-colors" +
              (loginMethod === "Phone" ? " border-b-sky-500" : "")
            }
            onClick={() => onClickMethod("Phone")}
          >
            Phone
          </span>
        </div>
        <form className="flex w-full flex-col">
          {loginMethod === "Email" ? (
            <>
              <label htmlFor="Email" className="mb-2 ml-2">
                Email
              </label>
              <input
                id="Email"
                className="rounded-md py-2 px-2 ring-2 focus:border-blue-400 focus:outline-none focus:ring-blue-400"
                placeholder="Email"
              />
            </>
          ) : (
            <>
              <label htmlFor="Phone" className="mb-2 ml-2">
                Phone
              </label>
              <input
                id="Phone"
                className="rounded-md py-2 px-2 ring-2 focus:border-blue-400 focus:outline-none focus:ring-blue-400"
                placeholder="Phone"
              />
            </>
          )}
          <button className=" m-10 rounded-md bg-sky-400 py-2 font-semibold text-white">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
