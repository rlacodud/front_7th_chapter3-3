import { useAddComment } from "../../../entities/comment/api"
import { usePostStore } from "../../../shared/model/store"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"

export const CommentAddModal = () => {
  const { showAddCommentDialog, setShowAddCommentDialog, newComment, setNewComment, resetNewComment } = usePostStore()
  const addCommentMutation = useAddComment()

  const handleAddComment = async () => {
    if (!newComment.postId) {
      alert("게시물 ID가 없습니다.")
      return
    }

    if (!newComment.body.trim()) {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    // userId는 자동 생성되므로 기본값 사용
    const userId = typeof newComment.userId === "number" && newComment.userId > 0 ? newComment.userId : 1

    try {
      // postId가 null이 아님을 확인했으므로 타입 단언 사용
      await addCommentMutation.mutateAsync({
        body: newComment.body,
        postId: newComment.postId,
        userId,
      })
      setShowAddCommentDialog(false)
      resetNewComment()
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      alert("댓글 추가에 실패했습니다.")
    }
  }

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium mb-1">사용자 ID</label>
            <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
              {newComment.userId || "자동 생성됨"}
            </div>
            <p className="text-xs text-gray-500 mt-1">댓글 생성 시 자동으로 할당됩니다</p>
          </div>
          <Button onClick={handleAddComment} disabled={!newComment.postId}>
            댓글 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
