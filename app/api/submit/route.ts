import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

// Allow uploads up to 50MB
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const info = formData.get("info") as string
    const consent = formData.get("consent") as string

    if (!name || !email || consent !== "true") {
      return NextResponse.json(
        { error: "Bitte f\u00FCllen Sie alle Pflichtfelder aus und best\u00E4tigen Sie die Einwilligung." },
        { status: 400 }
      )
    }

    const timestamp = new Date().toISOString()
    const submissionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const folder = `submissions/${submissionId}`

    // Upload each file to Vercel Blob
    const files = formData.getAll("files") as File[]
    const uploadedFiles: { name: string; url: string; size: number }[] = []

    for (const file of files) {
      if (file.size > 0) {
        const blob = await put(`${folder}/${file.name}`, file, {
          access: "public",
        })
        uploadedFiles.push({
          name: file.name,
          url: blob.url,
          size: file.size,
        })
      }
    }

    // Store submission metadata as a JSON file in Blob
    const submission = {
      id: submissionId,
      timestamp,
      name,
      email,
      info: info || "",
      consent: true,
      files: uploadedFiles,
    }

    await put(
      `${folder}/submission.json`,
      JSON.stringify(submission, null, 2),
      { access: "public", contentType: "application/json" }
    )

    return NextResponse.json({
      success: true,
      message: "Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet.",
      filesUploaded: uploadedFiles.length,
    })
  } catch (error) {
    console.error("Form submission error:", error)
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut." },
      { status: 500 }
    )
  }
}
