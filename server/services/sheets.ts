import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { Charity, UserProfile, Donation } from '@/lib/types';

// Initialize Google Sheets client with proper error handling
const initializeSheets = async () => {
  try {
    if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY || !process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
      console.warn('Google Sheets credentials missing, falling back to mock data');
      return null;
    }

    const auth = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Failed to initialize Google Sheets:', error);
    return null;
  }
};

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

// Sheet names for different data types
const SHEETS = {
  DONATIONS: 'Donations',
  CHARITIES: 'Charities',
  USERS: 'Users',
  ACHIEVEMENTS: 'Achievements',
};

// Helper to convert row data to object
const rowToObject = <T>(headers: string[], row: any[]): T => {
  const obj: any = {};
  headers.forEach((header, index) => {
    try {
      obj[header] = JSON.parse(row[index]);
    } catch {
      obj[header] = row[index];
    }
  });
  return obj as T;
};

// Helper to convert object to row data
const objectToRow = (obj: any): any[] => {
  return Object.values(obj).map(value =>
    typeof value === 'object' ? JSON.stringify(value) : value
  );
};

export const sheetsService = {
  async getDonations(): Promise<Donation[]> {
    const sheets = await initializeSheets();
    if (!sheets || !SPREADSHEET_ID) {
      console.warn('Sheets service not initialized, returning empty donations array');
      return [];
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.DONATIONS}!A1:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) return [];

      const headers = rows[0];
      return rows.slice(1).map(row => rowToObject<Donation>(headers, row));
    } catch (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
  },

  async addDonation(donation: Donation): Promise<void> {
    const sheets = await initializeSheets();
    if (!sheets || !SPREADSHEET_ID) {
      console.warn('Sheets service not initialized, donation not saved');
      throw new Error('Google Sheets service not available');
    }

    try {
      const row = objectToRow(donation);
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.DONATIONS}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });
    } catch (error) {
      console.error('Error adding donation:', error);
      throw error;
    }
  },

  async getCharities(): Promise<Charity[]> {
    const sheets = await initializeSheets();
    if (!sheets || !SPREADSHEET_ID) {
      console.warn('Sheets service not initialized, returning empty charities array');
      return [];
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.CHARITIES}!A1:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) return [];

      const headers = rows[0];
      return rows.slice(1).map(row => rowToObject<Charity>(headers, row));
    } catch (error) {
      console.error('Error fetching charities:', error);
      return [];
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const sheets = await initializeSheets();
    if (!sheets || !SPREADSHEET_ID) {
      console.warn('Sheets service not initialized, returning null profile');
      return null;
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEETS.USERS}!A1:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) return null;

      const headers = rows[0];
      const users = rows.slice(1).map(row => rowToObject<UserProfile>(headers, row));
      return users.find(user => user.id === userId) || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    const sheets = await initializeSheets();
    if (!sheets || !SPREADSHEET_ID) {
      console.warn('Sheets service not initialized, profile not updated');
      throw new Error('Google Sheets service not available');
    }

    try {
      const existingProfile = await this.getUserProfile(userId);

      if (!existingProfile) {
        // Create new profile
        const row = objectToRow({ id: userId, ...profile });
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEETS.USERS}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [row],
          },
        });
      } else {
        // Update existing profile
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEETS.USERS}!A1:Z`,
        });

        const rows = response.data.values || [];
        const headers = rows[0];
        const rowIndex = rows.findIndex(row => {
          const user = rowToObject<UserProfile>(headers, row);
          return user.id === userId;
        });

        if (rowIndex > 0) {
          const updatedRow = objectToRow({
            ...existingProfile,
            ...profile,
            id: userId,
          });

          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEETS.USERS}!A${rowIndex + 1}`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [updatedRow],
            },
          });
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};