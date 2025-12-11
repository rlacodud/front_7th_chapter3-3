import { usePostStore } from "../../shared/model/store"
import { usePosts, useSearchPosts, usePostsByTag } from "../../entities/post/api"
import { Button } from "./button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

export const Pagination = () => {
  const { skip, limit, setSkip, setLimit, searchQuery, sortBy, sortOrder, selectedTag } = usePostStore()

  // 필터에 따라 적절한 쿼리 사용
  const { data: postsData } = usePosts(skip, limit, sortBy, sortOrder)
  const { data: searchData } = useSearchPosts(searchQuery, skip, limit, sortBy, sortOrder)
  const { data: tagData } = usePostsByTag(selectedTag, skip, limit, sortBy, sortOrder)

  // 현재 필터에 맞는 total 선택
  const total = (() => {
    if (searchQuery && searchData) return searchData.total
    if (selectedTag && selectedTag !== "all" && tagData) return tagData.total
    if (postsData) return postsData.total
    return 0
  })()

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <span>항목</span>
      </div>
      <div className="flex gap-2">
        <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
          이전
        </Button>
        <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
          다음
        </Button>
      </div>
    </div>
  )
}
