import { Post, PostsResponse, TagsResponse } from "../model/types"
import { BASE_URL } from "../../../shared/config"

// 공통으로 사용할 URL 파라미터 생성 함수
const makeParams = (limit: number, skip: number, sortBy?: string, sortOrder?: string) => {
  let params = `limit=${limit}&skip=${skip}`
  if (sortBy && sortBy !== "none" && sortBy !== "") {
    params += `&sortBy=${sortBy}&order=${sortOrder || "asc"}`
  }
  return params
}

// 1. 기본 목록 조회
export const getPosts = async (
  limit: number,
  skip: number,
  sortBy?: string,
  sortOrder?: string,
): Promise<PostsResponse> => {
  const params = makeParams(limit, skip, sortBy, sortOrder)
  const response = await fetch(`${BASE_URL}/posts?${params}`)
  return response.json()
}

// 2. 검색어 조회
export const searchPosts = async (
  query: string,
  limit: number,
  skip: number,
  sortBy?: string,
  sortOrder?: string,
): Promise<PostsResponse> => {
  const params = makeParams(limit, skip, sortBy, sortOrder)
  const response = await fetch(`${BASE_URL}/posts/search?q=${encodeURIComponent(query)}&${params}`)
  return response.json()
}

// 3. 태그별 조회
export const getPostsByTag = async (
  tag: string,
  limit: number,
  skip: number,
  sortBy?: string,
  sortOrder?: string,
): Promise<PostsResponse> => {
  const params = makeParams(limit, skip, sortBy, sortOrder)
  const response = await fetch(`${BASE_URL}/posts/tag/${tag}?${params}`)
  return response.json()
}

// 4. 태그 목록 조회
export const getTags = async (): Promise<TagsResponse[]> => {
  const response = await fetch(`${BASE_URL}/posts/tags`)
  return response.json()
}

// 5. 게시글 추가
export const addPostApi = async (newPost: { title: string; body: string; userId: number }) => {
  const response = await fetch(`${BASE_URL}/posts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  if (!response.ok) {
    throw new Error("게시물 추가에 실패했습니다.")
  }
  return response.json()
}

// 6. 게시글 수정
export const updatePostApi = async (post: Post) => {
  const response = await fetch(`${BASE_URL}/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  if (!response.ok) {
    throw new Error("게시물 수정에 실패했습니다.")
  }
  return response.json()
}

// 7. 게시글 삭제
export const deletePostApi = async (id: number) => {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("게시물 삭제에 실패했습니다.")
  }
  return response.json()
}

