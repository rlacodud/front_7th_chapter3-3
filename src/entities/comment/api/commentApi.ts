import { CommentType } from "../model/types"
import { BASE_URL } from "../../../shared/config"

// 1. 댓글 가져오기
export const getCommentsByPostId = async (postId: number) => {
  const response = await fetch(`${BASE_URL}/comments/post/${postId}`)
  if (!response.ok) {
    throw new Error("댓글을 불러오는데 실패했습니다.")
  }
  return response.json()
}

// 2. 댓글 추가
export const addCommentApi = async (newComment: { body: string; postId: number; userId: number }) => {
  const response = await fetch(`${BASE_URL}/comments/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  })
  if (!response.ok) {
    throw new Error("댓글 추가에 실패했습니다.")
  }
  return response.json()
}

// 3. 댓글 수정
export const updateCommentApi = async (comment: Pick<CommentType, "id" | "body">) => {
  const response = await fetch(`${BASE_URL}/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  })
  if (!response.ok) {
    throw new Error("댓글 수정에 실패했습니다.")
  }
  return response.json()
}

// 4. 댓글 삭제
export const deleteCommentApi = async (id: number) => {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("댓글 삭제에 실패했습니다.")
  }
  return { id }
}

// 5. 댓글 좋아요
export const likeCommentApi = async (id: number, currentLikes: number) => {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  })
  if (!response.ok) {
    throw new Error("댓글 좋아요에 실패했습니다.")
  }
  return response.json()
}

