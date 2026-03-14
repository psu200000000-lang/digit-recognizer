# ✏️ 손글씨 숫자 인식기

> Claude Vision AI를 사용한 손글씨 숫자 인식 앱

![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4-D97757?style=flat&logo=anthropic&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-28.0-47848F?style=flat&logo=electron&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## 🌐 웹에서 바로 실행

**[👉 https://psu200000000-lang.github.io/digit-recognizer](https://psu200000000-lang.github.io/digit-recognizer)**

> Anthropic API 키가 필요합니다. [console.anthropic.com](https://console.anthropic.com) 에서 발급받으세요.

---

## 📸 기능

| 탭 | 기능 |
|---|---|
| 🔍 인식 | 손글씨로 숫자 한 개를 그려 AI 인식 + 확률 바 표시 |
| 🔢 연속 인식 | 여러 숫자를 연속으로 그려 긴 숫자열 완성 |
| 🎯 테스트 모드 | AI가 제시한 숫자를 그려 인식 정확도 측정 (10문제) |
| 📋 기록 | 모든 인식 기록 로컬 저장 및 통계 (데스크탑 전용) |

---

## 🖥 데스크탑 앱 실행 방법

\```bash
git clone https://github.com/psu200000000-lang/digit-recognizer.git
cd digit-recognizer
npm install
npm start
\```

---

## 🔧 기술 스택

- **Electron** — 데스크탑 앱 프레임워크
- **Claude Sonnet 4 Vision API** — 손글씨 이미지 인식
- **HTML / CSS / JS** — UI

---

## 📄 License

MIT
