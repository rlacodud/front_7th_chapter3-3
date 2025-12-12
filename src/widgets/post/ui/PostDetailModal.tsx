import { highlightText } from "../../../shared/lib"
import { usePostStore } from "../../../shared/model/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { Comments } from "../../comment/ui/Comments"

export const PostDetailModal = () => {
  const { showPostDetailDialog, setShowPostDetailDialog, selectedPost, searchQuery } = usePostStore()

  if (!selectedPost) return null

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="pr-8">{highlightText(selectedPost.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto flex-1 min-h-0">
          <p className="whitespace-pre-wrap break-words">{highlightText(selectedPost.body, searchQuery)}</p>
          <Comments postId={selectedPost.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
