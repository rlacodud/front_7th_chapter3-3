import { useQuery } from "@tanstack/react-query"
import { TagsResponse } from "../model/types"
import { getTags } from "./postApi"

// 태그 목록 조회
export const useTags = () => {
  return useQuery<TagsResponse[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      return await getTags()
    },
    staleTime: 1000 * 60 * 10, // 10분 (태그는 자주 변경되지 않음)
  })
}

