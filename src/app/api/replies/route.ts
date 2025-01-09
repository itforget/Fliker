import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, postId, authorId } = body;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Content cannot be empty' }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Author not found' }), { status: 404 });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: authorId } },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(reply), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create reply' }), { status: 500 });
  }
}

export async function GET() {
  try {
    const replies = await prisma.reply.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(replies), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch replies' }), { status: 500 });
  }
}
