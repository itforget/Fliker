import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, authorId } = body;

    const post = await prisma.post.create({
      data: {
        content,
        author: { connect: { id: authorId } },
      },
      include: {
        author: true,
        replies: true,
        likes: true,
      },
    });

    return new Response(JSON.stringify(post), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create post', details: error }), { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        likes: true,
      },
    });
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts', details: error }), { status: 500 });
  }
}
