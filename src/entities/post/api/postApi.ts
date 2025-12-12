import { Post, PostsResponse, TagsResponse } from "../model/types"
import { apiClient } from "../../../shared/lib/apiClient"

// 공통으로 사용할 queryParams 생성 함수
const makeQueryParams = (limit: number, skip: number, sortBy?: string, sortOrder?: string) => {
  const params: Record<string, string | number> = {
    limit,
    skip,
  }
  if (sortBy && sortBy !== "none" && sortBy !== "") {
    params.sortBy = sortBy
    params.order = sortOrder || "asc"
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
  const queryParams = makeQueryParams(limit, skip, sortBy, sortOrder)
  return apiClient.get<PostsResponse>("/posts", queryParams)
}

// 2. 검색어 조회
export const searchPosts = async (
  query: string,
  limit: number,
  skip: number,
  sortBy?: string,
  sortOrder?: string,
): Promise<PostsResponse> => {
  const queryParams = {
    ...makeQueryParams(limit, skip, sortBy, sortOrder),
    q: query,
  }
  return apiClient.get<PostsResponse>("/posts/search", queryParams)
}

// 3. 태그별 조회
export const getPostsByTag = async (
  tag: string,
  limit: number,
  skip: number,
  sortBy?: string,
  sortOrder?: string,
): Promise<PostsResponse> => {
  const queryParams = makeQueryParams(limit, skip, sortBy, sortOrder)
  return apiClient.get<PostsResponse>(`/posts/tag/${tag}`, queryParams)
}

// 4. 태그 목록 조회
export const getTags = async (): Promise<TagsResponse[]> => {
  return apiClient.get<TagsResponse[]>("/posts/tags")
}

// 5. 게시글 추가
export const addPostApi = async (newPost: { title: string; body: string; userId: number }): Promise<Post> => {
  try {
    return await apiClient.post<Post>("/posts/add", newPost)
  } catch {
    throw new Error("게시물 추가에 실패했습니다.")
  }
}

// 6. 게시글 수정
export const updatePostApi = async (post: Post): Promise<Post> => {
  try {
    return await apiClient.put<Post>(`/posts/${post.id}`, post)
  } catch {
    throw new Error("게시물 수정에 실패했습니다.")
  }
}

// 7. 게시글 삭제
export const deletePostApi = async (id: number) => {
  try {
    return await apiClient.delete(`/posts/${id}`)
  } catch {
    throw new Error("게시물 삭제에 실패했습니다.")
  }
}
