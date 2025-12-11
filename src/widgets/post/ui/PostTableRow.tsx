import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { Post } from "../../../entities/post/model/types"
import { useDeletePost } from "../../../entities/post/api"
import { highlightText } from "../../../shared/lib"
import { usePostStore } from "../../../shared/model/store"
import { Button, TableCell, TableRow } from "../../../shared/ui"
import { usePostEvents } from "../model"

interface PostTableRowProps {
  post: Post
}

export const PostTableRow = ({ post }: PostTableRowProps) => {
  const { searchQuery, selectedTag } = usePostStore()
  const { handleEditPost, handleViewPostDetail, handleViewUserInfo, handleTagClick } = usePostEvents()
  const deletePostMutation = useDeletePost()

  const handleDeleteClick = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deletePostMutation.mutate(post.id)
    }
  }

  return (
    <TableRow>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>{highlightText(post.title, searchQuery)}</div>
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                  selectedTag === tag
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleViewUserInfo(post.author)}>
          <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
          <span>{post.author?.username}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions?.likes || 0}</span>
          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions?.dislikes || 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewPostDetail(post)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDeleteClick}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
