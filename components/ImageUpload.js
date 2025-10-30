'use client'
import { useState } from 'react'
import { Upload, X, Check } from 'lucide-react'
import Image from 'next/image'

export default function ImageUpload({ onImageUploaded, currentImage }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || null)
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide')
      return
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 10MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      // Créer FormData pour l'upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload vers notre API locale
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setPreview(data.url)
        onImageUploaded(data.url)
      } else {
        setError('Erreur lors de l\'upload: ' + data.error)
      }
    } catch (err) {
      setError('Erreur lors de l\'upload: ' + err.message)
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageUploaded('')
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Image du produit *
      </label>

      {preview ? (
        <div className="relative w-full h-80 bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain p-4"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition z-10"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full flex items-center space-x-2 z-10">
            <Check className="h-4 w-4" />
            <span className="text-sm">Image uploadée</span>
          </div>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition bg-gray-50 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4"></div>
                <p className="text-gray-600">Upload en cours...</p>
              </div>
            ) : (
              <div className="text-center p-6">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">Cliquez pour uploader une image</p>
                <p className="text-sm text-gray-400 mb-2">PNG, JPG, WEBP (max 10MB)</p>
                <p className="text-xs text-gray-500">L'image sera sauvegardée dans public/images/</p>
                <p className="text-xs text-green-600 mt-2">💡 Conseil: Utilisez des images carrées pour un meilleur rendu</p>
              </div>
            )}
          </label>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  )
}