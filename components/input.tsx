import { cls } from "@/libs/client/utils";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  label: string;
  name: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  type: "text" | "number" | "email";
  [key: string]: any;
}
export default function Input({
  label,
  name,
  placeholder,
  type,
  register,
}: InputProps) {
  return (
    <div className="space-y-2 shadow-sm">
      <label htmlFor={name} className="ml-1 block">
        {label}
      </label>
      <input
        id={name}
        className="w-full rounded-md border-2 py-2 px-2 shadow-sm transition-colors focus:border-sky-500 focus:outline-none"
        placeholder={placeholder}
        {...register}
        type={type}
      />
    </div>
  );
}
