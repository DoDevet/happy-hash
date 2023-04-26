---
title: 구현 - 2 커뮤니티 홈
date: 2022.02.02
---

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/6a5bc12b-6956-405f-0aa0-06866ccdcd00/public)

enter 버튼이나 해시태그를 누르게 되면 커뮤니티로 이동한다.

좌측 상단의 버튼은 home으로 가는 버튼이며

중앙에 있는 카테고리는 등록한 해시태그들로 클릭하게 되면

해당 해시태그의 글들만 볼 수 있다.

단일 해시태그를 클릭했거나 등록한 해시태그가 2개 미만이면 생략된다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/c1c41afd-54b6-4955-876f-e1440bfb4a00/public)

filter 옵션은 우측 상단의 버튼을 눌러서 수정할 수 있다.

입력값 이상의 좋아요, 조회수, 댓글 수를 필터링 할 수 있다.

디폴트값은 좋아요 10이상, 현재는 좋아요만 가능하며

하단의 filter 버튼으로 활성화 할 수 있다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/4fa45fd4-4958-40d0-e592-779365c06900/public)

게시글의 feed는 useSWRInfinite의 페이지네이션 기능을 사용하여 구현하였으며 20개씩 렌더링 된다.

하트의 색상이 채워진것으로 자신이 좋아요를 눌렀는지에 대한 유무를 확인할 수 있다.

우측 하단의 버튼을 누르면 글을 작성할 수 있는 페이지로 routing 된다.
