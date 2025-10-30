import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongoose'
import Order from '@/models/Order'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `WIN-${year}-${random}`
}

export async function POST(request) {
  try {
    const { sessionId } = await request.json()

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      await dbConnect()

      const orderNumber = generateOrderNumber()

      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId)

      const order = await Order.create({
        orderNumber,
        customer: {
          name: session.metadata.customerName,
          phone: session.metadata.customerPhone,
          city: session.metadata.customerCity,
        },
        items: lineItems.data.map(item => ({
          name: item.description,
          price: item.amount_total / 100,
          quantity: item.quantity,
        })),
        totalAmount: session.amount_total / 100,
        currency: session.currency.toUpperCase(),
        status: 'paid',
        paymentMethod: 'stripe',
      })

      return NextResponse.json({ 
        success: true, 
        orderNumber: order.orderNumber 
      })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Paiement non confirmé' 
    }, { status: 400 })

  } catch (error) {
    console.error('Erreur vérification:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}