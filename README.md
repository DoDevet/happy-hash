# Happy Hash
해시태그 커뮤니티

## 소개

해시태그를 그룹화 하여 참여할 수 있는 커뮤니티 사이트.  
Guide 페이지는 SSG를 통해 구현.  

배포 : https://happy-hash-wine.vercel.app/  
포트폴리오 : https://jihuns-blog.vercel.app/posts/happy-hash-post

**Next.js Page Router + Typescript**

DB

- **Planet scale**
  MySQL **Compatible** serverless database platform

  - Vitess는 MySQL을 스케일링하기 위한 데이터베이스 클러스터링 시스템
  - Vitess를 기반으로 하는 관계형 데이터 베이스가 PlanetScale이다.

    **db에 브랜치를 제공**하며, 마치 **git과 같은 cli**를 제공해준다.

- **Prisma ORM**

  DB ORM으로 데이터베이스 테이블을 객체로 취급하여 데이터베이스 작업을 추상화한다.  
  SQL 쿼리를 작성하지 않고도 데이터베이스 작업을 수행할 수 있으며  
  **타입 안정성**과 **Prisma Client가 제공하는 자동 완성과 IntelliSense** 등의 이점을 취할 수 있다.

파일 업로드 스토리지

- Cloudflare Image

스타일

- tailwind css, sass(gray matter style 용)

hook

- useSWR
- react-hook-form
- useMutation (커스텀 훅)

전역관리

- Recoil

라이브러리

- heroicons
- gray matter
- next-themes
- Framer
- **iron-session**
  - https://github.com/vvo/iron-session
  - 서명, 암호화된 쿠키를 사용하는 nodejs stateless 세션 도구
  - JWT는 암호화되지 않고 서명이 되어있음
  - 유저가 안에 있는 정보를 볼 수 없음
  - 세션을 위한 백엔드 구축이 필요 없음

파일 구조

- ```bash
   📦libs
   ┣ 📂client >> 클라이언트 훅
   ┗ 📂server >> 서버 훅
   📦components >> 컴포넌트
   📦pages
   ┣ 📂api
   ┃ ┣ 📂community
   ┃ ┃ ┣ 📂posts
   ┃ ┃ ┃ ┣ 📂[id]
   ┃ ┃ ┃ ┃ ┣ 📂comments
   ┃ ┃ ┃ ┃ ┃ ┗ 📜index.ts
   ┃ ┃ ┃ ┃ ┣ 📜fav.ts
   ┃ ┃ ┃ ┃ ┗ 📜index.ts
   ┃ ┃ ┃ ┗ 📜index.ts
   ┃ ┃ ┗ 📜index.ts
   ┃ ┣ 📂hashs
   ┃ ┃ ┗ 📜index.ts
   ┃ ┣ 📂search
   ┃ ┃ ┗ 📜index.ts
   ┃ ┣ 📂user
   ┃ ┃ ┣ 📂me
   ┃ ┃ ┃ ┣ 📜[type].ts
   ┃ ┃ ┃ ┗ 📜index.ts
   ┃ ┃ ┣ 📜confirm.ts
   ┃ ┃ ┣ 📜login.ts
   ┃ ┃ ┗ 📜logout.ts
   ┃ ┣ 📜files.ts
   ┃ ┗ 📜ranking.ts
   ┃ ┃
   ┣ 📂community
   ┃ ┗ 📂posts
   ┃ ┃ ┣ 📂[postId]
   ┃ ┃ ┃ ┣ 📜edit.tsx
   ┃ ┃ ┃ ┗ 📜index.tsx
   ┃ ┃ ┣ 📜index.tsx
   ┃ ┃ ┗ 📜write.tsx
   ┣ 📂guide
   ┃ ┣ 📜[slug].tsx
   ┃ ┗ 📜index.tsx
   ┣ 📂profile
   ┃ ┣ 📂[type]
   ┃ ┃ ┗ 📜index.tsx
   ┃ ┣ 📜edit.tsx
   ┃ ┗ 📜index.tsx
   ┣ 📂search
   ┃ ┗ 📜index.tsx
   ┣ 📜_app.tsx
   ┣ 📜_document.tsx
   ┣ 📜index.tsx
   ┣ 📜login.tsx
   ┗ 📜test.tsx

  📦posts-guide >> Guide 페이지 md 파일
  ```
## More Info
https://jihuns-blog.vercel.app/posts/happy-hash-post
