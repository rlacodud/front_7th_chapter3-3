import { useQuery } from "@tanstack/react-query"
import { CommentType, CommentsResponse } from "../model/types"
import { getCommentsByPostId } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"

// 댓글 목록 조회
export const useComments = (postId: number) => {
  return useQuery<CommentsResponse>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      // 로컬 댓글 가져오기 (이미 불러온 댓글이 있으면 서버 요청 생략 가능)
      const localComments = usePostStore.getState().localComments[postId] || []

      // 서버에서 댓글 가져오기
      const serverData = await getCommentsByPostId(postId)

      // 로컬 댓글과 병합 (중복 제거)
      const serverCommentIds = new Set(serverData.comments.map((c: CommentType) => c.id))
      const uniqueLocalComments = localComments.filter((c: CommentType) => !serverCommentIds.has(c.id))
      const combinedComments = [...serverData.comments, ...uniqueLocalComments]

      return {
        comments: combinedComments,
      }
    },
    enabled: !!postId, // postId가 있을 때만 실행
    staleTime: Infinity, // 이미 불러온 댓글이 있으면 다시 불러오지 않음 (원래 로직: if (comments[postId]) return)
  })
}

