import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentType } from "../model/types"
import { deleteCommentApi } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      // 로컬 댓글인지 확인 (로컬 댓글은 API 호출 없이 로컬 상태만 업데이트)
      const store = usePostStore.getState()
      const localComments = store.localComments[postId] || []
      const isLocalComment = localComments.some((comment) => comment.id === id)

      if (isLocalComment) {
        // 로컬 댓글인 경우 API 호출 없이 성공으로 처리
        return { id }
      }

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
      const store = usePostStore.getState()
      // 가짜 API 대응: 로컬 데이터에서 삭제
      store.deleteLocalComment(postId, id)
      // 삭제된 댓글 ID 추적
      store.addDeletedCommentId(postId, id)

      // 관련 쿼리 무효화하여 리프레시
      queryClient.invalidateQueries({ queryKey: ["comments", postId], refetchType: "all" })
    },
  })
}

