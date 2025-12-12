import { useDeleteComment, useLikeComment } from "../../../entities/comment/api"
import { CommentType } from "../../../entities/comment/model/types"
import { usePostStore } from "../../../shared/model/store"

// 댓글 관련 이벤트 핸들러
export const useCommentEvents = () => {
  const { setSelectedComment, setShowEditCommentDialog, setNewComment, setShowAddCommentDialog } = usePostStore()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()

  const handleEditComment = (comment: CommentType & { postId?: number }) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  const handleAddComment = (postId: number) => {
    setNewComment({ body: "", postId, userId: "" })
    setShowAddCommentDialog(true)
  }

  const handleLikeComment = (id: number, postId: number, currentLikes: number, isLiked: boolean) => {
    likeCommentMutation.mutate({ id, postId, currentLikes, isLiked })
  }

  const handleDeleteComment = (id: number, postId: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate({ id, postId })
    }
  }

  return {
    handleEditComment,
    handleAddComment,
    handleLikeComment,
    handleDeleteComment,
  }
}
