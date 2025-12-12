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

    // userId는 자동 생성되므로 기본값 사용
    const userId = typeof newPost.userId === "number" && newPost.userId > 0 ? newPost.userId : 1

    try {
      await addPostMutation.mutateAsync({
        title: newPost.title,
        body: newPost.body,
        userId,
      })
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
          <div>
            <label className="block text-sm font-medium mb-1">사용자 ID</label>
            <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
              {newPost.userId || "자동 생성됨"}
            </div>
            <p className="text-xs text-gray-500 mt-1">게시물 생성 시 자동으로 할당됩니다</p>
          </div>
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
