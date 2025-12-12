import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PostWithAuthor } from "../model/types"
import { addPostApi } from "./postApi"
import { getUsers } from "../../user/api/userApi"
import { usePostStore } from "../../../shared/model/store"

// 게시물 추가
export const useAddPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (post: { title: string; body: string; userId: number }) => {
      const newPostData = await addPostApi(post)
      const usersData = await getUsers()
      const author = usersData.users.find((user: { id: number }) => user.id === newPostData.userId)

      const newPostWithAuthor: PostWithAuthor = {
        ...newPostData,
        author,
      }

      return newPostWithAuthor
    },
    onMutate: async (_newPost) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["posts"] })

      // 이전 값 저장 (롤백용)
      const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] })

      return { previousPosts }
    },
    onError: (_err, _newPost, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSuccess: (data) => {
      const store = usePostStore.getState()
      // 가짜 API 대응: 로컬 데이터에 추가
      store.addLocalPost(data)

      // 추가한 게시물을 보기 위해 마지막 페이지로 이동
      // 쿼리 데이터에서 서버 total을 가져와서 계산
      const postsQueries = queryClient.getQueriesData<{ posts: PostWithAuthor[]; total: number }>({
        queryKey: ["posts"],
      })
      const latestQuery = postsQueries[postsQueries.length - 1]
      const serverTotal = latestQuery?.[1]?.total || 0
      const localPostsCount = store.localPosts.length + 1 // 새로 추가된 게시물 포함
      const total = serverTotal + localPostsCount
      const limit = store.limit
      const lastPageSkip = Math.max(0, Math.floor((total - 1) / limit) * limit)
      store.setSkip(lastPageSkip)

      // 관련 쿼리 무효화하여 리프레시
      queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "all" })
      queryClient.invalidateQueries({ queryKey: ["tags"], refetchType: "all" })
    },
  })
}

