import { useAddPost } from "../../../entities/post/api"
import { usePostStore } from "../../../shared/model/store"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"

/* 게시물 추가 대화상자 */
export const PostAddModal = () => {
  const { showAddDialog, setShowAddDialog, newPost, setNewPost, resetNewPost } = usePostStore()
  const addPostMutation = useAddPost()

  const handleAddPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    if (newPost.userId <= 0) {
      alert("유효한 사용자 ID를 입력해주세요.")
      return
    }

    try {
      await addPostMutation.mutateAsync(newPost)
      setShowAddDialog(false)
      resetNewPost()
    } catch (error) {
      console.error("게시물 추가 오류:", error)
      alert("게시물 추가에 실패했습니다.")
    }
  }

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={handleAddPost}>
            게시물 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
