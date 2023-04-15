export default function CommentsFeedLoading() {
  return (
    <div className="group flex animate-pulse dark:divide-gray-500 dark:border-gray-500 ">
      <div className="flex w-full max-w-[30%] items-center space-x-2 border-r px-2 py-2 text-sm dark:border-gray-500 sm:max-w-[16%]">
        <div className="h-7 w-7 rounded-full bg-slate-300 dark:bg-slate-700" />
        <div className="h-3 w-24 overflow-hidden rounded-md bg-slate-300 dark:bg-slate-700 sm:w-16" />
      </div>
      <div className="relative flex w-full max-w-3xl flex-col justify-center space-y-2 break-all px-3 py-1">
        <div className="h-3 w-[50%] rounded-md bg-slate-300 dark:bg-slate-700" />
        <div className="h-3 w-[25%] rounded-md bg-slate-300 dark:bg-slate-700" />
      </div>
    </div>
  );
}
