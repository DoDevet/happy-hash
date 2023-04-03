interface ButtonProps {
  isLoading: boolean;
  btnText: string;
  [key: string]: any;
}

export default function Button({
  isLoading,
  btnText,
  className,
  edit = "",
}: ButtonProps) {
  return (
    <button
      disabled={isLoading}
      className={
        className
          ? className
          : edit +
            "my-10 rounded-md bg-sky-500 py-2 font-semibold text-white shadow-md outline-none ring-sky-400 transition-colors hover:bg-sky-600 focus:ring-2 focus:ring-offset-2"
      }
    >
      {isLoading ? "Loading..." : btnText}
    </button>
  );
}
