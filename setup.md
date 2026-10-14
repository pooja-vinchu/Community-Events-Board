# Quick Setup Guide

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/community-events
JWT_SECRET=your-secret-key-change-in-production
ADMIN_EMAIL=admin@events.com
ADMIN_PASSWORD=admin123
```

Start backend:

```bash
npm run dev
```

### 2. Frontend Setup

Open new terminal:

```bash
cd frontend
npm install
```

Create `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 4. Admin Credentials

- Email: admin@events.com
- Password: admin123

## Features Implemented

✅ Admin Panel

- Login with hardcoded credentials
- Create events with all fields
- Edit events
- Toggle active/inactive status
- View all events with filters

✅ Visitor Features

- Browse active upcoming events
- Filter by category, city, and text search
- Pagination (10 items per page)
- User signup and login with JWT
- Select favorite categories
- Personalized feed based on categories
- Remind me button with optimistic UI
- Event card designer with 3 themes and 5 stickers
- Design saved per user per event

✅ Quality Features

- Fully responsive (mobile and desktop)
- Indian price format (₹1,50,000)
- Friendly date format ("Sat, 18 Oct, 6:30 PM")
- Loading states
- Empty states with helpful messages
- Error states with user-friendly messages
- Smooth animations on card design
- 15 sample events seeded automatically

## Sample Data

The backend automatically seeds 15 sample events on first run:

- Mix of active and inactive events
- Mix of past and upcoming events
- Different categories: Music, Workshop, Food, Sports, Kids
- Different cities: Chennai, Bangalore, Mumbai, Delhi, Pune, Coimbatore, Hyderabad

## API Testing

You can test the API using tools like Postman or curl:

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/events
```
