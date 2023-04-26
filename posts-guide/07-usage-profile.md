---
title: 구현 - 6 Search & Profile
date: 2022.02.02
---

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/99f1aaa8-6a64-47df-42ae-ba80200e0c00/public)

헤더창에 있는 Input에 키워드를 입력하면 startswith 조건으로 일치하는 해시태그나 Post들을 검색한다.

Pagenation은 적용하지 않았다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/16b9255e-a30d-430f-11a7-384c2e3fcb00/public)

프로파일 페이지에선 자신이 좋아요를 누른 게시글, 자신이 작성한 글, 댓글들을 볼 수 있다. (미완성, 댓글은 미구현)

Edit Profile을 누르게 되면 유저정보를 수정 할 수 있는 페이지가 나온다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/212f336d-b27c-4aeb-73c0-738fc1472e00/public)

Edit Profile에선 email, phone, username, avatar 정보를 변경할 수 있다.

email, phone 둘 중 하나는 입력되어야 하며, Edit post 처럼 이미지 파일이 변경되지 않았다면 텍스트만 빠르게 변경하도록 구현했다.
