import { useUpdateComment } from "../../../entities/comment/api"
import { usePostStore } from "../../../shared/model/store"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"

export const CommentEditModal = () => {
  const { showEditCommentDialog, setShowEditCommentDialog, selectedComment, setSelectedComment } = usePostStore()
  const updateCommentMutation = useUpdateComment()

  const handleUpdateComment = async () => {
    if (!selectedComment || !selectedComment.postId) return

    try {
      await updateCommentMutation.mutateAsync({
        id: selectedComment.id,
        body: selectedComment.body,
        postId: selectedComment.postId,
      })
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
      alert("댓글 수정에 실패했습니다.")
    }
  }

  if (!selectedComment) return null

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment.body || ""}
            onChange={(e) => {
              if (selectedComment) {
                setSelectedComment({
                  ...selectedComment,
                  body: e.target.value,
                })
              }
            }}
          />
          <Button onClick={handleUpdateComment}>
            댓글 업데이트
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
