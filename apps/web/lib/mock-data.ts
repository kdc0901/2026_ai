export type Comment = {
  id: string
  author: string
  content: string
  createdAt: string
}

export type FeedPost = {
  id: string
  title: string
  username: string
  prompt: string
  imageUrl: string
  likes: number
  comments: number
  isLiked: boolean
  createdAt: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const feedStore: FeedPost[] = [
  {
    id: "p1",
    title: "네온 도시의 밤",
    username: "minji",
    prompt: "Cyberpunk neon city, rainy night, cinematic light",
    imageUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
    likes: 42,
    comments: 6,
    isLiked: false,
    createdAt: "2026-05-05T22:20:00.000Z",
  },
  {
    id: "p2",
    title: "숲속 판타지 하우스",
    username: "haneul",
    prompt: "Fantasy cottage in forest, pastel tone, high details",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    likes: 31,
    comments: 4,
    isLiked: true,
    createdAt: "2026-05-05T20:03:00.000Z",
  },
  {
    id: "p3",
    title: "우주 고래",
    username: "jiho",
    prompt: "A giant whale flying in space, dreamy illustration",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",
    likes: 75,
    comments: 10,
    isLiked: false,
    createdAt: "2026-05-04T18:44:00.000Z",
  },
]

const commentsStore: Record<string, Comment[]> = {
  p1: [
    { id: "c1", author: "sora", content: "색감이 정말 좋아요!", createdAt: "2026-05-05T22:45:00.000Z" },
    { id: "c2", author: "leo", content: "프롬프트 공유 가능할까요?", createdAt: "2026-05-05T23:10:00.000Z" },
  ],
  p2: [{ id: "c3", author: "nari", content: "동화책 표지 느낌이네요.", createdAt: "2026-05-05T21:11:00.000Z" }],
  p3: [{ id: "c4", author: "mina", content: "우주 질감 표현이 멋져요.", createdAt: "2026-05-04T19:20:00.000Z" }],
}

export async function getCommunityFeed(): Promise<FeedPost[]> {
  await sleep(200)
  return [...feedStore].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function getPostById(postId: string): Promise<FeedPost | null> {
  await sleep(150)
  return feedStore.find((post) => post.id === postId) ?? null
}

export async function togglePostLike(postId: string): Promise<FeedPost> {
  await sleep(120)
  const target = feedStore.find((post) => post.id === postId)
  if (!target) throw new Error("Post not found")

  target.isLiked = !target.isLiked
  target.likes = target.isLiked ? target.likes + 1 : Math.max(0, target.likes - 1)
  return { ...target }
}

export async function getComments(postId: string): Promise<Comment[]> {
  await sleep(120)
  const comments = commentsStore[postId] ?? []
  return [...comments].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  await sleep(180)
  const newComment: Comment = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `c_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    author: "you",
    content,
    createdAt: new Date().toISOString(),
  }

  if (!commentsStore[postId]) commentsStore[postId] = []
  commentsStore[postId].push(newComment)

  const target = feedStore.find((post) => post.id === postId)
  if (target) target.comments += 1

  return newComment
}
