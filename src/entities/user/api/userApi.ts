import { User } from "../model/types"
import { apiClient } from "../../../shared/lib/apiClient"

// 기존: 목록 가져오기
export const getUsers = async (): Promise<{ users: User[] }> => {
  return apiClient.get<{ users: User[] }>("/users", { limit: 0, select: "username,image" })
}

// 추가: 특정 유저 상세 정보 가져오기 (ID로 조회)
export const getUserDetail = async (userId: number): Promise<User> => {
  try {
    return await apiClient.get<User>(`/users/${userId}`)
  } catch (error) {
    throw new Error("사용자 정보를 불러오는데 실패했습니다.")
  }
}

