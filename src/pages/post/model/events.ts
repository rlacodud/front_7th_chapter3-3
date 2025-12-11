import { usePostStore } from "../../../shared/model/store"

// 페이지 관련 이벤트 핸들러
export const usePostManagerEvents = () => {
  const { setShowAddDialog } = usePostStore()

  const handleAddPostClick = () => {
    setShowAddDialog(true)
  }

  return {
    handleAddPostClick,
  }
}

