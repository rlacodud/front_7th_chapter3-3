import { useQuery } from "@tanstack/react-query"
import { User } from "../model/types"
import { getUserDetail } from "./userApi"

// 사용자 상세 조회
export const useUser = (userId: number) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      return await getUserDetail(userId)
    },
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분
  })
}

