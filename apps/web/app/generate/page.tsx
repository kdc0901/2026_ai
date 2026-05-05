"use client"

import Link from "next/link"
import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@workspace/ui/components/button"

const styles = ["기본", "시네마틱", "수채화", "3D 렌더", "일러스트"]

function GeneratePageInner() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("prompt") ?? ""

  const [prompt, setPrompt] = useState(initialPrompt)
  const [style, setStyle] = useState(styles[0])
  const [isGenerating, setIsGenerating] = useState(false)

  const canGenerate = useMemo(() => prompt.trim().length > 0 && !isGenerating, [prompt, isGenerating])

  const handleGenerate = async () => {
    if (!canGenerate) return
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsGenerating(false)
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-5 px-6 py-10">
      <h1 className="text-2xl font-bold">이미지 생성</h1>

      <div className="space-y-4 rounded-xl border p-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">프롬프트</label>
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="원하는 이미지를 입력해 주세요."
            className="h-10 w-full rounded-md border px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">스타일</label>
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
          >
            {styles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={() => void handleGenerate()} disabled={!canGenerate}>
          {isGenerating ? "생성 중..." : "생성"}
        </Button>
      </div>

      {isGenerating ? (
        <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          이미지를 생성하고 있습니다...
        </div>
      ) : null}

      <Link href="/" className="text-sm text-primary hover:underline">
        메인 페이지로 돌아가기
      </Link>
    </main>
  )
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-5 px-6 py-10">
          <p className="text-muted-foreground">불러오는 중...</p>
        </main>
      }
    >
      <GeneratePageInner />
    </Suspense>
  )
}
