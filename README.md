# Google Calendar Clone

A fullstack calendar application built with React + Vite frontend and Node.js + MongoDB backend. Deployed on https://gcalendar-clone.vercel.app/

## Setup & Run Instructions

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one:
  - MongoDB Atlas (cloud, recommended) - [Sign up free](https://www.mongodb.com/cloud/atlas) [I used Atlas but Local works too, I tested]
  - Local MongoDB installation - [Download here](https://www.mongodb.com/try/download/community)

### Quick Start

**1. Clone the repository**
```bash
git clone https://github.com/Rajpragur/gcalendar_clone.git
cd calendar_clone
```

**2. Backend Setup:**
```bash
cd backend
npm install
```

**3. Configure MongoDB**

**Option A: MongoDB Atlas (Cloud - Recommended)**
```bash
# Copy the config file
cp config.env .env

# Edit .env and add your MongoDB Atlas URI:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/calendar_clone if not you can use my URI currently for testing - mongodb+srv://rajpragur:wNtc52os8w19j34k@cluster0.mgjrwnc.mongodb.net/calendar_clone?retryWrites=true&w=majority
# PORT=3000
```

**Option B: Local MongoDB**
```bash
# Edit .env
MONGODB_URI=mongodb://localhost:27017/calendar_clone
PORT=3000
```

**4. Start Backend:**
```bash
npm start  # Runs on http://localhost:3000
```

**5. Frontend Setup (in a new terminal):**
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

**6. Open browser:** http://localhost:5173

**Important:** Keep both terminals running! Backend (port 3000) and Frontend (port 5173).

### Getting MongoDB Atlas URI (for cloud option)
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user (remember username/password)
4. Get connection string: Cluster → Connect → Connect your application (Choose Node.js)
5. Copy the connection string to `.env` file
6. Also Go in Security -> Database & Network access -> Network access -> IP Access list add "Add current IP Address" as the IP address

## Architecture & Technology Choices

### Stack
- **Frontend**: React 18 + Vite (fast server), Tailwind CSS (rapid styling + ease of use)
- **Backend**: Node.js + Express (REST API), MongoDB + Mongoose (flexible schema)
- **Database**: MongoDB (works with both Atlas cloud and local MongoDB)

### Why These Technologies?
- **React + Vite**: Fast development, fast reload, modern
- **Tailwind CSS**: Write styles directly in JSX which makes it easy for me
- **MongoDB**: Works with both Atlas (cloud) and local MongoDB. Flexibility was my preference since we're only storing event data
- **Express**: Minimal, fast, perfect for REST APIs

### Architecture
```
User Browser (Frontend)
    ↓ HTTP requests
Express API (Backend)
    ↓ MongoDB queries
MongoDB (Atlas Cloud or Local)
```

**Frontend Structure:**
- `App.jsx` - Main component managing global state (events, selected date, view)
- `Calendar.jsx` - Router that renders Month/Week/Day/Year views
- View components (`MonthView.jsx`, `WeekView.jsx`, etc.) - Different calendar layouts
- `EventModal.jsx` - Card for creating/editing events (Re-used it for both)
- `services/api.js` - HTTP client abstraction

**Backend Structure:**
- `server.js` - Express server with REST endpoints for CRUD operations
- MongoDB schema for events with fields: title, description, start_time, end_time, all_day, color

## Business Logic & Edge Cases

### Event Validation
- **Time validation**: End time must be after start time
- **Required fields**: Title is required, all other fields are optional
- **Date handling**: All dates stored in UTC, displayed in local time

### All-Day Events
When "all day" is checked:
- Start time is set to 12:00 AM of selected day
- End time is set to 12:00 AM of next day (spans full 24 hours)
- Displayed differently in Day/Week views (spans full day at top)

### Calendar Views

**Month View:**
- Grid layout showing 6 weeks (includes previous/next month days)
- Shows first 3 events per day, "+X more" indicator for overflow
- Previous/next month dates are grayed out
- Today is highlighted with blue background

**Week View:**
- 7-column time grid (Sunday to Saturday)
- Events positioned by exact time using pixel calculations
- All-day events span from 0px to 1440px (24 hours)
- Click on time slot creates event at that time

**Day View:**
- Single day with hourly slots (12 AM to 11 PM)
- Similar to Week view but full-width
- Shows more event details

### Edge Cases Handled

1. **Date mutation**: Created new Date copies to prevent mutation issues when passing dates between components
2. **Event overflow**: Shows only first 3 events per day in Month view with overflow count
3. **Empty states**: Loading spinners while fetching and shown empty state messages when no events
4. **Error handling**: Try-catch blocks around all API calls with user-friendly error messages in console
5. **Route precedence**: DELETE /api/events must come before DELETE /api/events/:id in Express routes

### What I Didn't Implement (and Why)

- **Recurring events**: Too complex and wasn't mentioned in the document so limited myself on features.
- **Event conflicts**: No overlap detection - users can create overlapping events (just like Google Calendar allows)
- **Multi-user support**: No authentication - single user application (Authentication I was gonna add but time constraints)
- **Drag & drop**: Nice to have but not critical for core functionality
- **Importing National holidays from json file**: Time constraint again

## Animations & Interactions

I focused on making the UI feel smooth and responsive. Here's what I implemented:

### Modal Entrance
When you create or edit an event, the modal smoothly scales up and fades in over 0.2 seconds. I used CSS keyframes for this - it's that subtle zoom-in effect that makes the modal feel like it's emerging from the calendar.

```javascript
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### Loading States
While fetching events from the API, there's a spinning blue circle. Just a simple `animate-spin` class from Tailwind - nothing much but it does its work atleast.

### Button Feedback
All buttons have smooth color transitions on hover. The primary "Save" button goes from `bg-blue-600` to `bg-blue-700` when you hover. The active view button gets a blue background to show what's selected.

All animations are kept under 0.3 seconds - fast enough to feel responsive but slow enough to be noticeable.

## Future Enhancements

If I had more time, I wouldn't have dumped on the features I reached midway and would have worked more on :

### High Priority
1. **Recurring events** - Daily, weekly, monthly patterns with recurrence rules
2. **User authentication** - Multi-user support with JWT tokens or either Firebase (my preference)
3. **Drag & drop** - Move and resize events by dragging (Something fancy)
4. **Advanced search** - Search dates etc too or search events by their description
5. **Export/Import** - iCal and CSV format support
6. **Responsivity** - Make it better for phones etc.

### Technical Improvements I would work on
1. **Caching** - Redis for faster API responses
2. **TypeScript** - Type safety throughout the application

### Nice to Have too
- Calendar themes and customization for users
- Event attachments and notes or adding guests or meeting links etc.
- Mobile app (React Native)
- Keyboard shortcuts
- Email reminders for events

---

**Note**: This was built in 24 hours taking AI help obviously. It helped me a lot although after a certain point of time it gave up and had to pick up on my own. I have worked a lot on design especially to replicate it with the google calendar in design etc considering the point about focus on the replication. As while writing this I will try my best to deploy this for your testing if I make it on time otherwise setup part I have already written. I have also added one backend pinger through uptime robot which is pinging the backend deployed on render every 5 minutes to avoid inactivity of render backend.

## License
MIT License

## Repository
https://github.com/Rajpragur/gcalendar_clone# gcalendar_clone
