import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Créer un nom unique pour le fichier
    const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const filePath = path.join(process.cwd(), 'public', 'images', uniqueName)

    // Sauvegarder le fichier
    await writeFile(filePath, buffer)

    // Retourner l'URL relative
    return NextResponse.json({ 
      success: true, 
      url: `/images/${uniqueName}` 
    })

  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}