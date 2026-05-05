"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, MessageCircle } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { CommentsModal } from "@/components/CommentsModal"
import { getCommunityFeed, togglePostLike, type FeedPost } from "@/lib/mock-data"

export default function Page() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [error, setError] = useState("")
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [commentModalPost, setCommentModalPost] = useState<FeedPost | null>(null)

  useEffect(() => {
    getCommunityFeed().then(setPosts)
  }, [])

  const disabledGenerate = useMemo(() => prompt.trim().length === 0, [prompt])

  const handleGenerate = () => {
    if (disabledGenerate) {
      setError("프롬프트를 입력해 주세요")
      return
    }

    setError("")
    router.push(`/generate?prompt=${encodeURIComponent(prompt.trim())}`)
  }

  const handleToggleLike = async (postId: string) => {
    const updated = await togglePostLike(postId)
    setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)))
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Artify</h1>
        <p className="text-sm text-muted-foreground">프롬프트를 입력하고 이미지를 생성해 보세요.</p>
        <input
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value)
            if (error) setError("")
          }}
          placeholder="예: 따뜻한 햇살 아래 고양이 카페, 수채화 스타일"
          className="h-11 rounded-md border bg-muted px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button onClick={handleGenerate} disabled={disabledGenerate} className="h-11">
          이미지 생성
        </Button>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">커뮤니티 피드</h2>
          <p className="text-sm text-muted-foreground">최신 이미지와 인기 게시물을 확인하세요.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/post/${post.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter") router.push(`/post/${post.id}`)
              }}
              className="group overflow-hidden rounded-xl border bg-card shadow-sm transition hover:scale-[1.01] hover:shadow-md"
            >
              <div className="relative h-52 w-full">
                <Image src={post.imageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="line-clamp-1 font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">@{post.username}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      void handleToggleLike(post.id)
                    }}
                    className="inline-flex items-center gap-1 transition hover:text-foreground"
                  >
                    <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current text-red-500" : ""}`} />
                    {post.likes}
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      setCommentModalPost(post)
                    }}
                    className="inline-flex items-center gap-1 transition hover:text-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {post.comments}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CommentsModal
        open={Boolean(commentModalPost)}
        postTitle={commentModalPost?.title ?? ""}
        postId={commentModalPost?.id ?? ""}
        onClose={() => setCommentModalPost(null)}
      />
    </main>
  )
}
