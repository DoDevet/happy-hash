import FixedButton from "@/components/fixed-btn";
import Layout from "@/components/layout";
import React, { useEffect } from "react";
import PostModalDetail from "@/components/community/post-modal";
import { NextPageContext } from "next";
import { withSsrSession } from "@/libs/server/withSession";
import client from "@/libs/server/client";
import PostFeedNav from "@/components/community/post-Feed-nav";
import CommunityBottomTab from "@/components/community/community-bottomTab";
import CommunityPostFeed from "@/components/community/community-post-feed";
import { useRouter } from "next/router";
import useSWR, { SWRConfig } from "swr";

interface ComuInfoForm {
  ok: boolean;
  title: string | undefined;
  hashArr: [{ name: string; id: number }];
}

function HashCommunity() {
  const router = useRouter();
  const {
    query: { postId, comuId, hashId },
  } = router;
  const { data } = useSWR<ComuInfoForm>(
    `/api/community?${comuId ? `comuId=${comuId}` : `hashId=${hashId}`}`
  );
  const hashs = data?.hashArr?.map((hash) => hash.name);

  return (
    <>
      {postId ? <PostModalDetail /> : null}
      <Layout
        title={
          data?.title
            ? data.title
            : hashs?.map((hash, index) => (index === 0 ? hash : ", " + hash))
        }
        hasTabbar
        hasBackHome
        bottomTab
        hasFilterMenu
      >
        {hashs && hashs.length > 1 ? (
          <PostFeedNav comuId={comuId?.toString()} hashs={hashs} />
        ) : null}
        <CommunityPostFeed hashs={hashs} />
        <FixedButton comuId={comuId?.toString()} hashId={hashId?.toString()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={"none"}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </FixedButton>
        <CommunityBottomTab />
      </Layout>
    </>
  );
}

export default function Page({ ok, hashArr, title }: ComuInfoForm) {
  const router = useRouter();
  const {
    query: { comuId, hashId },
  } = router;
  return (
    <SWRConfig
      value={{
        fallback: {
          [`/api/community?${
            comuId ? `comuId=${comuId}` : hashId ? `hashId=${hashId}` : null
          }`]: {
            ok,
            hashArr,
            title,
          },
        },
      }}
    >
      <HashCommunity />
    </SWRConfig>
  );
}

export const getServerSideProps = withSsrSession(
  async (ctx: NextPageContext) => {
    console.log("SSR");
    const {
      query: { comuId, hashId },
    } = ctx;
    const user = ctx?.req?.session?.user;
    if (comuId) {
      const scHash = await client.shortcutTag.findFirst({
        where: { id: +comuId! },
        select: {
          userId: true,
          customName: true,
          hashtags: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      if (scHash === null || scHash?.userId !== +user?.id!) {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props: {},
        };
      } else
        return {
          props: {
            ok: true,
            hashArr: JSON.parse(JSON.stringify(scHash.hashtags)),
            title: JSON.parse(JSON.stringify(scHash.customName)),
          },
        };
    } else if (hashId) {
      const hashArr = await client.hashtag.findUnique({
        where: { id: hashId ? +hashId : undefined },
        select: { name: true, id: true },
      });
      if (!hashArr) {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
          props: {},
        };
      } else
        return {
          props: {
            ok: true,
            hashArr: JSON.parse(
              JSON.stringify([{ name: hashArr.name, id: hashArr.id }])
            ),
            title: JSON.parse(JSON.stringify(hashArr.name)),
          },
        };
    }
  }
);
