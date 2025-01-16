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

    const comment = await prisma.comment.create({
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

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (post) {
      const notification = await prisma.notification.create({
        data: {
          message: `Seu post recebeu um novo comentário!`,
          userId: post.authorId, 
          type: 'comment', 
        },
      });
    }

    return new Response(JSON.stringify(comment), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to create a comment' }), { status: 500 });
  }
}

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), { status: 500 });
  }
}
