import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentType } from "../model/types"
import { deleteCommentApi } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, postId: _postId }: { id: number; postId: number }) => {
      return await deleteCommentApi(id)
    },
    onMutate: async ({ id, postId }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["comments", postId] })

      // 이전 값 저장 (롤백용)
      const previousComments = queryClient.getQueryData<{ comments: CommentType[] }>([
        "comments",
        postId,
      ])

      // 낙관적 업데이트
      // 원래 로직: setComments((prev) => ({ ...prev, [postId]: prev[postId].filter((comment) => comment.id !== id) }))
      queryClient.setQueryData<{ comments: CommentType[] }>(["comments", postId], (old) => {
        if (!old) return old
        return {
          comments: old.comments.filter((comment) => comment.id !== id),
        }
      })

      return { previousComments }
    },
    onError: (_err, { postId }, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", postId], context.previousComments)
      }
    },
    onSuccess: (_data, { id, postId }) => {
      // 가짜 API 대응: 로컬 데이터에서 삭제
      // 원래 로직: setComments((prev) => ({ ...prev, [postId]: prev[postId].filter((comment) => comment.id !== id) }))
      usePostStore.getState().deleteLocalComment(postId, id)

      // 관련 쿼리 무효화하여 리프레시
      queryClient.invalidateQueries({ queryKey: ["comments", postId], refetchType: "all" })
    },
  })
}

