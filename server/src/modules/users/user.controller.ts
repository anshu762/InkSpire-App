import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UpdateProfileSchema } from './user.schema';

export class UserController {
  static async getMe(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await UserService.getMe(userId);
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const parsed = UpdateProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }

      const userId = req.user!.id;
      const user = await UserService.updateProfile(userId, parsed.data);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDiscoverFeed(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { cursor } = req.query;
      const feed = await UserService.getDiscoverFeed(userId, cursor as string);
      res.json(feed);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const profile = await UserService.getUserProfile(id as string);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async uploadAvatar(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const mockAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
      const user = await UserService.updateProfile(userId, { avatar: mockAvatarUrl } as any);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updatePushToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const userId = req.user!.id;
      await UserService.updatePushToken(userId, token);
      res.json({ success: true, message: 'Push token updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
