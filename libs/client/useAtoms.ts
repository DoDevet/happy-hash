import { atom } from "recoil";

export const hashInfo = atom({
  key: "hashInfo",
  default: {
    hashs: "",
    customName: "",
    id: 0,
  },
});

export const isOpen = atom({
  key: "modalOpen",
  default: false,
});

export const homeMenuOpen = atom({
  key: "homeMenuOpen",
  default: false,
});

export const postMenuOpen = atom({
  key: "postMenuOpen",
  default: false,
});

export const commentsMenuOpen = atom({
  key: "commentsMenuOpen",
  default: {
    open: false,
    commentsId: 0,
  },
});
