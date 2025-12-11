// 전역 설정 및 상수
// 앱 전체에서 사용되는 상수, 설정을 여기에 정의

// API base URL 설정
// 개발 환경: Vite proxy를 통해 /api 사용
// 프로덕션 환경: 직접 dummyjson.com API 사용
export const getApiBaseUrl = () => {
  // 환경 변수가 설정되어 있으면 사용, 없으면 개발 환경에서는 /api, 프로덕션에서는 직접 URL
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  
  // 프로덕션 빌드인 경우 직접 API URL 사용
  if (import.meta.env.PROD) {
    return "https://dummyjson.com"
  }
  
  // 개발 환경에서는 Vite proxy 사용
  return "/api"
}

