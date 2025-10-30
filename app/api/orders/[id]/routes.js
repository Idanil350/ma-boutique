import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Order from '@/models/Order'

export async function PATCH(request, { params }) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()
    
    const order = await Order.findByIdAndUpdate(id, body, { new: true })
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Commande non trouvée' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
    const { id } = params
    
    const order = await Order.findByIdAndDelete(id)
    
    if (!order) {
      return NextResponse.json({ success: false, error: 'Commande non trouvée' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}