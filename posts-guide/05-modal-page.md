---
title: 구현 - 4 Modal Post Detail
date: 2022.02.02
---

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/863d2c11-0743-40ef-94bc-e997c991be00/public)

Post Feed에서 글을 클릭시 인자로 값을 넘겨줌으로써

게시글을 클릭하게 되면 로딩없이 바로 본문의 내용들을 볼 수 있다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/6441b828-d565-428f-d64b-7698609f8e00/public)

주소는 community/posts/[postId] 로 되어있지만 이는 Link의 as props를 이용하여 데코레이션을 한것으로

실은 postId라는 query값이 추가가 되면서 모달이 생성되는 방식이다.

반응형 웹으로 PC에서는 Modal로 열리는것을 볼 수 있다.

새로고침으로 인해 State나 Props로 전달해준 값을 잃게 되어도

데코레이션 된 url을 기반으로 실행하기 때문에 실제 /community/posts/[postId] 주소로 라우팅 된다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/3d191bea-741c-4c1a-638d-c592a846c100/public)

해당 페이지(/community/posts/[postId])는 서버사이드 렌더링으로 구현되었기 때문에

새로고침을 하여도 문제없이 동작한다.
