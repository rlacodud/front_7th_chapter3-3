import { useNavigate } from "react-router-dom"
import { Post } from "../../../entities/post/model/types"
import { usePostStore } from "../../../shared/model/store"

// 게시물 관련 이벤트 핸들러
export const usePostEvents = () => {
  const {
    setSelectedPost,
    setShowEditDialog,
    setShowPostDetailDialog,
    setSelectedUser,
    setShowUserInfoModal,
    setSelectedTag,
  } = usePostStore()
  const navigate = useNavigate()

  const handleEditPost = (post: Post) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  const handleViewPostDetail = (post: Post) => {
    setSelectedPost(post)
    // TanStack Query가 자동으로 댓글을 가져옴 (Comments 컴포넌트에서 useComments 사용)
    setShowPostDetailDialog(true)
  }

  const handleViewUserInfo = (user: Post["author"]) => {
    if (user) {
      setSelectedUser(user as any)
      // TanStack Query가 자동으로 사용자 정보를 가져옴 (UserInfoModal에서 useUser 사용)
      setShowUserInfoModal(true)
    }
  }

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    const params = new URLSearchParams(window.location.search)
    params.set("tag", tag)
    navigate(`?${params.toString()}`)
  }

  return {
    handleEditPost,
    handleViewPostDetail,
    handleViewUserInfo,
    handleTagClick,
  }
}
