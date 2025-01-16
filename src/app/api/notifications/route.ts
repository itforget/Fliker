import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');  

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },  
    });

    return new Response(JSON.stringify(notifications), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch notifications' }), { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return new Response(JSON.stringify({ error: 'Notification ID is required' }), { status: 400 });
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return new Response(JSON.stringify(notification), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update notification', details: error }), { status: 500 });
  }
}

export async function DELETE() {
  try {
    const deletedNotifications = await prisma.notification.deleteMany({
      where: { read: true },
    });

    return new Response(
      JSON.stringify({ message: `${deletedNotifications.count} notifications deleted.` }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete notifications', details: error }), { status: 500 });
  }
}
