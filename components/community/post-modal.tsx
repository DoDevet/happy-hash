import PostForm from "./post-form";

export default function PostModalDetail() {
  return (
    <div className="fixed z-50 mx-auto flex h-screen w-full items-center justify-center bg-black bg-opacity-60 ">
      <div className="no-scroll dark:bg mx-auto flex h-full w-full max-w-3xl overflow-auto rounded-md bg-white dark:bg-[#1e272e] xl:h-[90%]">
        <PostForm isModal />
      </div>
    </div>
  );
}
