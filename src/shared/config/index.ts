// 전역 설정 및 상수
// 앱 전체에서 사용되는 상수, 설정을 여기에 정의

// ✅ 환경 변수에 따라 Base URL 설정
const isDev = import.meta.env.DEV

export const BASE_URL = isDev ? "/api" : "https://dummyjson.com"

