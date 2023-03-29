import useSWR from "swr";
interface GetHashForm {
  comuId: number;
}

export default function getHashTags({ comuId }: GetHashForm): string[] {
  const { data } = useSWR(`/api/community?comuId=${comuId}`);
  return data?.hashArr;
}
