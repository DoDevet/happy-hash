import { useRouter } from "next/router";

export default function HashCommunity() {
  const router = useRouter();
  console.log(router.query);
  return <div>안녕</div>;
}
