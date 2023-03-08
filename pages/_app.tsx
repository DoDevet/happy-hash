import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="mx-auto w-full max-w-xl font-nunito">
      <Component {...pageProps} />
    </div>
  );
}
