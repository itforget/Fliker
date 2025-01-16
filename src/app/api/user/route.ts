import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const user = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number }

    const userData = await prisma.user.findUnique({ where: { id: user.id } })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const { password, ...userWithoutPassword } = userData
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }
}