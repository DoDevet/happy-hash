interface useImageProps {
  imageId: string | undefined | null;
  method?: "public" | "avatar";
}

export default function useImage({
  imageId,
  method = "public",
}: useImageProps) {
  return `https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/${imageId}/${method}`;
}
