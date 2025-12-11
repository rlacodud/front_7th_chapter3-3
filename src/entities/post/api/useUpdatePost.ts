import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Post, PostWithAuthor } from "../model/types"
import { updatePostApi } from "./postApi"
import { getUsers } from "../../user/api/userApi"
import { usePostStore } from "../../../shared/model/store"

// 게시물 수정
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: Post) => {
      const updatedPostData = await updatePostApi(post)
      const usersData = await getUsers()
      const author = usersData.users.find((user: { id: number }) => user.id === updatedPostData.userId)

      const updatedPostWithAuthor: PostWithAuthor = {
        ...updatedPostData,
        author,
      }

      return updatedPostWithAuthor
    },
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      // 이전 값 저장 (롤백용)
      const previousQueries = queryClient.getQueriesData<{ posts: PostWithAuthor[]; total: number }>({ queryKey: ["posts"] })

      // 낙관적 업데이트
      queryClient.setQueriesData<{ posts: PostWithAuthor[]; total: number }>({ queryKey: ["posts"] }, (old) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map((post) =>
            post.id === updatedPost.id ? { ...post, ...updatedPost } : post,
          ),
        }
      })

      return { previousQueries }
    },
    onError: (_err, _post, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSuccess: (data) => {
      // 가짜 API 대응: 로컬 데이터 업데이트만 수행
      // 참고 코드처럼 onSuccess에서는 추가 쿼리 업데이트 없이 낙관적 업데이트 상태 유지
      usePostStore.getState().updateLocalPost(data)
    },
  })
}

