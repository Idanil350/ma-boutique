import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Order from '@/models/Order'

function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `WIN-${year}-${random}`
}

export async function GET() {
  try {
    await dbConnect()
    const orders = await Order.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const orderNumber = generateOrderNumber()
    
    const order = await Order.create({
      ...body,
      orderNumber,
    })
    
    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error) {
    console.error('Erreur création commande:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}