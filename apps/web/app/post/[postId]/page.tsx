"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Heart, MessageCircle, Share2 } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { CommentsModal } from "@/components/CommentsModal"
import { getPostById, togglePostLike, type FeedPost } from "@/lib/mock-data"

export default function PostDetailPage() {
  const params = useParams<{ postId: string }>()
  const [post, setPost] = useState<FeedPost | null>(null)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    if (!params?.postId) return
    getPostById(params.postId).then(setPost)
  }, [params?.postId])

  if (!post) {
    return <main className="mx-auto max-w-5xl px-6 py-10">게시물을 불러오는 중입니다...</main>
  }

  return (
    <main className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 gap-6 px-6 py-10 lg:grid-cols-[1.2fr_1fr]">
      <section className="relative min-h-[360px] overflow-hidden rounded-xl border">
        <Image src={post.imageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
      </section>

      <section className="space-y-5 rounded-xl border p-5">
        <div>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-sm text-muted-foreground">@{post.username}</p>
        </div>

        <div className="rounded-lg bg-muted p-3 text-sm">
          <p className="font-medium">프롬프트</p>
          <p className="text-muted-foreground">{post.prompt}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              const updated = await togglePostLike(post.id)
              setPost(updated)
            }}
          >
            <Heart className={`mr-2 h-4 w-4 ${post.isLiked ? "fill-current text-red-500" : ""}`} />
            좋아요 {post.likes}
          </Button>
          <Button variant="outline" onClick={() => setShowComments(true)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            댓글 {post.comments}
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            공유
          </Button>
        </div>

        <Link href="/" className="inline-block text-sm text-primary hover:underline">
          메인 페이지로 돌아가기
        </Link>
      </section>

      <CommentsModal
        open={showComments}
        postId={post.id}
        postTitle={post.title}
        onClose={() => setShowComments(false)}
      />
    </main>
  )
}
