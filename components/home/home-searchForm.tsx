import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Input from "../input";
import React from "react";
interface SearchForm {
  search: string;
}
function SearchForm() {
  const router = useRouter();
  const { handleSubmit, register, reset } = useForm<SearchForm>();
  const onSearchValid = (data: SearchForm) => {
    reset();
    router.push(
      {
        pathname: "/search",
        query: { params: data.search },
      },
      undefined,
      { shallow: true }
    );
  };
  return (
    <form
      className="mx-auto mt-5 flex max-w-2xl justify-center"
      onSubmit={handleSubmit(onSearchValid)}
    >
      <div className="relative w-11/12 ">
        <Input
          type="text"
          placeholder="Search #hash OR Post"
          register={register("search", {
            required: true,
          })}
        />
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="absolute right-3 top-2 h-6 w-6 text-gray-400 transition-colors hover:text-[#3b62a5]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
