import { create } from "zustand"
import { Post, PostWithAuthor } from "../../entities/post/model/types"
import { CommentType } from "../../entities/comment/model/types"
import { User } from "../../entities/user/model/types"

interface PostStore {
  // 필터/정렬 상태 (클라이언트 상태)
  skip: number
  limit: number
  searchQuery: string
  sortBy: string
  sortOrder: "asc" | "desc"
  selectedTag: string

  // 모달 상태 (클라이언트 상태)
  showAddDialog: boolean
  showEditDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showPostDetailDialog: boolean
  showUserInfoModal: boolean

  // 선택된 항목 (클라이언트 상태)
  selectedPost: Post | null
  selectedComment: (CommentType & { postId?: number }) | null
  selectedUser: User | null

  // 폼 상태 (클라이언트 상태)
  newPost: { title: string; body: string; userId: number | "" }
  newComment: { body: string; postId: number | null; userId: number | "" }

  // 로컬 데이터 (가짜 API 대응)
  localPosts: PostWithAuthor[] // 로컬에 추가/수정된 게시물
  localComments: Record<number, CommentType[]> // 로컬에 추가/수정된 댓글 (postId별)
  likedComments: Record<number, Set<number>> // 좋아요를 누른 댓글 추적 (commentId -> userId Set)
  deletedPostIds: Set<number> // 삭제된 게시물 ID 추적
  deletedCommentIds: Record<number, Set<number>> // 삭제된 댓글 ID 추적 (postId -> commentId Set)

  // Actions
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setSearchQuery: (query: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (order: "asc" | "desc") => void
  setSelectedTag: (tag: string) => void

  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
  setShowPostDetailDialog: (show: boolean) => void
  setShowUserInfoModal: (show: boolean) => void

  setSelectedPost: (post: Post | null) => void
  setSelectedComment: (comment: (CommentType & { postId?: number }) | null) => void
  setSelectedUser: (user: User | null) => void

  setNewPost: (post: { title: string; body: string; userId: number | "" }) => void
  setNewComment: (comment: { body: string; postId: number | null; userId: number | "" }) => void

  resetNewPost: () => void
  resetNewComment: () => void

  // 로컬 데이터 관리 (가짜 API 대응)
  addLocalPost: (post: PostWithAuthor) => void
  updateLocalPost: (post: PostWithAuthor) => void
  deleteLocalPost: (id: number) => void
  addLocalComment: (postId: number, comment: CommentType) => void
  updateLocalComment: (postId: number, comment: CommentType) => void
  deleteLocalComment: (postId: number, id: number) => void
  addDeletedPostId: (id: number) => void
  addDeletedCommentId: (postId: number, commentId: number) => void
  likeLocalComment: (postId: number, id: number, likes: number) => void
  hasUserLikedComment: (commentId: number, userId: number) => boolean
  addLikedComment: (commentId: number, userId: number) => void
}

export const usePostStore = create<PostStore>((set) => ({
  // 초기 상태
  skip: 0,
  limit: 10,
  searchQuery: "",
  sortBy: "",
  sortOrder: "asc",
  selectedTag: "",

  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserInfoModal: false,

  selectedPost: null,
  selectedComment: null,
  selectedUser: null,

  newPost: { title: "", body: "", userId: "" },
  newComment: { body: "", postId: null, userId: "" },

  // 로컬 데이터 초기 상태
  localPosts: [],
  localComments: {},
  likedComments: {},
  deletedPostIds: new Set<number>(),
  deletedCommentIds: {},

  // Actions
  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),
  setSearchQuery: (searchQuery) => set({ searchQuery, skip: 0 }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSelectedTag: (selectedTag) => set({ selectedTag, skip: 0 }),

  setShowAddDialog: (showAddDialog) => set({ showAddDialog }),
  setShowEditDialog: (showEditDialog) => set({ showEditDialog }),
  setShowAddCommentDialog: (showAddCommentDialog) => set({ showAddCommentDialog }),
  setShowEditCommentDialog: (showEditCommentDialog) => set({ showEditCommentDialog }),
  setShowPostDetailDialog: (showPostDetailDialog) => set({ showPostDetailDialog }),
  setShowUserInfoModal: (showUserInfoModal) => set({ showUserInfoModal }),

  setSelectedPost: (selectedPost) => set({ selectedPost }),
  setSelectedComment: (selectedComment) => set({ selectedComment }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  setNewPost: (newPost) => set({ newPost }),
  setNewComment: (newComment) => set({ newComment }),

  resetNewPost: () => set({ newPost: { title: "", body: "", userId: "" } }),
  resetNewComment: () => set({ newComment: { body: "", postId: null, userId: "" } }),

  // 로컬 데이터 관리 (가짜 API 대응)
  addLocalPost: (post) =>
    set((state) => ({
      localPosts: [...state.localPosts, post],
    })),
  updateLocalPost: (post) =>
    set((state) => ({
      localPosts: state.localPosts.map((p) => (p.id === post.id ? post : p)),
    })),
  deleteLocalPost: (id) =>
    set((state) => ({
      localPosts: state.localPosts.filter((p) => p.id !== id),
    })),
  addLocalComment: (postId, comment) =>
    set((state) => ({
      localComments: {
        ...state.localComments,
        [postId]: [...(state.localComments[postId] || []), comment],
      },
    })),
  updateLocalComment: (postId, comment) =>
    set((state) => ({
      localComments: {
        ...state.localComments,
        [postId]: (state.localComments[postId] || []).map((c: CommentType) => (c.id === comment.id ? comment : c)),
      },
    })),
  deleteLocalComment: (postId, id) =>
    set((state) => ({
      localComments: {
        ...state.localComments,
        [postId]: (state.localComments[postId] || []).filter((c: CommentType) => c.id !== id),
      },
    })),
  addDeletedPostId: (id) =>
    set((state) => ({
      deletedPostIds: new Set([...state.deletedPostIds, id]),
    })),
  addDeletedCommentId: (postId, commentId) =>
    set((state) => {
      const currentSet = state.deletedCommentIds[postId] || new Set<number>()
      return {
        deletedCommentIds: {
          ...state.deletedCommentIds,
          [postId]: new Set([...currentSet, commentId]),
        },
      }
    }),
  likeLocalComment: (postId, id, likes) =>
    set((state) => ({
      localComments: {
        ...state.localComments,
        [postId]: (state.localComments[postId] || []).map((c: CommentType) => (c.id === id ? { ...c, likes } : c)),
      },
    })),
  hasUserLikedComment: (commentId: number, userId: number): boolean => {
    const state = usePostStore.getState()
    const likedSet: Set<number> | undefined = state.likedComments[commentId]
    return likedSet ? likedSet.has(userId) : false
  },
  addLikedComment: (commentId, userId) =>
    set((state) => {
      const currentSet = state.likedComments[commentId] || new Set<number>()
      if (currentSet.has(userId)) {
        // 이미 좋아요를 눌렀으면 취소 (토글)
        const newSet = new Set(currentSet)
        newSet.delete(userId)
        const newLikedComments = { ...state.likedComments }
        if (newSet.size > 0) {
          newLikedComments[commentId] = newSet
        } else {
          delete newLikedComments[commentId]
        }
        return {
          likedComments: newLikedComments,
        }
      } else {
        // 좋아요 추가
        return {
          likedComments: {
            ...state.likedComments,
            [commentId]: new Set([...currentSet, userId]),
          },
        }
      }
    }),
}))
