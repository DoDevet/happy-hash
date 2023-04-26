---
title: 구현 - 1 커뮤니티 생성
date: 2022.02.02
---

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/381805d3-1086-4ef8-3aa2-1e15010f9800/public)

홈에있는 +버튼을 눌러 바로가기 기능을 추가하거나

랭킹에 있는 해시태그를 클릭함으로써 커뮤니티에 입장할 수 있다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/153de183-0684-4a33-d7d2-62d2ad890500/public)

입력받은 해시가 존재한다면 connect,

없다면 create 이후 connect를 한다.

해시태그는 총 5개까지 입력 할 수 있으며 ',' 로 구분한다.

중복을 피하기 위해 영문자는 소문자만 받도록하였고

특수기호는 ','외엔 필터링 된다.

제목은 생략이 가능하며, 생략시 입력받은 해시태그들의 이름들이 제목이 된다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/4b807fee-0b6c-41e5-152b-3c849ccdd100/public)

생성한 해시태그는 우측 상단의 아이콘을 눌러 편집하거나 삭제할 수 있다.

Enter가 아닌 해시태그를 클릭하면 단일 해시태그 페이지로 이동하게 된다.

![Example image](https://imagedelivery.net/x2vrVGmUfxi_qt-pjNxZ6g/d4f4a690-ef4a-42ba-0336-7be19367a600/public)
