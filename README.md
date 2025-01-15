# Jariyah - Islamic Philanthropic Platform

Jariyah is a modern, user-centric Islamic philanthropic platform designed to streamline and inspire charitable giving through innovative technology and thoughtful design.

## Features

- 🌙 Modern Islamic-inspired UI design
- 💰 Comprehensive Zakat calculation
- 📊 Real-time donation tracking
- 📱 Responsive design
- 🌓 Dark mode support
- ✨ Manual and automated donation input systems
- 📈 Impact visualization
- 🎮 Gamification and achievement system
- ♿ Accessibility features
- 📱 Mobile-responsive interface

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (v15 or higher)
- Git

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd jariyah
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>

# Google Sheets Integration (Required for data storage)
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id

# Optional: Development Mode
NODE_ENV=development

# Application Port
PORT=5000
```

4. Set up Google Sheets Integration:
   1. Go to [Google Cloud Console](https://console.cloud.google.com)
   2. Create a new project or select an existing one
   3. Enable the Google Sheets API for your project
   4. Create a service account:
      - Navigate to "IAM & Admin" > "Service Accounts"
      - Click "Create Service Account"
      - Name your service account and grant it appropriate permissions
      - Create and download the JSON key file
   5. Create a new Google Sheet:
      - Create a new spreadsheet in Google Sheets
      - Share it with the service account email (with editor permissions)
      - Copy the spreadsheet ID from the URL (the long string between /d/ and /edit)
   6. Update your `.env` file with the credentials from the JSON key file

5. Set up the database:
```bash
# Create and configure the database
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to:
```
http://localhost:5000
```

## Project Structure

```
jariyah/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   └── ui/     # Shadcn UI components
│   │   ├── pages/      # Page components
│   │   ├── lib/        # Utilities and helpers
│   │   └── hooks/      # Custom React hooks
├── server/              # Backend Express server
│   ├── services/       # Backend services (Google Sheets, etc.)
│   ├── routes.ts       # API routes
│   └── index.ts        # Server entry point
└── db/                 # Database configuration and schemas
    ├── schema.ts       # Drizzle ORM schemas
    └── index.ts        # Database connection setup
```

## Available Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the application for production
- `npm run db:push`: Push database schema changes to the database
- `npm start`: Start the production server
- `npm run check`: Run TypeScript type checking

## Features

### Zakat Calculator
Calculate your Zakat based on various assets including:
- Cash and bank balances
- Gold and silver
- Investments and shares
- Business assets
- Other assets

### Manual Donation Input
Record external donations:
- One-time donations
- Recurring donations with frequency options
- Multiple categories support
- Historical tracking

### Portfolio Tracking
Monitor your charitable impact:
- Total donations overview
- Impact visualization
- Donation history
- Category-wise breakdown
- Achievement badges
- Donation tiers and milestones

### Accessibility Features
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- High contrast mode
- Semantic HTML structure
- Screen reader friendly content

## Development Guidelines

1. Code Style
   - Use TypeScript for type safety
   - Follow the existing project structure
   - Use shadcn/ui components for consistency

2. Database Changes
   - Always use Drizzle migrations
   - Never modify the database directly
   - Run `npm run db:push` after schema changes

3. Testing
   - Test across different devices and screen sizes
   - Verify accessibility with screen readers
   - Test keyboard navigation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)