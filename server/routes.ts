import type { Express } from "express";
import { createServer, type Server } from "http";
import { sheetsService } from "./services/sheets";

export function registerRoutes(app: Express): Server {
  // Donations
  app.get('/api/donations', async (req, res) => {
    try {
      const donations = await sheetsService.getDonations();
      res.json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ message: 'Failed to fetch donations' });
    }
  });

  app.post('/api/donations', async (req, res) => {
    try {
      await sheetsService.addDonation(req.body);
      res.status(201).json({ message: 'Donation recorded successfully' });
    } catch (error) {
      console.error('Error adding donation:', error);
      res.status(500).json({ message: 'Failed to record donation' });
    }
  });

  // Charities
  app.get('/api/charities', async (req, res) => {
    try {
      const charities = await sheetsService.getCharities();
      res.json(charities);
    } catch (error) {
      console.error('Error fetching charities:', error);
      res.status(500).json({ message: 'Failed to fetch charities' });
    }
  });

  // User Profile
  app.get('/api/profile/:userId', async (req, res) => {
    try {
      const profile = await sheetsService.getUserProfile(req.params.userId);
      if (!profile) {
        res.status(404).json({ message: 'Profile not found' });
        return;
      }
      res.json(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  });

  app.patch('/api/profile/:userId', async (req, res) => {
    try {
      await sheetsService.updateUserProfile(req.params.userId, req.body);
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Failed to update user profile' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}