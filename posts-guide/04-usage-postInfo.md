---
title: 구현 - 3 Post, Comments CRUD
date: 2022.02.02
---

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/4aae6628-fac1-41e0-b84d-c6aca838af00/public)

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/2b0ecce1-db03-437c-1fba-edb41bd66d00/public)

Create

글쓰기 버튼을 누르면 볼 수 있는 입력창으로 이미지, 제목, 내용, 해시태그를 요구한다.

select Hashtags는 커뮤니티에 입장할때 state 값으로 등록되며

새로고침 등으로 state값이 사라졌을때엔 api로 불러온다.

이미지 파일은 Cloudflare의 Direct upload Image api를 통해

서버를 직접 경유하지 않고 프론트단에서 업로드 할 수 있도록 구현하였다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/e53a2aa3-dc15-4975-f02b-90b664905600/public)

Create 성공시 스크롤은 최상단에 위치하게 되고, 게시글 목록의 첫번째 페이지만 리렌더링 된다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/22cd79ef-691d-4877-6749-bd9c349d9200/public)

Read

글을 클릭할 시 댓글 컴포넌트는 로딩시 스켈레톤 컴포넌트가 나온다.

본문에 있는 해시태그를 클릭하면 해당 해시태그의 커뮤니티 페이지로 이동하게 된다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/70131ad8-4c31-4181-a4cb-b7fae9197800/public)

Update, Delete

자신이 작성한 글, 댓글 이라면 우측 상단의 헤더에 입실론 아이콘이 뜨게 되고

여기서 작성한 글을 수정하거나 삭제 할 수 있다.

글의 수정과 삭제, 좋아요 요청은 즉각적으로 캐시데이터를 수정하는것으로 부하를 줄였고, 스크롤은 유지된다.

이미지 파일이 변경되지 않았다면 제목과 글만 수정함.

댓글의 생성, 삭제 요청은 revalidate로 해결하였다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/e60261d1-3bdf-4370-f11c-f5ff541ad200/public)

Comments Pagenation

댓글이 10개 이상이면 Page를 전환할 수 있는 navigater가 나온다.
