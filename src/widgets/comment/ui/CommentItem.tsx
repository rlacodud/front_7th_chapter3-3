import { Edit2, ThumbsUp, Trash2 } from "lucide-react"
import { useState } from "react"
import { CommentType } from "../../../entities/comment/model/types"
import { highlightText } from "../../../shared/lib"
import { usePostStore } from "../../../shared/model/store"
import { Button } from "../../../shared/ui"
import { useCommentEvents } from "../model"

interface CommentItemProps {
  comment: CommentType
  postId: number
  searchQuery: string
}

export const CommentItem = ({ comment, postId, searchQuery }: CommentItemProps) => {
  const { handleEditComment, handleLikeComment, handleDeleteComment } = useCommentEvents()
  const { hasUserLikedComment, addLikedComment } = usePostStore()
  const [isLiking, setIsLiking] = useState(false)

  // 현재 사용자 ID (실제로는 인증된 사용자 ID를 사용해야 함, 여기서는 임시로 1 사용)
  const currentUserId = 1
  const hasLiked = hasUserLikedComment(comment.id, currentUserId)

  const handleLikeClick = () => {
    if (isLiking) return // 이미 좋아요 처리 중이면 무시

    setIsLiking(true)
    addLikedComment(comment.id, currentUserId) // 좋아요 상태 토글
    handleLikeComment(comment.id, postId, comment.likes, hasLiked)
    // 짧은 딜레이 후 다시 클릭 가능하도록 (중복 방지)
    setTimeout(() => setIsLiking(false), 1000)
  }

  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLikeClick}
          disabled={isLiking}
          className={hasLiked ? "text-blue-600" : ""}
          title={hasLiked ? "좋아요 취소" : "좋아요"}
        >
          <ThumbsUp className={`w-3 h-3 ${hasLiked ? "fill-current" : ""}`} />
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
