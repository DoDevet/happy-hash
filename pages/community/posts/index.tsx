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
import usePostFeed from "@/libs/client/usePostFeed";
import { prevPostInfo } from "@/libs/client/useAtoms";
import { useRecoilState, useRecoilValue } from "recoil";

interface PostProps {
  ok: boolean;
  hashs: string[];
  comuId: string | undefined;
  hashId: string | undefined;
  [key: string]: any;
}

export default function HashCommunity({
  title,
  comuId,
  hashId,
  hashs,
}: PostProps) {
  const router = useRouter();
  const {
    query: { postId },
  } = router;
  return (
    <div>
      {postId ? <PostModalDetail /> : null}
      <Layout title={title} hasTabbar hasBackHome bottomTab hasFilterMenu>
        {hashs && hashs.length > 1 ? (
          <PostFeedNav comuId={comuId!} hashs={hashs} />
        ) : null}
        <CommunityPostFeed hashs={hashs} />
        <FixedButton comuId={comuId} hashId={hashId}>
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
    </div>
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
      const scTag = await client.shortcutTag.findFirst({
        where: {
          AND: [{ user: { id: +user?.id! } }, { id: +comuId! }],
        },
        select: {
          hashtags: {
            select: {
              name: true,
            },
          },
          userId: true,
          customName: true,
          name: true,
          id: true,
        },
      });

      if (!scTag) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
          props: {},
        };
      }

      const title = scTag.customName ? scTag.customName : scTag.name;
      return {
        props: {
          ok: true,
          title: JSON.parse(JSON.stringify(title)),
          comuId: JSON.parse(JSON.stringify(scTag?.id)),
          hashs: JSON.parse(
            JSON.stringify(scTag.hashtags.map((hash) => hash?.name))
          ),
        },
      };
    } else if (hashId) {
      const hashInfo = await client.hashtag.findUnique({
        where: { id: +hashId! },
      });
      if (!hashInfo) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
          props: {},
        };
      }

      return {
        props: {
          ok: true,
          title: JSON.parse(JSON.stringify(hashInfo.name)),
          hashId: JSON.parse(JSON.stringify(hashId)),
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props: {},
      };
    }
  }
);
