# Community Events Board

A full-stack application for managing and browsing local community events with admin panel and visitor features.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, MongoDB, JWT authentication
- **Database**: MongoDB

## Project Structure

```
/frontend - Next.js application (Admin + Visitor pages)
/backend  - Node.js Express API server
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas connection string)

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
npm install
```

2. Create `.env` file in backend folder:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/community-events
JWT_SECRET=your-secret-key-change-in-production
ADMIN_EMAIL=admin@events.com
ADMIN_PASSWORD=admin123
```

3. Start the backend server:

```bash
npm run dev
```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
npm install
```

2. Create `.env.local` file in frontend folder:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Start the frontend:

```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Admin Login Credentials

- **Email**: admin@events.com
- **Password**: admin123

## API Endpoints

### Authentication

- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login

### Events (Admin)

- `POST /api/admin/events` - Create event (Protected)
- `PUT /api/admin/events/:id` - Update event (Protected)
- `PATCH /api/admin/events/:id/status` - Toggle active status (Protected)

### Events (Public)

- `GET /api/events` - Get active upcoming events (with filters, pagination)
- `GET /api/events/:id` - Get single event

### User

- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/categories` - Update favorite categories (Protected)
- `GET /api/user/feed` - Get personalized feed (Protected)
- `POST /api/user/reminders/:eventId` - Toggle event reminder (Protected)
- `GET /api/user/reminders` - Get user reminders (Protected)

### Event Card Design

- `GET /api/events/:eventId/card-design` - Get card design for event (Protected)
- `POST /api/events/:eventId/card-design` - Save card design (Protected)

## Database Structure

### Collections

**users**

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  favoriteCategories: [String],
  reminders: [ObjectId] (references events),
  createdAt: Date
}
```

**events**

```javascript
{
  _id: ObjectId,
  title: String (indexed),
  category: String (indexed),
  city: String (indexed),
  dateTime: Date (indexed),
  price: Number,
  description: String,
  imageUrl: String,
  isActive: Boolean (indexed),
  createdAt: Date,
  updatedAt: Date
}
```

**cardDesigns**

```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  eventId: ObjectId (indexed),
  theme: String,
  stickers: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Why this design?**

- Separate collections for clean separation of concerns
- User reminders stored as array of event IDs for quick lookup and to avoid join complexity
- Card designs in separate collection to avoid bloating event documents and allow per-user customization
- Indexes on frequently queried fields (email, category, city, dateTime, isActive) for performance

## Filter Query Implementation

The filter query uses MongoDB aggregation with the following logic:

```javascript
const query = {
  isActive: true,
  dateTime: { $gte: new Date() },
};

if (category) query.category = category;
if (city) query.city = new RegExp(city, "i");
if (search) {
  query.$or = [
    { title: new RegExp(search, "i") },
    { description: new RegExp(search, "i") },
  ];
}
```

All filters work together through MongoDB's query object. Text search uses case-insensitive regex across title and description fields.

**Recommended Index:**

```javascript
db.events.createIndex({
  category: 1,
  city: 1,
  isActive: 1,
  dateTime: 1,
});
db.events.createIndex({
  title: "text",
  description: "text",
});
```

This compound index supports all filter combinations efficiently. Text index enables full-text search on title and description.

## Password Storage and Protection

**Password Storage:**

- Passwords are hashed using bcrypt with 10 salt rounds before storing
- Plain text passwords are never stored in the database
- bcrypt automatically handles salting and is resistant to rainbow table attacks

**Admin Protection:**

- Admin routes protected by JWT middleware that verifies token and checks admin status
- Admin authentication requires matching hardcoded credentials (can be moved to env variables)
- All admin API endpoints use `authenticateAdmin` middleware

**User Protection:**

- User routes protected by JWT middleware that verifies token validity
- JWT tokens include user ID and expire after 7 days
- Tokens sent in Authorization header as Bearer token
- Middleware extracts and verifies token, attaching user to request object

## What's Implemented

✅ Admin login with hardcoded credentials
✅ Admin can add events with all required fields
✅ Admin can toggle event active/inactive status
✅ Events page showing active upcoming events, sorted by date
✅ Filters: category, city, text search (work together)
✅ Pagination (10 events per page)
✅ User signup and login with JWT
✅ User can select favorite categories
✅ My Feed page showing events from favorite categories
✅ Remind me button with optimistic UI and error handling
✅ Event card designer with 3 themes and 5 stickers
✅ Card design saved per user per event
✅ Smooth animations on card updates
✅ All pages responsive (mobile and desktop)
✅ Indian price format (₹1,50,000)
✅ Friendly date format ("Sat, 18 Oct, 6:30 PM")
✅ Loading, empty, and error states
✅ 15 sample events seeded on first run
✅ Consistent design system with Tailwind

## AI Tool Usage

No AI code generation tools were used in this project. All code was written manually.

## Notes

- Sample events are automatically seeded when the backend starts if the database is empty
- The app uses JWT tokens stored in localStorage for authentication
- All API calls go through the Next.js app to the Node.js backend
- Error messages are user-friendly and show appropriate feedback
- The design uses a blue color scheme with consistent spacing and typography
