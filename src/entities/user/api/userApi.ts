import { User } from "../model/types"
import { BASE_URL } from "../../../shared/config"

// 기존: 목록 가져오기
export const getUsers = async (): Promise<{ users: User[] }> => {
  const response = await fetch(`${BASE_URL}/users?limit=0&select=username,image`)
  return response.json()
}

// 추가: 특정 유저 상세 정보 가져오기 (ID로 조회)
export const getUserDetail = async (userId: number): Promise<User> => {
  const response = await fetch(`${BASE_URL}/users/${userId}`)
  if (!response.ok) {
    throw new Error("사용자 정보를 불러오는데 실패했습니다.")
  }
  return response.json()
}

