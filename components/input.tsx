import { cls } from "@/libs/client/utils";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label?: string;
  name?: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  type: "text" | "number" | "email" | "textArea";

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
    <div className="dark:bg-[#1e272e]">
      {label && (
        <label htmlFor={name} className="ml-1 block">
          {label}
        </label>
      )}

      {type === "textArea" ? (
        <textarea
          id={name}
          placeholder="Write...."
          className={cls(
            "h-28 w-full resize-none whitespace-pre-line rounded-md border-2 p-2 shadow-sm outline-none transition-colors dark:border-gray-500 dark:bg-gray-800",
            errorMessage
              ? "border-red-400 focus:border-red-400"
              : "focus:border-[#3b62a5] dark:focus:border-[#2c5398]"
          )}
          {...register}
        />
      ) : (
        <input
          id={name}
          className={cls(
            "w-full rounded-md border-2 p-2 shadow-sm transition-colors focus:outline-none dark:border-gray-500 dark:bg-gray-800",
            errorMessage
              ? "border-red-400 focus:border-red-400"
              : "focus:border-[#3b62a5] dark:focus:border-[#2c5398]"
          )}
          placeholder={placeholder}
          {...register}
          type={type}
          autoFocus
        />
      )}
      {errorMessage ? (
        <span className="ml-1 mt-1 block font-semibold  text-red-500">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
