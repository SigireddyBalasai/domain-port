import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { approveComment, deleteComment } from "@/lib/comment-db"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 })
  }

  await approveComment(numId)

  revalidatePath("/[locale]/blog/[slug]", "page")

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id)
  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 })
  }

  await deleteComment(numId)

  return NextResponse.json({ success: true })
}
