import useSWR from "swr";
interface GetHashForm {
  comuId?: number;
  hashId?: number;
}

export default function getHashTags({ comuId, hashId }: GetHashForm): string[] {
  const { data } = useSWR(
    comuId
      ? `/api/community?comuId=${comuId}`
      : `/api/community?hashId=${hashId}`
  );
  return data?.hashArr;
}
