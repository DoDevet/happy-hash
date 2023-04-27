---
title: 구현 - 4 Modal Post Detail
date: 2022.02.02
---

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/863d2c11-0743-40ef-94bc-e997c991be00/public)

빠른 로딩을 위해 게시판에 불려와진 글 목록 데이터(제목, 댓글 수, 본문 내용, Username 등)에

Post의 이미지 경로와 User avatar 이미지 경로를 추가하여 글을 클릭할때 데이터를 재사용 할 수 있도록 구현하였다.

주소는 community/posts/[postId] 로 되어있지만 이는 Link의 as props를 이용하여 데코레이션을 한것으로

실은 글 목록에 postId라는 query값이 추가가 되면서 모달 컴포넌트가 불려와지는 방식이다. (/community/posts?postId=[postId])

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/6441b828-d565-428f-d64b-7698609f8e00/public)

반응형 웹으로 PC에서는 Modal로 열리는것을 볼 수 있다.

또한, 글 목록에서부터 받은 데이터가 Edit 되거나 Delete 될 수도 있기 때문에

Post를 클릭시 정보를 얻기위한 API를 호출하고, 로딩이 끝나기 전까진 state로 념겨준 데이터를 우선적으로 보여주도록 하였다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/3d191bea-741c-4c1a-638d-c592a846c100/public)

새로고침으로 인해 State나 Props로 전달해준 값을 잃게 되어도

데코레이션 된 url을 기반으로 실행하기 때문에 실제 /community/posts/[postId] 주소로 라우팅 된다.

해당 페이지(/community/posts/[postId])는 서버사이드 렌더링으로 데이터를 불러오기에

새로고침이나 주소로 접근 하여도 문제없이 동작한다.
