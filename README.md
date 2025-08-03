# org-actions-template  
노션 - 깃허브 연동 자동화 레포지토리

## 기능 안내
### 0. 페이지 감지 기능
- 최근 100개 문서를 대상으로 자동 검색
- 브랜치명 기반으로 해당 페이지 자동 감지  
  예) `TEAM-132-add-search` → `TEAM-132`를 감지

### 1. 속성 변경 기능
- PR이 열리면(`open`) 상태를 **진행 중**으로 변경
- PR이 머지되면(`merge`) 상태를 **완료**로 변경

### 2. 링크 연동 기능
- `GitHub Pull Requests` 속성에 PR 링크 자동 추가

## 설정 안내

### 1.  대상 레포지토리 설정
- 본 기능을 사용할 레포지토리에서 아래의 설정코드를 추가합니다.

```
# .github/workflows/call-notion-sync.yml (사용하는 쪽 레포)
name: Call Notion Sync

on:
  pull_request:
    types: [opened, reopened, synchronize, closed]

jobs:
  call-notion-sync:
    uses: Beyond-Imagination/github-actions/.github/workflows/sync-pr-to-notion.yml@main
    secrets:
      NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
      NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}
```

---

### 2. GitHub Secret 설정  
- 레포지토리 시크릿 키에 `NOTION_DATABASE_ID` 추가
- NOTION DATABASE ID 추출 방법 : `https://www.notion.so/example/example-227402b843138042a10ec85b1ec04aaf`
→ 이 중 227402b843138042a10ec85b1ec04aaf 가 데이터베이스 아이디입니다.


### 에러 시 확인할 부분
- **기본키 속성**  
  - 속성 이름: `ID` (식별용 기본키로 반드시 `ID`여야 합니다)  
  ![기본키](assets/id.png)  

- **GitHub 링크 연결용 속성**  
  - 속성 타입: `url`  
  - 속성 이름: `GitHub Pull Requests`  
  ![GitHub Pull Requests 속성 예시](assets/github_pr.png)  

- 생성일시가 `생성 일시` 인지 확인
- `상태` 속성이 맞는지 확인, `진행 중` 속성, `완료` 속성이 있는지 확인
- 그 외 본 레포지토리의 scripts/sync-notion.ts 코드를 확인해 코드와 다르게 설정한 부분이 있는지 확인