import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentType } from "../model/types"
import { toggleLikeCommentApi } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"

// 댓글 좋아요/취소 (토글)
export const useLikeComment = () => {
  const queryClient = useQueryClient()
  const processingIds = new Set<number>() // 처리 중인 댓글 ID 추적

  return useMutation({
    mutationFn: async ({
      id,
      postId,
      currentLikes,
      isLiked,
    }: {
      id: number
      postId: number
      currentLikes: number
      isLiked: boolean
    }) => {
      // 로컬 댓글인지 확인 (로컬 댓글은 API 호출 없이 로컬 상태만 업데이트)
      const store = usePostStore.getState()
      const localComments = store.localComments[postId] || []
      const isLocalComment = localComments.some((comment) => comment.id === id)

      if (isLocalComment) {
        // 로컬 댓글인 경우 API 호출 없이 성공으로 처리
        const safeCurrentLikes = currentLikes ?? 0
        const numericLikes = Number.isNaN(safeCurrentLikes) ? 0 : safeCurrentLikes
        const newLikes = isLiked ? Math.max(0, numericLikes - 1) : numericLikes + 1
        return {
          id,
          body: localComments.find((c) => c.id === id)?.body || "",
          user: localComments.find((c) => c.id === id)?.user || { id: 0, username: "" },
          likes: newLikes,
        } as CommentType
      }

      // 이미 처리 중인 댓글이면 중복 요청 방지
      if (processingIds.has(id)) {
        throw new Error("이미 처리 중입니다.")
      }
      processingIds.add(id)
      try {
        const result = await toggleLikeCommentApi(id, currentLikes, isLiked)
        return result
      } finally {
        // 처리 완료 후 제거
        setTimeout(() => processingIds.delete(id), 500)
      }
    },
    onMutate: async ({ id, postId, currentLikes, isLiked }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["comments", postId] })

      // 이전 값 저장 (롤백용)
      const previousComments = queryClient.getQueryData<{ comments: CommentType[] }>(["comments", postId])

      // currentLikes가 undefined이거나 NaN인 경우 0으로 처리
      const safeCurrentLikes = currentLikes ?? 0
      const numericLikes = Number.isNaN(safeCurrentLikes) ? 0 : safeCurrentLikes

      // 낙관적 업데이트: 좋아요 취소면 -1, 좋아요면 +1
      const newLikes = isLiked ? Math.max(0, numericLikes - 1) : numericLikes + 1
      queryClient.setQueryData<{ comments: CommentType[] }>(["comments", postId], (old) => {
        if (!old) return old
        return {
          comments: old.comments.map((comment) => {
            if (comment.id === id) {
              // likes가 없거나 undefined인 경우 0으로 시작
              const commentLikes = comment.likes ?? 0
              const safeCommentLikes = Number.isNaN(commentLikes) ? 0 : commentLikes
              const calculatedLikes = isLiked ? Math.max(0, safeCommentLikes - 1) : safeCommentLikes + 1
              return { ...comment, likes: calculatedLikes }
            }
            return comment
          }),
        }
      })

      // 가짜 API 대응: 로컬 데이터도 낙관적 업데이트
      usePostStore.getState().likeLocalComment(postId, id, newLikes)

      return { previousComments }
    },
    onError: (_err, { postId }, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", postId], context.previousComments)
      }
    },
  })
}
