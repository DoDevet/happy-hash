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
            "bg-darkerblue my-10 rounded-md bg-[#3b62a5] py-2 font-semibold text-white shadow-md outline-none ring-[#3b62a5] transition-colors focus:ring-2 focus:ring-offset-2"
      }
    >
      {isLoading ? "Loading..." : btnText}
    </button>
  );
}
