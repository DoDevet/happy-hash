import type { UseFormRegisterReturn } from "react-hook-form";

interface ButtonProps {
  isLoading: boolean;
  btnText: string;

  [key: string]: any;
}

export default function Button({ isLoading, btnText }: ButtonProps) {
  return (
    <button className="my-10 rounded-md bg-sky-400 py-2 font-semibold text-white shadow-md transition-colors hover:bg-sky-600">
      {isLoading ? "Loading..." : btnText}
    </button>
  );
}
