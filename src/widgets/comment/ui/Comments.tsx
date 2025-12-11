import { Plus } from "lucide-react"
import { useComments } from "../../../entities/comment/api"
import { usePostStore } from "../../../shared/model/store"
import { Button } from "../../../shared/ui"
import { useCommentEvents } from "../model"
import { CommentItem } from "./CommentItem"

interface CommentsProps {
  postId: number
}

// 댓글 렌더링
export const Comments = ({ postId }: CommentsProps) => {
  const { searchQuery } = usePostStore()
  const { data: commentsData, isLoading } = useComments(postId)
  const { handleAddComment } = useCommentEvents()

  const postComments = commentsData?.comments || []

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => handleAddComment(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {isLoading ? (
          <div className="text-sm text-gray-500">로딩 중...</div>
        ) : postComments.length === 0 ? (
          <div className="text-sm text-gray-500">댓글이 없습니다.</div>
        ) : (
          postComments.map((comment) => <CommentItem key={comment.id} comment={comment} postId={postId} searchQuery={searchQuery} />)
        )}
      </div>
    </div>
  )
}
