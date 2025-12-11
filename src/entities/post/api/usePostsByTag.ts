import { useQuery } from "@tanstack/react-query"
import { Post, PostsResponse } from "../model/types"
import { getPostsByTag } from "./postApi"
import { getUsers } from "../../user/api/userApi"
import { usePostStore } from "../../../shared/model/store"

// 태그별 게시물 조회
export const usePostsByTag = (
  tag: string,
  skip: number,
  limit: number,
  sortBy?: string,
  sortOrder?: string,
) => {
  return useQuery<PostsResponse>({
    queryKey: ["posts", "tag", tag, skip, limit, sortBy, sortOrder],
    queryFn: async () => {
      if (!tag || tag === "all") {
        return { posts: [], total: 0 }
      }

      const [postsData, usersData] = await Promise.all([
        getPostsByTag(tag, limit, skip, sortBy, sortOrder),
        getUsers(),
      ])

      const postsWithUsers = postsData.posts.map((post: Post) => ({
        ...post,
        author: usersData.users.find((user: { id: number }) => user.id === post.userId),
      }))

      // 로컬 게시물 가져오기
      const localPosts = usePostStore.getState().localPosts

      // 로컬 게시물 중 해당 태그가 포함된 것 찾기
      const matchingLocalPosts = localPosts.filter((post) => post.tags?.includes(tag))

      // 서버 결과와 로컬 게시물 합치기 (중복 제거)
      const serverPostIds = new Set(postsWithUsers.map((p) => p.id))
      const uniqueLocalPosts = matchingLocalPosts.filter((p) => !serverPostIds.has(p.id))
      const combinedPosts = [...postsWithUsers, ...uniqueLocalPosts]

      return {
        posts: combinedPosts,
        total: postsData.total + uniqueLocalPosts.length,
      }
    },
    enabled: !!tag && tag !== "all", // tag가 있고 "all"이 아닐 때만 실행
    staleTime: 1000 * 60 * 5, // 5분
  })
}

