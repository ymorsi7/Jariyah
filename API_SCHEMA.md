# Jariyah API and Database Schema Documentation

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile_data JSONB
);
```

### Donations Table
```sql
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL NOT NULL,
  charity_id TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);
```

### Achievements Table
```sql
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);
```

## API Endpoints

### Authentication
```typescript
// Register User
POST /api/auth/register
Body: { username: string, password: string, email: string }
Response: { id: number, username: string }

// Login
POST /api/auth/login
Body: { username: string, password: string }
Response: { token: string }

// Logout
POST /api/auth/logout
Response: { message: string }
```

### User Profile
```typescript
// Get User Profile
GET /api/profile/:userId
Response: {
  id: number,
  username: string,
  email: string,
  donations: Donation[],
  achievements: Achievement[],
  stats: {
    totalDonated: number,
    donationCount: number,
    achievementCount: number
  }
}

// Update Profile
PATCH /api/profile/:userId
Body: Partial<UserProfile>
Response: { message: string }
```

### Donations
```typescript
// Get All Donations
GET /api/donations
Query: { 
  startDate?: string, 
  endDate?: string,
  charityId?: string
}
Response: Donation[]

// Add Donation
POST /api/donations
Body: {
  amount: number,
  charityId: string,
  metadata?: Record<string, any>
}
Response: { id: number, message: string }
```

### Charities
```typescript
// Get All Charities
GET /api/charities
Response: Charity[]

// Get Charity Details
GET /api/charities/:id
Response: Charity & {
  totalRaised: number,
  donorCount: number,
  recentDonations: Donation[]
}

// Get Recommended Charities
GET /api/charities/recommended
Query: { userId: string }
Response: (Charity & { matchScore: number })[]
```

### Achievements
```typescript
// Get User Achievements
GET /api/achievements/:userId
Response: Achievement[]

// Check Achievement Progress
GET /api/achievements/progress/:userId
Response: {
  current: Achievement[],
  upcoming: {
    badge: Badge,
    progress: number,
    requirement: number
  }[]
}
```

## Data Types

```typescript
interface UserProfile {
  id: number;
  username: string;
  email: string;
  donations: Donation[];
  achievements: Achievement[];
  preferences: {
    causes: string[];
    notificationPreferences: Record<string, boolean>;
  };
}

interface Donation {
  id: number;
  userId: number;
  amount: number;
  charityId: string;
  date: string;
  metadata?: {
    message?: string;
    isAnonymous?: boolean;
    category?: string;
  };
}

interface Charity {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  impact: {
    description: string;
    metrics: Array<{
      amount: number;
      impact: string;
    }>;
  };
  totalRaised: number;
  goal: number;
  tags: string[];
  causes: string[];
}

interface Achievement {
  id: number;
  userId: number;
  badgeId: string;
  earnedAt: string;
  metadata?: {
    level?: number;
    progress?: number;
    category?: string;
  };
}
```

## Error Responses

All API endpoints follow this error response format:
```typescript
interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Google Sheets Integration

The application uses Google Sheets as a flexible backend storage solution. Each table maps to a separate sheet:

1. "Donations" sheet: Stores all donation records
2. "Charities" sheet: Maintains charity information
3. "Users" sheet: Stores user profiles and preferences
4. "Achievements" sheet: Tracks user achievements and badges

This setup allows for easy data management and quick updates to business logic without requiring database migrations.
