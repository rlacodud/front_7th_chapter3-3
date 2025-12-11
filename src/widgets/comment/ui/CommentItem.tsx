import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { CommentType } from "../../../entities/comment/model/types"
import { highlightText } from "../../../shared/lib"
import { Button } from "../../../shared/ui"
import { useCommentEvents } from "../model"

interface CommentItemProps {
  comment: CommentType
  postId: number
  searchQuery: string
}

export const CommentItem = ({ comment, postId, searchQuery }: CommentItemProps) => {
  const { handleEditComment, handleLikeComment, handleDeleteComment } = useCommentEvents()

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id, postId, comment.likes)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleEditComment({ ...comment, postId })}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id, postId)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
