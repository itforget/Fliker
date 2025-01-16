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

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { 
        authorId: true 
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (post && user) {
      await prisma.notification.create({
        data: {
          type: 'like',
          message: `${user.name} curtiu sua publicação.`,
          userId: post.authorId,
        },
      });
    }

    return new Response(JSON.stringify(like), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create like', details: error }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), { status: 400 });
    }

    const likes = await prisma.like.findMany({
      where: { postId: Number(postId) },
      include: {
        user: {
          select: {
            name: true, 
          },
        },
      },
    });

    return new Response(JSON.stringify(likes), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch likes', details: error }), { status: 500 });
  }
}
