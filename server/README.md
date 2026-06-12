# InkSpire Server

Backend for the InkSpire mobile application.

## Tech Stack
- Node.js
- Express
- TypeScript
- Prisma ORM
- Socket.io

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   Copy `.env.example` to `.env` and update the values.
   ```bash
   cp .env.example .env
   ```

3. Setup Database:
   Ensure your database is running, then push the schema:
   ```bash
   npm run db:push
   ```

4. Run the server:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm start` - Run production server
- `npm run db:push` - Push Prisma schema changes to database
- `npm run db:studio` - Open Prisma Studio
