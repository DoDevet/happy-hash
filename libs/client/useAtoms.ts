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
