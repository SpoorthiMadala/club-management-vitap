# Club Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing clubs, members, and events with email verification.

## Features

### For Clubs
- 🔐 **Secure Registration** - Sign up with email verification via OTP (10-minute expiration)
- 👥 **Member Management** - Add and remove club members with roles
- 📅 **Event Management** - Create and manage events with Google Form integration
- ✏️ **Profile Management** - Update club description and information
- 🎯 **Dashboard** - Comprehensive dashboard for managing all club activities

### For Public Users
- 🏛️ **Browse Clubs** - View all registered clubs and their details
- 📆 **Discover Events** - See upcoming and ongoing events from all clubs
- 📝 **Event Registration** - Register for events via Google Forms
- 🔍 **Detailed Views** - Access detailed information about clubs and events

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service for OTP
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Google Fonts (Inter)** - Typography

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Email service credentials (Gmail, SendGrid, etc.)

## Installation

### 1. Clone the repository
```bash
cd club-management
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/club-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Note for Gmail users**: You need to generate an App Password:
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use this password in `EMAIL_PASSWORD`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## Usage Guide

### For Clubs

1. **Sign Up**
   - Click "Sign Up" in the navbar
   - Fill in club name, description, email, and password
   - Check your email for the 6-digit OTP
   - Enter OTP to verify (valid for 10 minutes)
   - You'll be automatically logged in after verification

2. **Manage Members**
   - Go to Dashboard → Members tab
   - Click "Add Member" and enter name, role, and email
   - Delete members using the trash icon

3. **Manage Events**
   - Go to Dashboard → Events tab
   - Click "Add Event" and fill in event details
   - Include Google Form link for registrations
   - Delete events using the trash icon

4. **Update Profile**
   - Go to Dashboard → Profile tab
   - Click "Edit Profile" to update description
   - Save changes

### For Public Users

1. **Browse Clubs**
   - View all clubs on the landing page
   - Click on any club card to see details
   - View members and events for each club

2. **Discover Events**
   - Switch to "Upcoming Events" tab on landing page
   - Click on event cards to see full details
   - Click "Register Now" to access Google Form

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register new club
- `POST /verify-otp` - Verify email with OTP
- `POST /resend-otp` - Resend OTP
- `POST /login` - Club login

### Club Routes (`/api/club`) - Protected
- `GET /profile` - Get club profile
- `PUT /profile` - Update club description
- `POST /members` - Add member
- `DELETE /members/:memberId` - Delete member
- `POST /events` - Add event
- `DELETE /events/:eventId` - Delete event

### Public Routes (`/api/public`)
- `GET /clubs` - Get all clubs
- `GET /clubs/:clubId` - Get club details
- `GET /events` - Get all upcoming events
- `GET /events/:clubId/:eventId` - Get event details

## Project Structure

```
club-management/
├── backend/
│   ├── models/
│   │   ├── Club.js
│   │   └── OTP.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── club.js
│   │   └── public.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── emailService.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── ClubDashboard.jsx
│   │   │   ├── ClubDetails.jsx
│   │   │   └── EventDetails.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

## Features in Detail

### Email Verification
- OTP sent via email upon registration
- 6-digit code valid for 10 minutes
- Automatic cleanup of expired OTPs
- Resend OTP functionality

### Security
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes for club operations
- Input validation on all endpoints

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Smooth animations and transitions
- Glass morphism effects
- Custom color gradients

## Troubleshooting

### Email not sending
- Verify EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASSWORD in `.env`
- For Gmail, ensure you're using an App Password, not your regular password
- Check if 2FA is enabled on your email account

### MongoDB connection error
- Ensure MongoDB is running locally or check Atlas connection string
- Verify MONGODB_URI in `.env`

### Port already in use
- Change PORT in backend `.env`
- Update proxy in frontend `vite.config.js`

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
