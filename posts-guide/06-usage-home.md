---
title: 구현 - 5 Home Layout & Responsive Web
date: 2022.02.02
---

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/99f97ad6-d18b-4b3c-afb9-ef27e8ea6c00/public)

우측 상단의 왼쪽 아이콘을 클릭해 DarkMode 활성화 가능.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/59771be5-ac05-4cda-029b-a51c9a112000/public)

랭킹기능은 1위부터 10위까지 나타내며 정렬 기준은 2시간 이내에 해시태그에 생성된 글의 갯수가 1순위,

총 생성한 글의 갯수가 2순위다.

랭킹 컴포넌트를 닫은 상태에선 6초마다 리스트가 변경된다.

자신의 아바타를 클릭하면 Modal 메뉴가 나오고, 프로필 페이지로 이동 및 로그아웃을 할 수 있다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/eb63517f-91a5-4edf-7deb-faa53a7b6b00/public)

좌측 메뉴바를 누르면 나오는 메뉴이다.

아바타를 클릭했을때 나오는 메뉴인 Profile, Login이 중복되지만, 빼면 허전해서 유지하기로 했다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/58430795-19bc-4e66-2a08-bb5930387c00/public)

페이지를 전체화면으로 했을때는 좌측 메뉴아이콘이 사라지고 새로운 Navigator가 나온다.

또, 등록한 Hash들의 grid template 값이 변경된다.
