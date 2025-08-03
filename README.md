# org-actions-template
노션 - 깃허브 연동을 위한 자동화 레포지토리

## 설정
notion 설정
- 식별할 수 있는 기본키 이름이 ID여야 합니다.
    ![기본키](assets/id.png)

github secret 설정
- 노션 데이터베이스 아이디를 레포지토리 시크릿 키로 저장해야 합니다. 데이터베이스 아이디는 노션 링크의 숫자 부분입니다.
```
https://www.notion.so/example/example-227402b843138042a10ec85b1ec04aaf 에서 227402b843138042a10ec85b1ec04aaf 부분
```