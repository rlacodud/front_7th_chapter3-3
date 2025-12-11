import { Search } from "lucide-react"
import { useTags } from "../../../entities/post/api"
import { useFilterEvents } from "../model"
import { usePostStore } from "../../../shared/model/store"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shared/ui"

export const PostFilters = () => {
  const { searchQuery, sortBy, sortOrder, selectedTag } = usePostStore()
  const { data: tagsData } = useTags()
  const { handleTagChange, handleSortByChange, handleSortOrderChange, handleSearchKeyPress, handleSearchChange } =
    useFilterEvents()

  const tags = tagsData || []

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
        </div>
      </div>
      <Select value={selectedTag || "all"} onValueChange={handleTagChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={handleSortByChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={handleSortOrderChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
