interface UrlProps {
  comuId?: string | string[] | undefined | null;
  hashId?: string | string[] | undefined | null;
}
export default function getQueryUrl({ comuId, hashId }: UrlProps) {
  return comuId
    ? `comuId=${comuId.toString()}`
    : hashId
    ? `hashId=${hashId.toString()}`
    : null;
}
