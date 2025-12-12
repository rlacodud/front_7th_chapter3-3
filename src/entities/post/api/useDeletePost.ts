import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PostWithAuthor } from "../model/types"
import { usePostStore } from "../../../shared/model/store"
import { apiClient } from "../../../shared/lib/apiClient"

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await apiClient.delete(`/posts/${id}`)
        return { id }
      } catch {
        throw new Error("게시물 삭제에 실패했습니다.")
      }
    },
    onMutate: async (id) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      // 이전 값 저장 (롤백용)
      const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] })

      // 낙관적 업데이트
      queryClient.setQueriesData<{ posts: PostWithAuthor[]; total: number }>({ queryKey: ["posts"] }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.filter((post) => post.id !== id),
          total: Math.max(0, old.total - 1),
        }
      })

      return { previousPosts }
    },
    onError: (_err, _id, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSuccess: (_data, id) => {
      const store = usePostStore.getState()
      // 가짜 API 대응: 로컬 데이터에서 삭제
      store.deleteLocalPost(id)
      // 삭제된 게시물 ID 추적
      store.addDeletedPostId(id)

      // 관련 쿼리 무효화하여 리프레시
      queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "all" })
    },
  })
}
