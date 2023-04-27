import "@/styles/globals.scss";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  console.log(router.query);
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
            <Analytics />
          </div>
        </ThemeProvider>
      </SWRConfig>
    </RecoilRoot>
  );
}
