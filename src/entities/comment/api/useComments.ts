import { useQuery } from "@tanstack/react-query"
import { CommentType, CommentsResponse } from "../model/types"
import { getCommentsByPostId } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"

// 댓글 목록 조회
export const useComments = (postId: number) => {
  return useQuery<CommentsResponse>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const store = usePostStore.getState()
      // 로컬 댓글 가져오기
      const localComments = store.localComments[postId] || []
      
      // 로컬 게시물인지 확인 (로컬 게시물은 서버에 존재하지 않으므로 API 호출 건너뛰기)
      const isLocalPost = store.localPosts.some((post) => post.id === postId)

      if (isLocalPost) {
        // 로컬 게시물인 경우 로컬 댓글만 반환
        return {
          comments: localComments,
        }
      }

      // 서버 게시물인 경우 서버에서 댓글 가져오기
      try {
        const serverData = await getCommentsByPostId(postId)
        const deletedCommentIds = store.deletedCommentIds[postId] || new Set<number>()

        // 삭제된 댓글 필터링 및 likes 기본값 설정
        const filteredServerComments = serverData.comments
          .filter((c: CommentType) => !deletedCommentIds.has(c.id))
          .map((c: CommentType) => ({
            ...c,
            likes: c.likes ?? 0, // likes가 없으면 0으로 설정
          }))

        // 로컬 댓글과 병합 (중복 제거 및 삭제된 댓글 제외)
        const serverCommentIds = new Set(filteredServerComments.map((c: CommentType) => c.id))
        const uniqueLocalComments = localComments
          .filter((c: CommentType) => !serverCommentIds.has(c.id) && !deletedCommentIds.has(c.id))
          .map((c: CommentType) => ({
            ...c,
            likes: c.likes ?? 0, // likes가 없으면 0으로 설정
          }))
        const combinedComments = [...filteredServerComments, ...uniqueLocalComments]

        return {
          comments: combinedComments,
        }
      } catch (error) {
        // 서버 요청 실패 시 로컬 댓글만 반환 (삭제된 댓글 제외)
        const deletedCommentIds = store.deletedCommentIds[postId] || new Set<number>()
        const filteredLocalComments = localComments.filter((c: CommentType) => !deletedCommentIds.has(c.id))
        return {
          comments: filteredLocalComments,
        }
      }
    },
    enabled: !!postId, // postId가 있을 때만 실행
    staleTime: Infinity, // 이미 불러온 댓글이 있으면 다시 불러오지 않음 (원래 로직: if (comments[postId]) return)
  })
}

