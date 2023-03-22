import { cls } from "@/libs/client/utils";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  type: "text" | "number" | "email";

  errorMessage?: string | undefined | null;
  [key: string]: any;
}
export default function Input({
  label,
  name,
  placeholder,
  type,
  register,
  errorMessage,
}: InputProps) {
  return (
    <div className="space-y-2 ">
      <label htmlFor={name} className="ml-1 block">
        {label}
      </label>
      <input
        id={name}
        className={cls(
          "w-full rounded-md border-2 py-2 px-2 shadow-sm transition-colors focus:outline-none",
          errorMessage
            ? "border-red-400 focus:border-red-400"
            : "focus:border-sky-500"
        )}
        placeholder={placeholder}
        {...register}
        type={type}
      />
      {errorMessage ? (
        <span className="mt-3 ml-1 block font-semibold text-red-500">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
