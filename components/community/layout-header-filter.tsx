import { comuFilter } from "@/libs/client/useAtoms";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import Button from "../button";
import React from "react";
interface FilterData {
  likesNum: number;
  viewsNum: number;
  commentsNum: number;
}
function LayoutHeaderFilter() {
  const { register, handleSubmit, setValue } = useForm<FilterData>();
  const [openFilter, setOpenFilter] = useState(false);
  const [getFilter, setFilter] = useRecoilState(comuFilter);

  useEffect(() => {
    if (getFilter && getFilter.likesNum) {
      setValue("likesNum", getFilter.likesNum);
    }
    if (getFilter && getFilter.commentsNum) {
      setValue("commentsNum", getFilter.commentsNum);
    }
    if (getFilter && getFilter.viewsNum) {
      setValue("viewsNum", getFilter.viewsNum);
    }
  }, [getFilter]);

  const onClickButton = () => {
    setOpenFilter((prev) => !prev);
  };
  const onSubmit = (data: FilterData) => {
    setFilter({ ...data });
    setOpenFilter((prev) => !prev);
  };

  return (
    <div className="absolute right-5">
      <div className="relative flex flex-col items-center justify-center">
        <button onClick={onClickButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
            />
          </svg>
        </button>
        {openFilter ? (
          <div className="absolute right-1 top-6 w-36 bg-white dark:bg-[#1e272e] ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-2 rounded-md border px-2 py-2 shadow-md dark:border-gray-500"
            >
              <span>Filter</span>
              <div className="flex items-center space-x-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 text-red-400"
                >
                  <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                </svg>
                <input
                  {...register("likesNum")}
                  type="number"
                  className="w-16 rounded-sm border px-2 dark:border-gray-500 dark:bg-[#1e272e]"
                />
              </div>
              <div className="flex items-center space-x-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <input
                  className="w-16 rounded-sm border px-2 dark:border-gray-500 dark:bg-[#1e272e]"
                  {...register("viewsNum")}
                />
              </div>
              <div className="flex items-center space-x-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                  />
                </svg>

                <input
                  className="w-16 rounded-sm border px-2 dark:border-gray-500 dark:bg-[#1e272e]"
                  {...register("commentsNum")}
                />
              </div>
              <Button
                btnText="Save"
                isLoading={false}
                className={
                  "bg-darkerblue rounded-md bg-[#3b62a5] py-1 font-semibold text-white shadow-md outline-none ring-[#3b62a5] transition-colors focus:ring-2 focus:ring-offset-2"
                }
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default LayoutHeaderFilter;
