import { PostFilters } from "../../../features/post/ui/PostFilters"
import { PostTable } from "../../../widgets/post/ui/PostTable"
import { Pagination } from "../../../shared/ui/pagination"
import { CardContent } from "../../../shared/ui"

export const PostManagerContent = () => {
  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        {/* 검색 및 필터 컨트롤 */}
        <PostFilters />
        {/* 게시물 테이블 */}
        <PostTable />
        {/* 페이지네이션 */}
        <Pagination />
      </div>
    </CardContent>
  )
}

