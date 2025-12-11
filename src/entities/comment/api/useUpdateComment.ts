import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentType } from "../model/types"
import { updateCommentApi } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (comment: Pick<CommentType, "id" | "body"> & { postId: number }) => {
      return await updateCommentApi({ id: comment.id, body: comment.body })
    },
    onMutate: async (updatedComment) => {
      const queryKey = ["comments", updatedComment.postId]
      
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey })

      // 이전 값 저장 (롤백용)
      const previousData = queryClient.getQueryData<{ comments: CommentType[] }>(queryKey)

      // 낙관적 업데이트
      queryClient.setQueryData<{ comments: CommentType[] }>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          comments: old.comments.map((comment) =>
            comment.id === updatedComment.id ? { ...comment, body: updatedComment.body } : comment,
          ),
        }
      })

      return { previousData, queryKey }
    },
    onError: (_err, _comment, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData)
      }
    },
    onSuccess: (data, variables) => {
      // 가짜 API 대응: 로컬 데이터 업데이트만 수행
      // 참고 코드처럼 onSuccess에서는 추가 쿼리 업데이트 없이 낙관적 업데이트 상태 유지
      const postId = (data as CommentType & { postId: number }).postId || variables.postId
      const { postId: _, ...commentWithoutPostId } = data as CommentType & { postId?: number }
      usePostStore.getState().updateLocalComment(postId, commentWithoutPostId as CommentType)
    },
  })
}

