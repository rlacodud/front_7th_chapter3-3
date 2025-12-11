import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentType } from "../model/types"
import { likeCommentApi } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"

// 댓글 좋아요
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, currentLikes }: { id: number; postId: number; currentLikes: number }) => {
      return await likeCommentApi(id, currentLikes)
    },
    onMutate: async ({ id, postId, currentLikes }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["comments", postId] })

      // 이전 값 저장 (롤백용)
      const previousComments = queryClient.getQueryData<{ comments: CommentType[] }>(["comments", postId])

      // 낙관적 업데이트
      queryClient.setQueryData<{ comments: CommentType[] }>(["comments", postId], (old) => {
        if (!old) return old
        return {
          comments: old.comments.map((comment) =>
            comment.id === id ? { ...comment, likes: currentLikes + 1 } : comment,
          ),
        }
      })

      // 가짜 API 대응: 로컬 데이터도 낙관적 업데이트 (onMutate에서 한 번만 업데이트)
      usePostStore.getState().likeLocalComment(postId, id, currentLikes + 1)

      return { previousComments }
    },
    onError: (_err, { postId }, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", postId], context.previousComments)
      }
    },
    // 참고 코드처럼 onSuccess 제거 - 낙관적 업데이트 상태를 그대로 유지
    // 가짜 API이므로 서버 리프레시 없이 낙관적 업데이트 상태 유지
  })
}
