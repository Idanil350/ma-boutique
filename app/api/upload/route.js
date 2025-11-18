import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { writeFile } from 'fs/promises'
import path from 'path'

// Upload handler: use Cloudinary when configured, otherwise write to `public/images`.
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }

    const cloudinaryUrl = process.env.CLOUDINARY_URL
    // If Cloudinary configured, upload there
    if (cloudinaryUrl) {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const mime = file.type || 'application/octet-stream'
        const dataUri = `data:${mime};base64,${buffer.toString('base64')}`

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: process.env.CLOUDINARY_FOLDER || 'ma-boutique',
          resource_type: 'image'
        })

        return NextResponse.json({ success: true, url: uploadResult.secure_url })
      } catch (err) {
        console.error('Erreur upload Cloudinary:', err)
        // fallthrough to local write if cloudinary fails
      }
    }

    // Fallback: write file to public/images (works locally, not persistent on some hosts)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const filePath = path.join(process.cwd(), 'public', 'images', uniqueName)

    await writeFile(filePath, buffer)

    return NextResponse.json({ success: true, url: `/images/${uniqueName}` })
  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}