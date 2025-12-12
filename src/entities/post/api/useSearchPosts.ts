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
      const store = usePostStore.getState()
      const localPosts = store.localPosts
      const deletedPostIds = store.deletedPostIds

      // 삭제된 게시물 필터링
      const filteredServerPosts = postsWithUsers.filter((p) => !deletedPostIds.has(p.id))

      // 로컬 게시물 중 검색어와 일치하는 것 찾기 (삭제된 것 제외)
      const matchingLocalPosts = localPosts.filter(
        (post) =>
          !deletedPostIds.has(post.id) &&
          (post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())),
      )

      // 서버 결과와 로컬 게시물 합치기 (중복 제거)
      const serverPostIds = new Set(filteredServerPosts.map((p) => p.id))
      const uniqueLocalPosts = matchingLocalPosts.filter((p) => !serverPostIds.has(p.id))

      // 로컬 게시물은 전체 목록의 맨 마지막에만 표시
      // 현재 페이지가 마지막 페이지인지 확인 (서버 게시물의 마지막 페이지)
      const serverTotal = postsData.total
      const isLastPage = skip + limit >= serverTotal

      // 마지막 페이지인 경우에만 로컬 게시물 추가
      const combinedPosts = isLastPage
        ? [...filteredServerPosts, ...uniqueLocalPosts]
        : filteredServerPosts

      return {
        posts: combinedPosts,
        total: serverTotal + uniqueLocalPosts.length,
      }
    },
    enabled: !!query, // query가 있을 때만 실행
    staleTime: 1000 * 60 * 5, // 5분
  })
}

