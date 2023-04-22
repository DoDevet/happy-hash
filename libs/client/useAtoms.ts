import { atom } from "recoil";
import { PostForm } from "./usePostInfo";
interface ICommentsInfo {
  commentsId: number;
  message: string;
  menuOpen: boolean;
  editModalOpen: boolean;
}
interface RecycleProps {
  hashtag: { name: string };
  id: number;
  image: string;
  likesNum: number;
  payload: string;
  title: string;
  user: {
    name: string;
    id: number;
    avatar: string | null;
  };
  createdAt: Date;
  views: number;
  _count: { comments: number; likes: number };
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

export const recyclePostInfo = atom<RecycleProps | undefined>({
  key: "recyclePostInfo",
  default: undefined,
});

export const prevPostInfo = atom<PostForm | undefined>({
  key: "prevPostInfo",
  default: undefined,
});

export const comuFilter = atom({
  key: "filter",
  default: {
    likesNum: 10,
    viewsNum: 0,
    commentsNum: 0,
  },
});

export const selectFilter = atom({
  key: "selectFilter",
  default: false,
});
