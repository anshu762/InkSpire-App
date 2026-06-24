import { PrismaClient, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

// expo-server-sdk is ESM-only, so we must use a dynamic import() instead of
// a top-level require(). We lazily load it on first use to avoid the
// ERR_REQUIRE_ESM error when the compiled CJS bundle runs.
let _expo: any = null;
let _Expo: any = null;

async function getExpo() {
  if (!_expo) {
    const mod = await import('expo-server-sdk');
    _Expo = mod.Expo;
    _expo = new _Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  }
  return { expo: _expo, Expo: _Expo };
}

export class NotificationsService {
  static async getNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: [
          { isRead: 'asc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } })
    ]);

    return { notifications, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async markRead(notificationId: string, userId: string) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true }
    });
  }

  static async markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  static async createAndSend(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data: any = {},
    referenceId?: string
  ) {
    // 1. Create in database
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data ? JSON.parse(JSON.stringify(data)) : null,
        referenceId,
      }
    });

    // 2. Try pushing to Expo (using dynamic import to avoid ESM/CJS conflict)
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { expoPushToken: true } });
    
    if (user?.expoPushToken) {
      try {
        const { expo, Expo } = await getExpo();

        if (Expo.isExpoPushToken(user.expoPushToken)) {
          const message = {
            to: user.expoPushToken,
            sound: 'default',
            title,
            body,
            data: { ...data, notificationId: notification.id, type }
          };

          const tickets = await expo.sendPushNotificationsAsync([message]);
          
          // Handle potential errors like DeviceNotRegistered
          for (const ticket of tickets) {
            if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
              // Token is no longer valid, remove it
              await prisma.user.update({
                where: { id: userId },
                data: { expoPushToken: null }
              });
            }
          }
        }
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }

    return notification;
  }
}
