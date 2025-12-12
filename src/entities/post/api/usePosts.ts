import { useQuery } from "@tanstack/react-query"
import { Post, PostsResponse } from "../model/types"
import { getPosts } from "./postApi"
import { getUsers } from "../../user/api/userApi"
import { usePostStore } from "../../../shared/model/store"

// 게시물 목록 조회
export const usePosts = (skip: number, limit: number, sortBy?: string, sortOrder?: string) => {
  return useQuery<PostsResponse>({
    queryKey: ["posts", skip, limit, sortBy, sortOrder],
    queryFn: async () => {
      const [postsData, usersData] = await Promise.all([getPosts(limit, skip, sortBy, sortOrder), getUsers()])

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: { id: number }) => user.id === post.userId),
      }))

      // 로컬 게시물 가져오기
      const store = usePostStore.getState()
      const localPosts = store.localPosts
      const deletedPostIds = store.deletedPostIds

      // 삭제된 게시물 필터링
      const filteredServerPosts = postsWithUsers.filter((p) => !deletedPostIds.has(p.id))

      // 로컬 게시물과 병합 (중복 제거)
      const serverPostIds = new Set(filteredServerPosts.map((p) => p.id))
      const uniqueLocalPosts = localPosts.filter((p) => !serverPostIds.has(p.id) && !deletedPostIds.has(p.id))
      const combinedPosts = [...filteredServerPosts, ...uniqueLocalPosts]

      return {
        posts: combinedPosts,
        total: postsData.total + uniqueLocalPosts.length,
      }
    },
    staleTime: 1000 * 60 * 5, // 5분
  })
}

