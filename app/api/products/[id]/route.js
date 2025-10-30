import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Product from '@/models/Product'

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const { id } = params
    const deletedProduct = await Product.findByIdAndDelete(id)
    
    if (!deletedProduct) {
      return NextResponse.json({ success: false, error: 'Produit non trouvé' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
 }
}