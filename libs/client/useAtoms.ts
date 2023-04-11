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

export const commentsMenuState = atom<ICommentsInfo>({
  key: "commentsMenu",
  default: {
    commentsId: 0,
    message: "",
    menuOpen: false,
    editModalOpen: false,
  },
});

export const commentsSelector = selector({
  key: "commentsSelector",
  get: ({ get }) => {
    const info = get(commentsMenuState);
    return {
      commentsId: info.commentsId,
      menuOpen: info.menuOpen,
      message: info.message,
      editModalOpen: info.editModalOpen,
    };
  },
  set: ({ set }, newValue) => {
    set(commentsMenuState, (prev) => ({ ...prev, ...newValue }));
  },
});

export const commentsEditSelector = selector({
  key: "commentsEditSelector",
  get: ({ get }) => {
    const editOpen = get(commentsMenuState);
    return {
      editModalOpen: editOpen.editModalOpen,
      menuOpen: editOpen.menuOpen,
    };
  },
  set: ({ set }, newValue) => {
    set(commentsMenuState, (prev) => ({ ...prev, ...newValue }));
  },
});

export const comuHashsInfo = atom<IComuHashsInfo[]>({
  key: "comuHashsInfo",
  default: [],
});


