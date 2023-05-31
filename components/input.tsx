import { cls } from "@/libs/client/utils";
import { useCallback, useRef } from "react";

import type { UseFormRegisterReturn} from "react-hook-form";

interface InputProps {
  label?: string;
  name?: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  type: "text" | "number" | "email" | "textArea";
  isfocus?: boolean;
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
  isfocus = false,
}: InputProps) {
  const payloadRef = useRef<HTMLTextAreaElement|null>(null)
  const handleChangePayload = useCallback(() =>{
    if(!payloadRef || !payloadRef.current) return;
    payloadRef.current.style.height= "auto"
    payloadRef.current.style.height = `${payloadRef.current.scrollHeight >= 112 ? payloadRef.current.scrollHeight : 112}px`
  },[payloadRef])
  return (
    <div className="dark:bg-[#1e272e]">
      {label && (
        <label htmlFor={name} className="block ml-1">
          {label}
        </label>
      )}
      {type === "textArea" ? (
        <textarea
          {...register}
          ref={(e)=>{
            register?.ref(e)
            payloadRef.current=e;}}
          onInput={handleChangePayload}
          id={name}
          placeholder="Write...."
          className={cls(
            "h-28 w-full resize-none whitespace-pre-line rounded-md border-2 p-2 shadow-sm outline-none transition-colors dark:border-gray-500 dark:bg-gray-800",
            errorMessage
              ? "border-red-400 focus:border-red-400"
              : "focus:border-[#3b62a5] dark:focus:border-[#2c5398]"
          )}

        />
      ) : (
        <input
          {...register}
          id={name}
          className={cls(
            "w-full rounded-md border-2 p-2 shadow-sm transition-colors focus:outline-none dark:border-gray-500 dark:bg-gray-800",
            errorMessage
              ? "border-red-400 focus:border-red-400"
              : "focus:border-[#3b62a5] dark:focus:border-[#2c5398]"
          )}
          placeholder={placeholder}
          type={type}
          autoFocus={isfocus}
        />
      )}
      {errorMessage ? (
        <span className="block mt-1 ml-1 font-semibold text-red-500">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
