import HomeLayout from "@/components/home/homeLayout";
import { useRouter } from "next/router";

export default function SearchPage() {
  const router = useRouter();
  const {
    query: { params },
  } = router;
  console.log(params);
  return (
    <HomeLayout title="Search">
      <div>{params}</div>
    </HomeLayout>
  );
}
