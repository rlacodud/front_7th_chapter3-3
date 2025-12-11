import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentType } from "../model/types"
import { addCommentApi } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"

// 댓글 추가
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (comment: { body: string; postId: number; userId: number }) => {
      return await addCommentApi(comment)
    },
    onMutate: async (newComment) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["comments", newComment.postId] })

      // 이전 값 저장 (롤백용)
      const previousComments = queryClient.getQueryData<{ comments: CommentType[] }>([
        "comments",
        newComment.postId,
      ])

      // 낙관적 업데이트
      queryClient.setQueryData<{ comments: CommentType[] }>(
        ["comments", newComment.postId],
        (old) => {
          if (!old) return { comments: [] }
          const tempComment: CommentType = {
            id: Date.now(), // 임시 ID
            body: newComment.body,
            user: { id: newComment.userId, username: "로딩 중..." },
            likes: 0,
          }
          return {
            comments: [...old.comments, tempComment],
          }
        },
      )

      return { previousComments }
    },
    onError: (_err, newComment, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", newComment.postId], context.previousComments)
      }
    },
    onSuccess: (data) => {
      // 가짜 API 대응: 로컬 데이터에 추가
      // API 응답의 data.postId 사용 (원래 로직과 동일)
      const postId = (data as CommentType & { postId: number }).postId
      const { postId: _, ...commentWithoutPostId } = data as CommentType & { postId: number }
      usePostStore.getState().addLocalComment(postId, commentWithoutPostId as CommentType)

      // 원래 로직: setComments((prev) => ({ ...prev, [data.postId]: [...(prev[data.postId] || []), data] }))
      // TanStack Query에서는 낙관적 업데이트로 이미 처리되었으므로 쿼리 무효화만 수행
      queryClient.invalidateQueries({ queryKey: ["comments", postId], refetchType: "all" })
    },
  })
}

