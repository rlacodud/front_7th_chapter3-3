import { usePostStore } from "../../../shared/model/store"
import { usePostFilters } from "../lib/usePostFilters"

// 필터 관련 이벤트 핸들러
export const useFilterEvents = () => {
  const { setSelectedTag, setSortBy, setSortOrder, setSearchQuery } = usePostStore()
  const { updateURL } = usePostFilters()

  const handleTagChange = (value: string) => {
    setSelectedTag(value)
    updateURL()
  }

  const handleSortByChange = (value: string) => {
    setSortBy(value)
    updateURL()
  }

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value)
    updateURL()
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateURL()
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  return {
    handleTagChange,
    handleSortByChange,
    handleSortOrderChange,
    handleSearchKeyPress,
    handleSearchChange,
  }
}

