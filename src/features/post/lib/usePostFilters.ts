import { useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { usePostStore } from "../../../shared/model/store"

export const usePostFilters = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,
    setSkip,
    setLimit,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
  } = usePostStore()

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate])

  // URL에서 초기값 로드
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const urlSkip = params.get("skip")
    const urlLimit = params.get("limit")
    const urlSearch = params.get("search")
    const urlSortBy = params.get("sortBy")
    const urlSortOrder = params.get("sortOrder")
    const urlTag = params.get("tag")

    if (urlSkip) setSkip(parseInt(urlSkip))
    if (urlLimit) setLimit(parseInt(urlLimit))
    if (urlSearch !== null) setSearchQuery(urlSearch)
    if (urlSortBy !== null) setSortBy(urlSortBy)
    if (urlSortOrder) setSortOrder(urlSortOrder as "asc" | "desc")
    if (urlTag !== null) setSelectedTag(urlTag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // 필터 변경 시 URL 업데이트 (TanStack Query가 자동으로 데이터를 가져옴)
  useEffect(() => {
    updateURL()
  }, [updateURL])

  return { updateURL }
}

