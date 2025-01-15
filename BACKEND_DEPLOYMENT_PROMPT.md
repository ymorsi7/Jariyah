# Task: Backend Implementation and Deployment Guide for Jariyah Platform

## Project Overview
Jariyah is an Islamic philanthropic platform that needs a robust backend implementation with Google Sheets integration. This guide covers both implementation and deployment steps.

## Technical Requirements

### 1. Backend Implementation

#### Google Sheets Integration
```typescript
// Required Environment Variables
GOOGLE_SHEETS_PRIVATE_KEY="your-private-key"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="spreadsheet-id-from-url"

// Required Sheet Structure
Sheets Required:
1. Donations
   - Columns: id, charityId, amount, date, isRecurring, frequency
2. Charities
   - Columns: id, name, description, category, imageUrl, impact, totalRaised, goal, tags, causes
3. Users
   - Columns: id, username, donations, totalDonated, impactMetrics, interests, preferredCauses, badges
4. Achievements
   - Columns: id, name, description, icon, category, requirement
```

#### API Implementation
1. Core Endpoints:
```typescript
// Required API Routes
GET /api/charities - List all charities
GET /api/charity/:id - Get charity details
GET /api/profile/:userId - Get user profile
POST /api/donations - Create donation
GET /api/donations/:userId - List user donations
```

2. Error Handling:
```typescript
// Error Response Format
{
  status: number,
  message: string,
  details?: any
}
```

### 2. Deployment Steps

#### Prerequisites
1. Google Cloud Project Setup:
   ```bash
   # Steps
   1. Create new project in Google Cloud Console
   2. Enable Google Sheets API
   3. Create Service Account
   4. Download credentials JSON
   5. Convert private key to environment variable format
   ```

2. Spreadsheet Setup:
   ```bash
   1. Create new Google Sheet
   2. Add required sheets (Donations, Charities, Users, Achievements)
   3. Add column headers
   4. Share with service account email
   5. Copy spreadsheet ID from URL
   ```

#### Environment Configuration
```env
# Required Environment Variables
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
NODE_ENV=production
PORT=5000
```

### 3. Security Considerations

1. Data Validation:
```typescript
// Example Zod Schema for Donation
const donationSchema = z.object({
  charityId: z.string(),
  amount: z.number().positive(),
  date: z.string().datetime(),
  isRecurring: z.boolean(),
  frequency: z.enum(['weekly', 'monthly', 'yearly']).optional()
});
```

2. Error Handling:
```typescript
// Example Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});
```

### 4. Testing Steps

1. Backend Verification:
```bash
# Test API Endpoints
curl -X GET http://localhost:5000/api/charities
curl -X GET http://localhost:5000/api/profile/default-user
curl -X POST http://localhost:5000/api/donations -d '{"charityId":"1","amount":100}'
```

2. Google Sheets Integration:
```typescript
// Test Sheet Operations
async function testSheetOperations() {
  // Test reading
  const charities = await sheetsService.getCharities();
  console.log('Charities:', charities);

  // Test writing
  await sheetsService.addDonation({
    id: 'test-1',
    charityId: '1',
    amount: 100,
    date: new Date().toISOString(),
    isRecurring: false
  });
}
```

### 5. Monitoring and Maintenance

1. Error Logging:
```typescript
// Example Logging Setup
const log = (message: string, level: 'info' | 'error' = 'info') => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level}] ${message}`);
};
```

2. Performance Monitoring:
```typescript
// Example Response Time Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});
```

## Success Criteria
1. All API endpoints return correct data
2. Google Sheets integration works without errors
3. Error handling catches and reports issues properly
4. Response times under 1000ms for all endpoints
5. No data corruption or loss during operations

## Common Issues and Solutions
1. Google Sheets API Rate Limits:
   - Implement caching
   - Batch operations when possible
   - Use exponential backoff for retries

2. Data Consistency:
   - Validate data before writing
   - Implement rollback mechanisms
   - Regular data audits

3. Performance:
   - Cache frequently accessed data
   - Optimize query patterns
   - Implement request batching

Remember to maintain proper error handling and logging throughout the implementation to ensure a stable and maintainable system.
