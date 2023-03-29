interface ButtonProps {
  isLoading: boolean;
  btnText: string;
  [key: string]: any;
}

export default function Button({ isLoading, btnText, className }: ButtonProps) {
  return (
    <button
      className={
        className
          ? className
          : "my-10 rounded-md bg-sky-500 py-2 font-semibold text-white shadow-md transition-colors hover:bg-sky-600"
      }
    >
      {isLoading ? "Loading..." : btnText}
    </button>
  );
}
