import { CommentAddModal } from "../../../widgets/comment/ui/CommentAddModal"
import { CommentEditModal } from "../../../widgets/comment/ui/CommentEditModel"
import { PostAddModal } from "../../../widgets/post/ui/PostAddModal"
import { PostDetailModal } from "../../../widgets/post/ui/PostDetailModal"
import { PostEditModal } from "../../../widgets/post/ui/PostEditModal"
import { UserInfoModal } from "../../../widgets/user/ui/UserInfoModal"

export const PostManagerModals = () => {
  return (
    <>
      <PostAddModal />
      <PostEditModal />
      <PostDetailModal />

      <CommentAddModal />
      <CommentEditModal />

      <UserInfoModal />
    </>
  )
}

