import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "submissions/" })

    // Filter only submission.json files to get unique submissions
    const submissionBlobs = blobs.filter((b) => b.pathname.endsWith("submission.json"))

    const submissions = await Promise.all(
      submissionBlobs.map(async (blob) => {
        const res = await fetch(blob.url)
        return res.json()
      })
    )

    // Sort by timestamp descending (newest first)
    submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ submissions, total: submissions.length })
  } catch (error) {
    console.error("Error listing submissions:", error)
    return NextResponse.json({ error: "Failed to list submissions" }, { status: 500 })
  }
}
