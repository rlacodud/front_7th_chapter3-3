import { useQuery } from "@tanstack/react-query"
import { Post, PostsResponse } from "../model/types"
import { searchPosts } from "./postApi"
import { getUsers } from "../../user/api/userApi"
import { usePostStore } from "../../../shared/model/store"

// 게시물 검색
export const useSearchPosts = (
  query: string,
  skip: number,
  limit: number,
  sortBy?: string,
  sortOrder?: string,
) => {
  return useQuery<PostsResponse>({
    queryKey: ["posts", "search", query, skip, limit, sortBy, sortOrder],
    queryFn: async () => {
      if (!query) {
        return { posts: [], total: 0 }
      }

      const [postsData, usersData] = await Promise.all([
        searchPosts(query, limit, skip, sortBy, sortOrder),
        getUsers(),
      ])

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: { id: number }) => user.id === post.userId),
      }))

      // 로컬 게시물 가져오기
      const localPosts = usePostStore.getState().localPosts

      // 로컬 게시물 중 검색어와 일치하는 것 찾기
      const matchingLocalPosts = localPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase()),
      )

      // 서버 결과와 로컬 게시물 합치기 (중복 제거)
      const serverPostIds = new Set(postsWithUsers.map((p) => p.id))
      const uniqueLocalPosts = matchingLocalPosts.filter((p) => !serverPostIds.has(p.id))
      const combinedPosts = [...postsWithUsers, ...uniqueLocalPosts]

      return {
        posts: combinedPosts,
        total: postsData.total + uniqueLocalPosts.length,
      }
    },
    enabled: !!query, // query가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분
  })
}

