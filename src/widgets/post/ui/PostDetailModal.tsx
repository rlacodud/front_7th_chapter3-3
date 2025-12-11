import { highlightText } from "../../../shared/lib"
import { usePostStore } from "../../../shared/model/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { Comments } from "../../comment/ui/Comments"

export const PostDetailModal = () => {
  const { showPostDetailDialog, setShowPostDetailDialog, selectedPost, searchQuery } = usePostStore()

  if (!selectedPost) return null

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost.body, searchQuery)}</p>
          <Comments postId={selectedPost.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
