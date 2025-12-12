import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CommentType } from "../model/types"
import { addCommentApi } from "./commentApi"
import { usePostStore } from "../../../shared/model/store"
import { getUsers } from "../../user/api/userApi"

// 댓글 추가
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (comment: { body: string; postId: number; userId: number }) => {
      // 로컬 게시물인지 확인 (로컬 게시물에 댓글 추가 시 API 호출 없이 로컬 상태만 업데이트)
      const store = usePostStore.getState()
      const isLocalPost = store.localPosts.some((post) => post.id === comment.postId)

      if (isLocalPost) {
        // 로컬 게시물인 경우 API 호출 없이 로컬 댓글 생성
        const usersData = await getUsers()
        const user = usersData.users.find((u) => u.id === comment.userId) || {
          id: comment.userId,
          username: `User ${comment.userId}`,
        }

        const newComment: CommentType & { postId: number } = {
          id: Date.now(), // 임시 ID
          body: comment.body,
          user,
          likes: 0,
          postId: comment.postId,
        }

        // 로컬 댓글에 추가
        store.addLocalComment(comment.postId, newComment)

        return newComment
      }

      return await addCommentApi(comment)
    },
    onMutate: async (newComment) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ["comments", newComment.postId] })

      // 이전 값 저장 (롤백용)
      const previousComments = queryClient.getQueryData<{ comments: CommentType[] }>(["comments", newComment.postId])

      // 낙관적 업데이트
      queryClient.setQueryData<{ comments: CommentType[] }>(["comments", newComment.postId], (old) => {
        if (!old) return { comments: [] }
        const tempComment: CommentType = {
          id: Date.now(), // 임시 ID
          body: newComment.body,
          user: { id: newComment.userId, username: "로딩 중..." },
          likes: 0,
        }
        return {
          comments: [...old.comments, tempComment],
        }
      })

      return { previousComments }
    },
    onError: (_err, newComment, context) => {
      // 에러 발생 시 이전 값으로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", newComment.postId], context.previousComments)
      }
    },
    onSuccess: (data) => {
      // 로컬 게시물에 댓글을 추가한 경우는 이미 mutationFn에서 처리했으므로 중복 추가 방지
      const store = usePostStore.getState()
      const isLocalPost = store.localPosts.some((post) => post.id === data.postId)

      if (!isLocalPost) {
        // 서버 게시물에 댓글을 추가한 경우만 로컬 데이터에 추가
        const postId = data.postId
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { postId: _, ...commentWithoutPostId } = data
        // likes가 없거나 undefined인 경우 0으로 설정
        const commentWithLikes: CommentType = {
          ...commentWithoutPostId,
          likes: commentWithoutPostId.likes ?? 0,
        }
        store.addLocalComment(postId, commentWithLikes)
      }

      // 쿼리 무효화하여 리프레시
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId], refetchType: "all" })
    },
  })
}
