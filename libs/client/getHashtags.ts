import { useRecoilValue } from "recoil";
import useSWR from "swr";
import { comuHashsInfo, IComuHashsInfo } from "./useAtoms";
interface GetHashForm {
  comuId?: string | undefined;
  hashId?: string | undefined;
}

export default function getHashTags({
  comuId,
  hashId,
}: GetHashForm): IComuHashsInfo[] {
  const hash = useRecoilValue(comuHashsInfo);
  if (hash && hash.length !== 0) {
    return hash;
  }
  const { data } = useSWR(
    comuId
      ? `/api/community?comuId=${comuId}`
      : hashId
      ? `/api/community?hashId=${hashId}`
      : null
  );

  return data?.hashArr;
}
