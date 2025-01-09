import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const body = await req.json();
  const { action, email, password, name } = body;

  if (action === 'register') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, name, password: hashedPassword },
      });
      return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to register user', details: error }), { status: 500 });
    }
  } else if (action === 'login') {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET);
        return new Response(JSON.stringify({ token }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
      }
    } catch (error) {
      console.error('Login error:', error); 
      return new Response(JSON.stringify({ error: 'Failed to authenticate' }), { status: 500 });
    }
    
  } else {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
}
