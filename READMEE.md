# Uber Frontend Documentation

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Routes](#routes)
  - [/ — Start](#--start)
  - [/login — User Login](#login--user-login)
  - [/signup — User Signup](#signup--user-signup)
  - [/captain-login — Captain Login](#captain-login--captain-login)
  - [/captain-signup — Captain Signup](#captain-signup--captain-signup)
  - [/home — User Home](#home--user-home)
  - [/captain-home — Captain Home](#captain-home--captain-home)
  - [/riding — User Active Ride](#riding--user-active-ride)
  - [/captain-riding — Captain Active Ride](#captain-riding--captain-active-ride)
  - [/users/logout — User Logout](#userslogout--user-logout)
  - [/captains/logout — Captain Logout](#captainslogout--captain-logout)

---

## Overview

Frontend for the Uber clone app built with React and Vite. Handles user and captain authentication flows with a clean mobile-first UI.

---

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS v4
- React Router DOM

---

## Getting Started

```bash
cd Frontend
npm install
npm run dev
```

App runs on `http://localhost:5173` by default.

---

## Routes

### `/` — Start

Landing page shown when the user first opens the app.

**Component:** `pages/Start.jsx`  
**Auth Required:** No

**What it shows:**
- Full screen hero background image
- Uber logo
- "Get Started With Uber" card at the bottom with a Continue button

**Navigation:**
| Action | Navigates To |
|--------|-------------|
| Click Continue | `/login` |

---

### `/login` — User Login

Login page for existing users.

**Component:** `pages/UserLogin.jsx`  
**Auth Required:** No

**What it shows:**
- Email and password input fields
- Login button
- Link to signup for new users
- "Sign in as Captain" button at the bottom

**Form Data Collected:**
| Field | Type | Required |
|-------|------|----------|
| `email` | String | Yes |
| `password` | String | Yes |

**Navigation:**
| Action | Navigates To |
|--------|-------------|
| Click Sign Up | `/signup` |
| Click Sign in as Captain | `/captain-login` |

---

### `/signup` — User Signup

Registration page for new users.

**Component:** `pages/UserSignup.jsx`  
**Auth Required:** No

**What it shows:**
- First name and last name inputs (side by side)
- Email and password input fields
- Create Account button
- Link to login for existing users
- Privacy policy notice at the bottom

**Form Data Collected:**
| Field | Type | Required |
|-------|------|----------|
| `Fullname.firstname` | String | Yes — min 3 characters |
| `Fullname.lastname` | String | No |
| `email` | String | Yes |
| `password` | String | Yes — min 6 characters |

**Navigation:**
| Action | Navigates To |
|--------|-------------|
| Click Login | `/login` |

---

### `/captain-login` — Captain Login

Login page for existing captains.

**Component:** `pages/CaptainLogin.jsx`  
**Auth Required:** No

**What it shows:**
- Email and password input fields
- Login as Captain button
- Link to captain signup for new captains
- "Sign in as User" button at the bottom

**Form Data Collected:**
| Field | Type | Required |
|-------|------|----------|
| `email` | String | Yes |
| `password` | String | Yes |

**Navigation:**
| Action | Navigates To |
|--------|-------------|
| Click Create an account | `/captain-signup` |
| Click Sign in as User | `/login` |

---

### `/captain-signup` — Captain Signup

Registration page for new captains.

**Component:** `pages/CaptainSignup.jsx`  
**Auth Required:** No

**What it shows:**
- First name and last name inputs (side by side)
- Email and password input fields
- Create Account button
- Link to captain login for existing captains
- Privacy policy notice at the bottom

**Form Data Collected:**
| Field | Type | Required |
|-------|------|----------|
| `Fullname.firstname` | String | Yes — min 3 characters |
| `Fullname.lastname` | String | No |
| `email` | String | Yes |
| `password` | String | Yes — min 6 characters |

**Navigation:**
| Action | Navigates To |
|--------|-------------|
| Click Login | `/captain-login` |

---

### `/home` — User Home

Main user booking interface, accessible only after logging in.

**Component:** `pages/Home.jsx`  
**Auth Required:** Yes (`UserProtectedWrapper`)

**What it shows:**
- Background map using Leaflet
- Floating "Uber" logo menu
- Bottom panel for finding a trip and exploring vehicle options
- Dynamic slide-up panels via GSAP (Location search, vehicle panels, confirming ride)

**Key Features:**
- Establishes connection to WebSocket server.
- Uses `useLocation` & `useRef` hooks to manage sliding panels and state.

---

### `/captain-home` — Captain Home

Main captain dashboard, accessible only after a captain logs in.

**Component:** `pages/CaptainHome.jsx`  
**Auth Required:** Yes (`CaptainProtectedWrapper`)

**What it shows:**
- Active background map for standard navigation view
- Captain's current offline/online stat card
- Sliding UI panels for incoming ride requests

**Key Features:**
- Listen to socket events (`ride-request`) and accepts rides.
- Continually updates coordinates via browser's live `geolocation`.

---

### `/riding` — User Active Ride

View for users currently inside a confirmed ongoing ride.

**Component:** `pages/Riding.jsx`  
**Auth Required:** Yes

**What it shows:**
- Driver & vehicle information (e.g., license plate, driver name)
- Live tracking map showing current location
- Payment/Fare details button

---

### `/captain-riding` — Captain Active Ride

Active ride perspective when a captain is completing a trip.

**Component:** `pages/CaptainRiding.jsx`  
**Auth Required:** Yes (`CaptainProtectedWrapper`)

**What it shows:**
- Distance to destination and drop-off user details
- Secure "Finish Ride" interaction panel
- Live tracking map showing moving towards the route

---

### `/users/logout` — User Logout

Processes the logout transition for standard users.

**Component:** `pages/UserLogout.jsx`  
**Auth Required:** Yes (`UserProtectedWrapper`)

**Action:** 
- Calls the `/users/logout` backend API, clears localStorage tokens, and redirects safely back to `/login`.

---

### `/captains/logout` — Captain Logout

Processes the logout transition for captains.

**Component:** `pages/CaptainLogout.jsx`  
**Auth Required:** Yes (`CaptainProtectedWrapper`)

**Action:** 
- Calls the `/captains/logout` backend API, clears auth tokens, and navigates seamlessly to `/captain-login`.

