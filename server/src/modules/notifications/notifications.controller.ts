import { Request, Response } from 'express';
import { NotificationsService } from './notifications.service';

export class NotificationsController {
  static async getNotifications(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await NotificationsService.getNotifications(req.user!.id, page, limit);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  static async getUnreadCount(req: Request, res: Response) {
    try {
      const count = await NotificationsService.getUnreadCount(req.user!.id);
      res.json({ success: true, data: { count } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const notification = await NotificationsService.markRead(req.params.id, req.user!.id);
      res.json({ success: true, data: notification });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  static async markAllRead(req: Request, res: Response) {
    try {
      const result = await NotificationsService.markAllRead(req.user!.id);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}
