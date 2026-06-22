import { PrismaClient, NotificationType } from '@prisma/client';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const prisma = new PrismaClient();
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN }); // accessToken is optional but recommended

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

    // 2. Try pushing to Expo
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { expoPushToken: true } });
    
    if (user?.expoPushToken && Expo.isExpoPushToken(user.expoPushToken)) {
      const message: ExpoPushMessage = {
        to: user.expoPushToken,
        sound: 'default',
        title,
        body,
        data: { ...data, notificationId: notification.id, type }
      };

      try {
        const tickets = await expo.sendPushNotificationsAsync([message]);
        
        // Handle potential errors like DeviceNotRegistered
        for (let ticket of tickets) {
          if (ticket.status === 'error' && ticket.details?.error === 'DeviceNotRegistered') {
            // Token is no longer valid, remove it
            await prisma.user.update({
              where: { id: userId },
              data: { expoPushToken: null }
            });
          }
        }
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }

    return notification;
  }
}
