// 전역 설정 및 상수
// 앱 전체에서 사용되는 상수, 설정을 여기에 정의

// ✅ 환경 변수에 따라 Base URL 설정
// 빌드 시 Vite가 import.meta.env를 정적으로 치환합니다
export const API_URL = import.meta.env.MODE === "production" ? "https://dummyjson.com" : "/api"
