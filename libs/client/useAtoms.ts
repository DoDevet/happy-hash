import { atom, selector } from "recoil";

interface ICommentsInfo {
  commentsId: number;
  message: string;
  menuOpen: boolean;
  editModalOpen: boolean;
}

export interface IComuHashsInfo {
  id: number;
  name: string;
}

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

export const userMenuOpen = atom({
  key: "userMenuOpen",
  default: false,
});

export const postMenuOpen = atom({
  key: "postMenuOpen",
  default: false,
});

export const comuHashsInfo = atom<IComuHashsInfo[]>({
  key: "comuHashsInfo",
  default: [],
});

export const CommentsPageNav = atom({
  key: "commentsPageNav",
  default: {
    currentPage: 1,
    limitPage: 1,
  },
});
