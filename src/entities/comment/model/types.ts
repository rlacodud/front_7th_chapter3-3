import { User } from "../../user/model/types"

export interface CommentType {
  id: number
  user: User
  body: string
  likes: number
}

export interface CommentsResponse {
  comments: CommentType[]
}
