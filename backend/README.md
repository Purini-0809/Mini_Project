# Backend Services

This directory contains the Express.js backend server for the property valuation application.

## Structure

```
backend/
├── routes/               # API route handlers
│   └── property.js      # Property valuation endpoints
├── supabase/            # Supabase configuration (legacy)
├── server.js            # Main Express server
├── config.js            # Configuration settings
└── package.json         # Backend dependencies
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Start the production server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/property/estimate` - Calculate property valuation

## Configuration

The server runs on port 3001 by default. You can configure this in `config.js` or by setting the `PORT` environment variable.

## Development

The development server uses `nodemon` for automatic restarts when files change.

