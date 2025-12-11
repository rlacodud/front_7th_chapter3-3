import { usePostFilters } from "../../features/post/lib/usePostFilters"
import { Card } from "../../shared/ui"
import { usePostManagerEvents } from "./model"
import { PostManagerContent } from "./ui/PostManagerContent"
import { PostManagerHeader } from "./ui/PostManagerHeader"
import { PostManagerModals } from "./ui/PostManagerModals"

const PostsManager = () => {
  usePostFilters() // URL 동기화 로직
  const { handleAddPostClick } = usePostManagerEvents()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostManagerHeader onAddPostClick={handleAddPostClick} />
      <PostManagerContent />
      <PostManagerModals />
    </Card>
  )
}

export default PostsManager
