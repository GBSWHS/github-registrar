# Github-Registrar
경소고 깃허브 자동 초대기

## 원리
1. Github OAuth를 돌려 유저명을 알아낸다.
2. IP를 확인해 학교 IP가 아니면 쫓아낸다.
3. Github API를 돌려 해당 유저를 경소고 깃헙 org에 초대한다.
4. 초대 수락 페이지로 리다이렉트 시켜준다.
5. Profit!

## 스택
* Cloudflare Pages
* Cloudflare Pages Functions
* Github REST API
* Github OAuth2
