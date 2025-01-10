import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return new Response(JSON.stringify({ error: 'Token is required' }), { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const {password, ...userWithoutPassword } = user;
    return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
    } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token', details: (error as Error).message }), { status: 401 });
    }
  }
