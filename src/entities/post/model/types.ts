export interface Post {
  id: number
  userId: number
  title: string
  body: string
  tags?: string[]
  author?: {
    id: number
    username: string
    image?: string
  }
  reactions?: { likes: number; dislikes: number }
}

export interface PostWithAuthor extends Post {
  author?: {
    id: number
    username: string
    image?: string
  }
}

export interface PostsResponse {
  posts: PostWithAuthor[]
  total: number
}

export interface TagsResponse {
  url: string
  slug: string
}
