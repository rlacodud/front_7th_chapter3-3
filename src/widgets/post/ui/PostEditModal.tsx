import { useUpdatePost } from "../../../entities/post/api"
import { usePostStore } from "../../../shared/model/store"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"

/* 게시물 수정 대화상자 */
export const PostEditModal = () => {
  const { showEditDialog, setShowEditDialog, selectedPost, setSelectedPost } = usePostStore()
  const updatePostMutation = useUpdatePost()

  const handleUpdatePost = async () => {
    if (!selectedPost) return

    if (!selectedPost.title?.trim()) {
      alert("제목을 입력해주세요.")
      return
    }

    if (!selectedPost.body?.trim()) {
      alert("내용을 입력해주세요.")
      return
    }

    try {
      await updatePostMutation.mutateAsync(selectedPost)
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
      alert("게시물 수정에 실패했습니다.")
    }
  }

  if (!selectedPost) return null

  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost.body || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value })}
          />
          <Button onClick={handleUpdatePost}>
            게시물 업데이트
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
