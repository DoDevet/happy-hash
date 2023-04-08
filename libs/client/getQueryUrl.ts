interface UrlProps {
  comuId?: string;
  hashId?: string;
}
export default function getQueryUrl({ comuId, hashId }: UrlProps) {
  return comuId ? `comuId=${comuId}` : hashId ? `hashId=${hashId}` : null;
}
