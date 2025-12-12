import { CommentType, CommentsResponse } from "../model/types"
import { apiClient } from "../../../shared/lib/apiClient"

// 1. 댓글 가져오기
export const getCommentsByPostId = async (postId: number): Promise<CommentsResponse> => {
  try {
    return await apiClient.get<CommentsResponse>(`/comments/post/${postId}`)
  } catch {
    throw new Error("댓글을 불러오는데 실패했습니다.")
  }
}

// 2. 댓글 추가
export const addCommentApi = async (newComment: {
  body: string
  postId: number
  userId: number
}): Promise<CommentType & { postId: number }> => {
  try {
    return await apiClient.post<CommentType & { postId: number }>("/comments/add", newComment)
  } catch {
    throw new Error("댓글 추가에 실패했습니다.")
  }
}

// 3. 댓글 수정
export const updateCommentApi = async (
  comment: Pick<CommentType, "id" | "body">,
): Promise<CommentType & { postId?: number }> => {
  try {
    return await apiClient.put<CommentType & { postId?: number }>(`/comments/${comment.id}`, { body: comment.body })
  } catch {
    throw new Error("댓글 수정에 실패했습니다.")
  }
}

// 4. 댓글 삭제
export const deleteCommentApi = async (id: number) => {
  try {
    await apiClient.delete(`/comments/${id}`)
    return { id }
  } catch {
    throw new Error("댓글 삭제에 실패했습니다.")
  }
}

// 5. 댓글 좋아요/취소 (토글)
export const toggleLikeCommentApi = async (
  id: number,
  currentLikes: number,
  isLiked: boolean,
): Promise<CommentType> => {
  try {
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1
    return await apiClient.patch<CommentType>(`/comments/${id}`, { likes: newLikes })
  } catch {
    throw new Error(isLiked ? "좋아요 취소에 실패했습니다." : "댓글 좋아요에 실패했습니다.")
  }
}
