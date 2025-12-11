import { usePostStore } from "../../../shared/model/store"
import { usePosts, useSearchPosts, usePostsByTag } from "../../../entities/post/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui"
import { PostTableRow } from "./PostTableRow"

export const PostTable = () => {
  const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag } = usePostStore()

  // 필터에 따라 적절한 쿼리 사용
  const { data: postsData, isLoading: isLoadingPosts } = usePosts(skip, limit, sortBy, sortOrder)
  const { data: searchData, isLoading: isLoadingSearch } = useSearchPosts(searchQuery, skip, limit, sortBy, sortOrder)
  const { data: tagData, isLoading: isLoadingTag } = usePostsByTag(selectedTag, skip, limit, sortBy, sortOrder)

  // 현재 필터에 맞는 데이터 선택
  const currentData = (() => {
    if (searchQuery && searchData) return searchData
    if (selectedTag && selectedTag !== "all" && tagData) return tagData
    return postsData
  })()

  const isLoading = isLoadingPosts || isLoadingSearch || isLoadingTag
  const posts = currentData?.posts || []

  if (isLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              게시물이 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          posts.map((post) => <PostTableRow key={post.id} post={post} />)
        )}
      </TableBody>
    </Table>
  )
}
