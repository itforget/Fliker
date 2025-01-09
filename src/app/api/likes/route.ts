import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, userId } = body;

    const like = await prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    return new Response(JSON.stringify(like), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create like', details: error }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
    }

    const like = await prisma.like.findUnique({
      where: { id: Number(id) },
    });

    if (!like) {
      return new Response(JSON.stringify({ error: 'Like not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(like), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch like', details: error }), { status: 500 });
  }
}
