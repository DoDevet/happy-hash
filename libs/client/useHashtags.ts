export default function useHashTags(str: string) {
  const regex = /[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g;
  const arrWithoutHashtags = str
    .split(",")
    .map((str) => str.trim().replace(regex, ""))
    .filter((str) => str !== "")
    .map((str) => (/[a-zA-Z]/.test(str) ? str.toLowerCase() : str));
  const uniqueArr = Array.from(new Set(arrWithoutHashtags));

  return uniqueArr;
}
