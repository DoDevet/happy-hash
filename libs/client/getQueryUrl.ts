interface UrlProps {
  comuId?: number;
  hashId?: number;
}
export default function getQueryUrl({ comuId, hashId }: UrlProps) {
  return comuId ? `comuId=${comuId}` : hashId ? `hashId=${hashId}` : null;
}
