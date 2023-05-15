import { cls } from "@/libs/client/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
SwiperCore.use([Navigation]);
interface PostFeedNavProps {
  comuId: string | undefined;
  hashs: string[] | undefined | null;
}

function PostFeedNav({ comuId, hashs }: PostFeedNavProps) {
  const router = useRouter();

  const {
    query: { selectHash },
  } = router;
  const allQuery = { ...router.query };
  delete allQuery.selectHash;

  return (
    <div className="fixed top-14 z-20 mx-auto h-12 w-full bg-inherit bg-white py-1 dark:bg-[#1e272e] ">
      <div className="mx-auto flex w-full max-w-3xl items-center space-x-3 overflow-y-hidden   border-b px-4 py-2 dark:border-gray-500">
        <Swiper
          modules={[Navigation, Scrollbar]}
          slidesPerView={3}
          loopedSlides={1}
          autoplay={false}
          navigation={{
            nextEl: ".image-swiper-button-next",
            prevEl: ".image-swiper-button-prev",
            disabledClass: "swiper-button-disabled",
          }}
          scrollbar={{ draggable: true }}
          className="w-full text-center"
          centerInsufficientSlides={true}
        >
          <div className="swiper-button image-swiper-button-prev absolute left-0 top-0 z-50 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </div>
          <div className="swiper-button image-swiper-button-next absolute right-0 top-0 z-50 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>

          <SwiperSlide>
            <Link
              href={{ pathname: router.pathname, query: allQuery }}
              className={cls(
                "border-b text-center",
                !selectHash
                  ? "border-[rgb(59,98,165)] text-[#3b62a5] dark:text-[#5f86c9]"
                  : "truncate border-transparent"
              )}
              replace
              shallow
            >
              All
            </Link>
          </SwiperSlide>
          {hashs?.map((hash) => (
            <SwiperSlide key={hash}>
              <Link
                href={{
                  pathname: router.pathname,
                  query: { ...router.query, selectHash: hash },
                }}
                replace
                shallow
                className={cls(
                  "border-b",
                  selectHash === hash
                    ? "border-[#3b62a5] text-[#3b62a5] dark:text-[#5f86c9]"
                    : "truncate border-transparent"
                )}
              >
                {hash}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
export default PostFeedNav;
