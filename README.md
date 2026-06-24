# Uber Clone - Full Stack Application

A comprehensive ride-sharing application built with modern web technologies. Features real-time tracking, user and captain authentication, ride management, and interactive mapping.

## 🚀 Live Demo

**🌐 Frontend (User Interface):** [https://uberr-nine.vercel.app/](https://uberr-nine.vercel.app/)  
**🔧 Backend (API Server):** [https://uberr-wysl.onrender.com/](https://uberr-wysl.onrender.com/)

> **📱 Important:** For the best experience, please view the application in **mobile screen size** or use your browser's device simulation mode (F12 → Toggle Device Toolbar). The app is optimized for mobile-first design.

---

## Table of Contents
- [Live Demo](#-live-demo)
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Backend Documentation](#backend-documentation)
- [Frontend Documentation](#frontend-documentation)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Real-Time Communication](#real-time-communication)
- [Deployment](#-deployment)
- [Contributing](#contributing)

---

## Project Overview

This is a full-stack Uber clone application that allows:
- **Users** to book rides and track drivers in real-time
- **Captains** to accept ride requests and complete trips
- **Real-time updates** via WebSocket connections
- **Authentication & Authorization** with JWT tokens
- **Interactive mapping** with Leaflet for live tracking

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5.2
- **Database:** MongoDB + Mongoose 9.3
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.io 4.8
- **Validation:** express-validator
- **Dev Tools:** Nodemon

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM 7
- **Real-time:** Socket.io-client 4.8
- **Maps:** Leaflet + React-Leaflet
- **Animations:** GSAP 3.14
- **HTTP Client:** Axios
- **State Management:** React Context

---

## Project Structure

```
Uber/
├── Backend/
│   ├── controllers/          # Business logic layer
│   │   ├── user.controller.js
│   │   ├── captain.controller.js
│   │   ├── ride.controller.js
│   │   └── map.controller.js
│   ├── models/               # Database schemas
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   ├── ride.model.js
│   │   └── blacklist.model.js
│   ├── routes/               # API endpoints
│   │   ├── user.routes.js
│   │   ├── captain.route.js
│   │   ├── ride.routes.js
│   │   └── maps.route.js
│   ├── services/             # Business services
│   ├── middleware/           # Auth & request handlers
│   │   └── auth.middleware.js
│   ├── db/                   # Database connection
│   ├── app.js                # Express app setup
│   ├── server.js             # Server entry point
│   ├── socket.js             # Socket.io configuration
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── LocationSearchPanel.jsx
│   │   │   ├── VehiclePanel.jsx
│   │   │   ├── ConfirmRidePopup.jsx
│   │   │   ├── RidePopUp.jsx
│   │   │   ├── CaptainDetails.jsx
│   │   │   ├── ConfirmedRide.jsx
│   │   │   ├── liveTracking.jsx
│   │   │   ├── WaitingforDriver.jsx
│   │   │   ├── LookingforDriver.jsx
│   │   │   └── FinishRide.jsx
│   │   ├── pages/            # Route pages
│   │   │   ├── Start.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── UserSignup.jsx
│   │   │   ├── CaptainLogin.jsx
│   │   │   ├── CaptainSignup.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── CaptainHome.jsx
│   │   │   ├── Riding.jsx
│   │   │   ├── CaptainRiding.jsx
│   │   │   ├── UserLogout.jsx
│   │   │   └── CaptainLogout.jsx
│   │   ├── context/          # Global state management
│   │   │   ├── UserContext.jsx
│   │   │   ├── CaptainContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── eslint.config.js
│
└── package.json (root)
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Create .env file in Backend directory
echo MONGODB_URI=your_mongodb_connection_string > .env
echo JWT_SECRET=your_secret_key >> .env
echo PORT=4000 >> .env

# Start the server
npm run dev  # Development mode with nodemon
# OR
npm start   # Production mode
```

**Backend runs on:** `http://localhost:4000`

### Frontend Setup

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

**Frontend runs on:** `http://localhost:5173`

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/uberdatabase
JWT_SECRET=your_jwt_secret_key
PORT=4000
SOCKET_PORT=4000
```

---

## Backend Documentation

### Authentication Flow

#### User Registration
```
POST /users/register
```
**Request Body:**
```json
{
  "Fullname": {
    "Firstname": "John",
    "Lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```
**Validations:**
- Firstname: minimum 3 characters
- Email: valid email format
- Password: minimum 6 characters

#### User Login
```
POST /users/Login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Captain Registration
```
POST /captains/register
```
**Request Body:**
```json
{
  "Fullname": {
    "Firstname": "Jane",
    "Lastname": "Smith"
  },
  "email": "jane@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```
**Vehicle Types:** `car`, `motorcycle`, `auto`

#### Captain Login
```
POST /captains/login
```
**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

### Protected Routes

#### Get User Profile
```
GET /users/profile
```
**Headers:** `Authorization: Bearer <token>`

#### Get Captain Profile
```
GET /captains/profile
```
**Headers:** `Authorization: Bearer <token>`

#### User Logout
```
POST /users/logout
```
**Headers:** `Authorization: Bearer <token>`

#### Captain Logout
```
POST /captains/logout
```
**Headers:** `Authorization: Bearer <token>`

### Ride Management Routes

#### Create Ride
```
POST /rides/create
```

#### Accept Ride
```
POST /rides/accept
```

#### Start Ride
```
POST /rides/start
```

#### End Ride
```
POST /rides/end
```

### Maps Routes

#### Get Coordinates
```
GET /maps/get-coordinates
```

#### Get Distance & Time
```
GET /maps/get-distance-time
```

#### Get Suggestions
```
GET /maps/get-suggestions
```

---

## Frontend Documentation

## Frontend Documentation

### User Routes

#### `/` — Start Page
- **Component:** `pages/Start.jsx`
- **Auth Required:** No
- **Features:**
  - Hero landing page with Uber logo
  - "Get Started" button navigation
  - Responsive design

#### `/login` — User Login
- **Component:** `pages/UserLogin.jsx`
- **Auth Required:** No
- **Fields:**
  - Email (required)
  - Password (required, min 6 chars)
- **Navigation:**
  - New user → `/signup`
  - Sign as Captain → `/captain-login`

#### `/signup` — User Registration
- **Component:** `pages/UserSignup.jsx`
- **Auth Required:** No
- **Fields:**
  - First Name (required, min 3 chars)
  - Last Name (optional)
  - Email (required)
  - Password (required, min 6 chars)
- **Navigation:**
  - Existing user → `/login`

#### `/home` — User Home (Main Booking Interface)
- **Component:** `pages/Home.jsx`
- **Auth Required:** Yes (UserProtectedWrapper)
- **Features:**
  - Interactive map with Leaflet
  - Location search panel
  - Vehicle type selection
  - Real-time ride booking
  - WebSocket connection for live updates
  - GSAP animations for smooth transitions

#### `/riding` — Active Ride (User)
- **Component:** `pages/Riding.jsx`
- **Auth Required:** Yes
- **Shows:**
  - Driver information
  - Vehicle details (license plate, model)
  - Live tracking map
  - Fare information
  - ETA to destination

#### `/users/logout` — User Logout
- **Component:** `pages/UserLogout.jsx`
- **Auth Required:** Yes
- **Action:** Clears auth tokens and redirects to `/login`

### Captain Routes

#### `/captain-login` — Captain Login
- **Component:** `pages/CaptainLogin.jsx`
- **Auth Required:** No
- **Fields:**
  - Email (required)
  - Password (required)
- **Navigation:**
  - New captain → `/captain-signup`
  - Sign as User → `/login`

#### `/captain-signup` — Captain Registration
- **Component:** `pages/CaptainSignup.jsx`
- **Auth Required:** No
- **Fields:**
  - First Name (required, min 3 chars)
  - Last Name (optional)
  - Email (required)
  - Password (required, min 6 chars)
  - Vehicle info (color, plate, capacity, type)
- **Navigation:**
  - Existing captain → `/captain-login`

#### `/captain-home` — Captain Dashboard
- **Component:** `pages/CaptainHome.jsx`
- **Auth Required:** Yes (CaptainProtectedWrapper)
- **Features:**
  - Online/offline status toggle
  - Incoming ride requests
  - Real-time geolocation tracking
  - Socket.io event listeners for ride requests
  - Map view with current location

#### `/captain-riding` — Active Ride (Captain)
- **Component:** `pages/CaptainRiding.jsx`
- **Auth Required:** Yes
- **Shows:**
  - Drop-off passenger details
  - Distance to destination
  - Live tracking map
  - Route navigation
  - Finish ride button

#### `/captains/logout` — Captain Logout
- **Component:** `pages/CaptainLogout.jsx`
- **Auth Required:** Yes
- **Action:** Clears auth tokens and redirects to `/captain-login`

### Context Providers

#### UserContext
- Manages user authentication state
- Stores user data and tokens
- Provides auth methods

#### CaptainContext
- Manages captain authentication state
- Stores captain profile and vehicle info
- Handles captain-specific operations

#### SocketContext
- Manages Socket.io connections
- Handles real-time events
- Broadcasts location updates

---

## API Endpoints

### User Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | No | Register new user |
| POST | `/users/Login` | No | Login user |
| GET | `/users/profile` | Yes | Get user profile |
| POST | `/users/logout` | Yes | Logout user |

### Captain Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/captains/register` | No | Register new captain |
| POST | `/captains/login` | No | Login captain |
| GET | `/captains/profile` | Yes | Get captain profile |
| POST | `/captains/logout` | Yes | Logout captain |

### Ride Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/rides/create` | Yes | Create new ride |
| POST | `/rides/accept` | Yes | Accept ride request |
| POST | `/rides/start` | Yes | Start ride |
| POST | `/rides/end` | Yes | End ride |

### Maps Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/maps/get-coordinates` | Yes | Get location coordinates |
| GET | `/maps/get-distance-time` | Yes | Get distance & time between locations |
| GET | `/maps/get-suggestions` | Yes | Get location suggestions |

---

## Features

### User Features
- ✅ User registration and authentication
- ✅ Real-time ride booking
- ✅ Location search with suggestions
- ✅ Vehicle type selection (Car, Motorcycle, Auto)
- ✅ Live driver tracking
- ✅ Fare estimation
- ✅ Ride history
- ✅ Secure logout

### Captain Features
- ✅ Captain registration with vehicle details
- ✅ Online/offline status management
- ✅ Real-time ride request notifications
- ✅ Accept/reject ride requests
- ✅ Live location tracking
- ✅ Route optimization
- ✅ Ride completion
- ✅ Secure logout

### Common Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Email validation
- ✅ Input validation using express-validator
- ✅ Error handling & logging
- ✅ Responsive mobile-first UI
- ✅ Real-time updates with Socket.io
- ✅ Interactive mapping with Leaflet

---

## Real-Time Communication

### Socket.io Events

#### Client to Server
- `ride-request` - Send ride request to captains
- `update-location` - Update captain's current location
- `ride-accepted` - Confirm ride acceptance
- `ride-started` - Notify ride has started
- `ride-completed` - Notify ride completion

#### Server to Client
- `ride-request-received` - Notify captain of new ride
- `captain-location-updated` - Update user with driver location
- `ride-accepted` - Confirm ride was accepted
- `ride-started` - Notify ride has started
- `ride-completed` - Notify ride completion

---

## Authentication & Security

### Password Security
- Passwords are hashed using bcrypt (10 salt rounds)
- Never stored in plain text
- Validated on both frontend and backend

### JWT Tokens
- Tokens stored in cookies and localStorage
- Auto-included in Authorization headers
- Verified on protected routes

### Input Validation
- Email format validation
- Password strength requirements (min 6 characters)
- Name field length validation
- Vehicle information validation

---

## Database Models

### User Model
```javascript
{
  Fullname: { Firstname, Lastname },
  email: String (unique),
  password: String (hashed),
  createdAt: Timestamp
}
```

### Captain Model
```javascript
{
  Fullname: { Firstname, Lastname },
  email: String (unique),
  password: String (hashed),
  vehicle: {
    color: String,
    plate: String,
    capacity: Number,
    vehicleType: Enum['car', 'motorcycle', 'auto']
  },
  status: String ('active', 'inactive'),
  location: { latitude, longitude },
  createdAt: Timestamp
}
```

### Ride Model
```javascript
{
  user: ObjectId (reference),
  captain: ObjectId (reference),
  pickupLocation: String,
  dropoffLocation: String,
  status: String ('pending', 'accepted', 'ongoing', 'completed', 'cancelled'),
  fare: Number,
  distance: Number,
  duration: Number,
  createdAt: Timestamp,
  completedAt: Timestamp
}
```

---

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running and connection string is correct
- Check if port 4000 is not in use
- Verify JWT_SECRET is set in .env

### Frontend Issues
- Clear browser cache and localStorage
- Ensure backend is running before starting frontend
- Check browser console for detailed error messages
- Verify all dependencies are installed

### Socket.io Connection Failed
- Check if backend server is running
- Verify socket configuration in `socket.js`
- Check browser console for connection errors
- Ensure CORS is properly configured

---

## Scripts

### Backend Scripts
```bash
npm run dev     # Start with nodemon (development)
npm start       # Start production server
npm run build   # Build check (no actual build needed)
```

### Frontend Scripts
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint checks
```

---

## 🚀 Deployment

### Production Environment

**Frontend Deployment:**
- **Platform:** Vercel
- **URL:** [https://uberr-nine.vercel.app/](https://uberr-nine.vercel.app/)
- **Build:** Automated deployment from GitHub main branch
- **Framework:** Vite + React

**Backend Deployment:**
- **Platform:** Render
- **URL:** [https://uberr-wysl.onrender.com/](https://uberr-wysl.onrender.com/)
- **Database:** MongoDB Atlas (Cloud)
- **Real-time:** Socket.io enabled

### Environment Variables (Production)
```
Frontend (Vercel):
VITE_BASE_URL=https://uberr-wysl.onrender.com
VITE_GEOAPIFY_API_KEY=your_geoapify_key

Backend (Render):
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
PORT=4000
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## Support

For support, email support@ubeclone.dev or open an issue on GitHub.

---

**Happy Coding! 🚀**

