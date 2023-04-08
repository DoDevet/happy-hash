import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <SWRConfig
        value={{
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <ThemeProvider attribute="class">
          <div className="h-full w-full font-nunito">
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </SWRConfig>
    </RecoilRoot>
  );
}
