"use client"

import { useEffect, useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { createComment, getComments, type Comment } from "@/lib/mock-data"

type CommentsModalProps = {
  open: boolean
  postId: string
  postTitle: string
  onClose: () => void
}

export function CommentsModal({ open, postId, postTitle, onClose }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")

  useEffect(() => {
    if (!open || !postId) return
    getComments(postId).then(setComments)
  }, [open, postId])

  useEffect(() => {
    if (!open) return

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  if (!open) return null

  const submitComment = async () => {
    if (!content.trim()) return
    const newComment = await createComment(postId, content.trim())
    setComments((prev) => [...prev, newComment])
    setContent("")
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4" onClick={onClose}>
      <div
        className="mx-auto mt-20 flex w-full max-w-lg flex-col gap-4 rounded-xl bg-background p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">댓글 - {postTitle}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>

        <div className="flex gap-2">
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void submitComment()
            }}
            placeholder="댓글을 입력해 주세요."
            className="h-10 flex-1 rounded-md border px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button onClick={() => void submitComment()} disabled={!content.trim()}>
            작성
          </Button>
        </div>

        <div className="max-h-72 space-y-3 overflow-y-auto rounded-md border p-3">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">첫 댓글을 작성해 보세요.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-1 border-b pb-2 last:border-none">
                <div className="text-sm font-medium">@{comment.author}</div>
                <p className="text-sm">{comment.content}</p>
                <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
