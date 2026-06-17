import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from '../modules/notifications/notifications.service';

const prisma = new PrismaClient();

export function setupCronJobs() {
  // 15-Min Event Warning (Runs every 5 minutes)
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const in15Mins = new Date(now.getTime() + 15 * 60000);
      
      // Look for events starting between 10 to 15 mins from now to avoid duplicates if cron drifts
      const upcomingEvents = await prisma.event.findMany({
        where: {
          startTime: {
            gte: new Date(now.getTime() + 10 * 60000),
            lte: in15Mins
          }
        },
        include: {
          participants: true
        }
      });

      for (const event of upcomingEvents) {
        for (const participant of event.participants) {
          // In a real app we would check if we already notified them about this event
          await NotificationsService.createAndSend(
            participant.userId,
            'EVENT_STARTING',
            'Sprint Starting Soon!',
            `${event.title} starts in 15 minutes. Get your workspace ready!`,
            { eventId: event.id },
            event.id
          );
        }
      }
    } catch (error) {
      console.error('Error in Event Warning Cron:', error);
    }
  });

  // Daily Writing Reminder (Runs at 8 PM everyday)
  // Simplified for a single timezone here. In prod, we'd group by user timezone.
  cron.schedule('0 20 * * *', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find users who haven't logged words today
      const usersWithoutLogs = await prisma.user.findMany({
        where: {
          writingLogs: {
            none: {
              date: { gte: today }
            }
          },
          isActive: true
        }
      });

      for (const user of usersWithoutLogs) {
        await NotificationsService.createAndSend(
          user.id,
          'DAILY_REMINDER',
          'Daily Writing Reminder ✍️',
          "You haven't logged any words today. Even 50 words count!",
          { screen: 'progress' }
        );
      }
    } catch (error) {
      console.error('Error in Daily Reminder Cron:', error);
    }
  });
}
