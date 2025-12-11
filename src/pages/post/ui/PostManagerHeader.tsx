import { Plus } from "lucide-react"
import { Button, CardHeader, CardTitle } from "../../../shared/ui"

interface PostManagerHeaderProps {
  onAddPostClick: () => void
}

export const PostManagerHeader = ({ onAddPostClick }: PostManagerHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <Button onClick={onAddPostClick}>
          <Plus className="w-4 h-4 mr-2" />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  )
}

