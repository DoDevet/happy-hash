import "@/styles/globals.css";
import type { AppProps } from "next/app";
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
        <div className="mx-auto h-full w-full font-nunito">
          <Component {...pageProps} />
        </div>
      </SWRConfig>
    </RecoilRoot>
  );
}
