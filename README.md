# 2025 아카데미 美 디자인 공모전 · 넥소 전자칠판 관계자 전용 랜딩페이지

Nexo_RSSR 프로젝트 스택(Vite + React + Tailwind)을 참고하여 제작한 랜딩페이지입니다.

## 디자인 컨셉

- **톤앤매너:** Premium, Creative, Trust, Exclusive
- **컬러:** 다크 네이비(신뢰) + 골드(공모전 권위) + 넥소 블루 + CTA 오렌지

## 실행 방법

```bash
npm install
npm run dev    # 개발 서버 (기본 http://localhost:5173)
npm run build  # 프로덕션 빌드
npm run preview # 빌드 결과 미리보기
```

## 섹션 구성

1. **히어로** – 메인 카피, 서브 카피, CTA(관계자 전용 특별가 확인하기)
2. **공모전 후원 스토리** – 시상식·330만원 상당 부상 지원, 신뢰 구축
3. **왜 넥소 전자칠판인가** – 압도적 화질, 부드러운 판서, 스마트 협업
4. **관계자 한정 특별 구매 혜택** – 파격 할인, Pro 소프트웨어 증정, 무료 설치, **종료까지 남은 시간 카운트다운**
5. **관계자 전용 특별가** – 일시불(65/75/86인치), 장기 할부 월 납입금, 2월 무이자 할부 안내
6. **CTA · 푸터**

## 이미지 교체

- **Section 2 (공모전 후원 스토리):** 시상식에서 넥소 전자칠판이 전달되는 실제 사진을 사용하려면 `src/App.jsx`의 해당 섹션에 `<img src="/award-ceremony.jpg" alt="..." />` 형태로 넣고, `public/award-ceremony.jpg`에 이미지를 추가하면 됩니다.

## 가격 데이터

- 일시불·할부·2월 무이자 할부 수치는 기획안 및 제공 이미지 기준으로 반영되어 있습니다.

## Google Sheets 연동

견적/상담 폼 제출 시 아래 스프레드시트에 행이 추가됩니다.

- **스프레드시트:** [구글 시트 링크](https://docs.google.com/spreadsheets/d/1pMiZfYkhcyKYTc3Y1oQbvbg4nTxmAnD85HuXZbAPKE8/edit?gid=0#gid=0)

### Netlify 환경 변수 (Site settings → Environment variables)

| 변수명 | 설명 |
|--------|------|
| `GOOGLE_SHEET_ID` | 스프레드시트 ID (`1pMiZfYkhcyKYTc3Y1oQbvbg4nTxmAnD85HuXZbAPKE8`) |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google 서비스 계정 이메일 |
| `GOOGLE_PRIVATE_KEY` | 서비스 계정 비공개 키 (전체 PEM, `\n`은 그대로 두거나 `\\n`으로 입력) |

### 시트 첫 행(헤더) 권장

첫 번째 시트의 A1~J1에 아래 헤더를 두면 데이터가 순서대로 들어갑니다.

| A | B | C | D | E | F | G | H | I | J |
|---||---||---||---||---||---||---||---|---|
| 일시 | 성함 | 연락처 | 학원/기관 | 주소 | 주문요약 | 설치방법 | 엘리베이터 | 결제방식 | 출처 |

- 서비스 계정 생성: [Google Cloud Console](https://console.cloud.google.com/) → API 및 서비스 → 사용자 인증 정보 → 서비스 계정 생성 후 JSON 키 발급. 해당 스프레드시트를 **편집자**로 서비스 계정 이메일을 공유해야 합니다.
