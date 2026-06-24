# Uber Backend API Documentation

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [User Endpoints](#endpoints)
  - [POST /users/register](#post-usersregister)
  - [POST /users/Login](#post-userslogin)
  - [GET /users/profile](#get-usersprofile)
  - [POST /users/logout](#post-userslogout)
- [Captain Endpoints](#captain-endpoints)
  - [POST /captains/register](#post-captainsregister)
  - [POST /captains/login](#post-captainslogin)
  - [GET /captains/profile](#get-captainsprofile)
  - [POST /captains/logout](#post-captainslogout)
- [Maps Endpoints](#maps-endpoints)
  - [GET /maps/get-coordinates](#get-mapsget-coordinates)
  - [GET /maps/get-distance-time](#get-mapsget-distance-time)
  - [GET /maps/get-suggestions](#get-mapsget-suggestions)
- [Ride Endpoints](#ride-endpoints)
  - [POST /rides/create](#post-ridescreate)
  - [GET /rides/get-fares](#get-ridesget-fares)
  - [POST /rides/confirm](#post-ridesconfirm)
  - [GET /rides/start-ride](#get-ridesstart-ride)
  - [POST /rides/end-ride](#post-ridesend-ride)

---

## Base URL

```
http://localhost:4000
```

---

## Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### POST /users/register

Registers a new user account. Hashes the password before storage and returns a signed JWT token upon success.

**URL:** `/users/register`  
**Method:** `POST`  
**Auth Required:** No  
**Content-Type:** `application/json`

---

#### Request Body

```json
{
  "Fullname": {
    "Firstname": "John",
    "Lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

#### Input Field Reference

| Field                | Type   | Required | Validation                                   |
|----------------------|--------|----------|----------------------------------------------|
| `Fullname.Firstname` | String | Yes      | Minimum 3 characters                         |
| `Fullname.Lastname`  | String | No       | Minimum 3 characters if provided             |
| `email`              | String | Yes      | Must be a valid email format; must be unique |
| `password`           | String | Yes      | Minimum 6 characters; stored as bcrypt hash  |

---

#### Success Response

**Code:** `201 Created`

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6622ff7c0b7e9b5a12345678",
    "Fullname": {
      "Firstname": "John",
      "Lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Output Field Reference

| Field                | Type   | Description                                      |
|----------------------|--------|--------------------------------------------------|
| `message`            | String | Success message                                  |
| `token`              | String | Signed JWT token for authenticated requests      |
| `user._id`           | String | MongoDB generated unique user ID                 |
| `user.Fullname`      | Object | Object containing Firstname and Lastname         |
| `user.email`         | String | Registered email address                         |
| `user.socketId`      | String | Socket ID for real-time tracking, `null` by default |

---

#### Error Responses

**Code:** `400 Bad Request` — Validation failed

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Firstname should be at least 3 characters long",
      "path": "Fullname.Firstname",
      "location": "body"
    }
  ]
}
```

**Code:** `500 Internal Server Error` — Unexpected server error

```json
{
  "message": "Error registering user"
}
```

---

#### Status Code Summary

| Status Code | Meaning               | Cause                                            |
|-------------|-----------------------|--------------------------------------------------|
| `201`       | Created               | User registered successfully                     |
| `400`       | Bad Request           | Missing fields, failed validation rules          |
| `500`       | Internal Server Error | Database error or unexpected server-side failure |

---

#### Notes

- The `password` field is never returned in any response — it is excluded at the schema level (`select: false`).
- JWT tokens are signed using `process.env.JWT_SECRET`. Ensure this is set in your `.env` file before starting the server.
- Submitting a duplicate `email` will result in a `400` error.
- The `socketId` field is reserved for real-time ride tracking via Socket.IO and is `null` at registration.

---

### POST /users/Login

Authenticates an existing user with email and password. Returns a signed JWT token upon success.

**URL:** `/users/Login`  
**Method:** `POST`  
**Auth Required:** No  
**Content-Type:** `application/json`

---

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

#### Input Field Reference

| Field      | Type   | Required | Validation                   |
|------------|--------|----------|------------------------------|
| `email`    | String | Yes      | Must be a valid email format |
| `password` | String | Yes      | Minimum 6 characters         |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6622ff7c0b7e9b5a12345678",
    "Fullname": {
      "Firstname": "John",
      "Lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Output Field Reference

| Field           | Type   | Description                                         |
|-----------------|--------|-----------------------------------------------------|
| `message`       | String | Success message                                     |
| `token`         | String | Signed JWT token for authenticated requests         |
| `user._id`      | String | MongoDB generated unique user ID                    |
| `user.Fullname` | Object | Object containing Firstname and Lastname            |
| `user.email`    | String | Registered email address                            |
| `user.socketId` | String | Socket ID for real-time tracking, `null` by default |

---

#### Error Responses

**Code:** `400 Bad Request` — Validation failed

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Code:** `400 Bad Request` — Invalid credentials

```json
{
  "message": "Invalid email or password"
}
```

**Code:** `500 Internal Server Error` — Unexpected server error

```json
{
  "message": "Error logging the user"
}
```

---

#### Status Code Summary

| Status Code | Meaning               | Cause                                                |
|-------------|-----------------------|------------------------------------------------------|
| `200`       | OK                    | User authenticated successfully                      |
| `400`       | Bad Request           | Validation failed, missing fields, wrong credentials |
| `500`       | Internal Server Error | Database error or unexpected server-side failure     |

---

#### Notes

- Both wrong email and wrong password return the same `"Invalid email or password"` message intentionally to prevent user enumeration attacks.
- The `password` field is explicitly selected with `+password` during login since it is excluded by default in the schema.
- Store the returned JWT token securely (e.g. `httpOnly` cookie or secure storage) and attach it to subsequent authenticated requests.

---

### GET /users/profile

Returns the authenticated user's profile data. Requires a valid JWT token.

**URL:** `/users/profile`  
**Method:** `GET`  
**Auth Required:** Yes  
**Content-Type:** `application/json`

---

#### Request Headers

| Header          | Value                | Required                  |
|-----------------|----------------------|---------------------------|
| `Authorization` | `Bearer <jwt_token>` | Yes (or token via cookie) |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "User profile retrieved successfully",
  "user": {
    "_id": "6622ff7c0b7e9b5a12345678",
    "Fullname": {
      "Firstname": "John",
      "Lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Output Field Reference

| Field           | Type   | Description                                         |
|-----------------|--------|-----------------------------------------------------|
| `message`       | String | Success message                                     |
| `user._id`      | String | MongoDB generated unique user ID                    |
| `user.Fullname` | Object | Object containing Firstname and Lastname            |
| `user.email`    | String | Registered email address                            |
| `user.socketId` | String | Socket ID for real-time tracking, `null` by default |

---

#### Error Responses

**Code:** `401 Unauthorized` — Missing or invalid token

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Code Summary

| Status Code | Meaning      | Cause                                     |
|-------------|--------------|-------------------------------------------|
| `200`       | OK           | Profile retrieved successfully            |
| `401`       | Unauthorized | Token missing, invalid or blacklisted     |

---

#### Notes

- Token can be passed either via `Authorization: Bearer <token>` header or as an `httpOnly` cookie named `token`.
- The `password` field is never returned since it is excluded at the schema level (`select: false`).

---

### POST /users/logout

Logs out the authenticated user by blacklisting the current JWT token and clearing the token cookie.

**URL:** `/users/logout`  
**Method:** `POST`  
**Auth Required:** Yes  
**Content-Type:** `application/json`

---

#### Request Headers

| Header          | Value                | Required                  |
|-----------------|----------------------|---------------------------|
| `Authorization` | `Bearer <jwt_token>` | Yes (or token via cookie) |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "User logged out successfully"
}
```

#### Output Field Reference

| Field     | Type   | Description    |
|-----------|--------|----------------|
| `message` | String | Success message |

---

#### Error Responses

**Code:** `401 Unauthorized` — Missing or invalid token

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Code Summary

| Status Code | Meaning      | Cause                                 |
|-------------|--------------|---------------------------------------|
| `200`       | OK           | User logged out successfully          |
| `401`       | Unauthorized | Token missing, invalid or blacklisted |

---

#### Notes

- On logout, the token is added to a blacklist in the database, making it invalid for future requests even if it hasn't expired.
- The `token` cookie is cleared from the client on logout.
- Any subsequent request using the blacklisted token will be rejected with `401 Unauthorized`.

---

## Captain Endpoints

### POST /captains/register

Registers a new captain account. Hashes the password before storage and returns a signed JWT token upon success.

**URL:** `/captains/register`  
**Method:** `POST`  
**Auth Required:** No  
**Content-Type:** `application/json`

---

#### Request Body

```json
{
  "Fullname": {
    "Firstname": "John",
    "Lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC-1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Input Field Reference

| Field                 | Type   | Required | Validation                                  |
|-----------------------|--------|----------|---------------------------------------------|
| `Fullname.Firstname`  | String | Yes      | Minimum 3 characters                        |
| `Fullname.Lastname`   | String | No       | Minimum 3 characters if provided            |
| `email`               | String | Yes      | Must be a valid email format; must be unique|
| `password`            | String | Yes      | Minimum 6 characters; stored as bcrypt hash |
| `vehicle.color`       | String | Yes      | Minimum 3 characters                        |
| `vehicle.plate`       | String | Yes      | Minimum 3 characters                        |
| `vehicle.capacity`    | Number | Yes      | Minimum value of 1                          |
| `vehicle.vehicleType` | String | Yes      | Must be one of: `car`, `motorcycle`, `auto` |

---

#### Success Response

**Code:** `201 Created`

```json
{
  "message": "Captain registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "6622ff7c0b7e9b5a12345678",
    "Fullname": {
      "Firstname": "John",
      "Lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "socketId": null
  }
}
```

#### Output Field Reference

| Field                    | Type   | Description                                         |
|--------------------------|--------|-----------------------------------------------------|
| `message`                | String | Success message                                     |
| `token`                  | String | Signed JWT token for authenticated requests         |
| `captain._id`            | String | MongoDB generated unique captain ID                 |
| `captain.Fullname`       | Object | Object containing Firstname and Lastname            |
| `captain.email`          | String | Registered email address                            |
| `captain.status`         | String | Captain availability status, defaults to `inactive` |
| `captain.vehicle`        | Object | Vehicle details (color, plate, capacity, type)      |
| `captain.socketId`       | String | Socket ID for real-time tracking, `null` by default |

---

#### Error Responses

**Code:** `400 Bad Request` — Validation failed

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Vehicle type must be car, motorcycle, or auto",
      "path": "vehicle.vehicleType",
      "location": "body"
    }
  ]
}
```

**Code:** `400 Bad Request` — Duplicate email

```json
{
  "message": "Captain with this email already exists"
}
```

**Code:** `500 Internal Server Error` — Unexpected server error

```json
{
  "message": "Error registering captain"
}
```

---

#### Status Code Summary

| Status Code | Meaning               | Cause                                            |
|-------------|-----------------------|--------------------------------------------------|
| `201`       | Created               | Captain registered successfully                  |
| `400`       | Bad Request           | Validation failed or duplicate email             |
| `500`       | Internal Server Error | Database error or unexpected server-side failure |

---

#### Notes

- The `password` field is never returned in any response — it is excluded at the schema level (`select: false`).
- Captain `status` defaults to `inactive` upon registration.
- JWT tokens are signed using `process.env.JWT_SECRET`.

---

### POST /captains/login

Authenticates an existing captain with email and password. Returns a signed JWT token upon success.

**URL:** `/captains/login`  
**Method:** `POST`  
**Auth Required:** No  
**Content-Type:** `application/json`

---

#### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

#### Input Field Reference

| Field      | Type   | Required | Validation                   |
|------------|--------|----------|------------------------------|
| `email`    | String | Yes      | Must be a valid email format |
| `password` | String | Yes      | Minimum 6 characters         |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "Captain logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "6622ff7c0b7e9b5a12345678",
    "Fullname": {
      "Firstname": "John",
      "Lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "socketId": null
  }
}
```

#### Output Field Reference

| Field               | Type   | Description                                         |
|---------------------|--------|-----------------------------------------------------|
| `message`           | String | Success message                                     |
| `token`             | String | Signed JWT token for authenticated requests         |
| `captain._id`       | String | MongoDB generated unique captain ID                 |
| `captain.Fullname`  | Object | Object containing Firstname and Lastname            |
| `captain.email`     | String | Registered email address                            |
| `captain.status`    | String | Captain availability status                         |
| `captain.vehicle`   | Object | Vehicle details (color, plate, capacity, type)      |
| `captain.socketId`  | String | Socket ID for real-time tracking, `null` by default |

---

#### Error Responses

**Code:** `400 Bad Request` — Validation failed

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Valid email is required",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Code:** `400 Bad Request` — Invalid credentials

```json
{
  "message": "Invalid email or password"
}
```

**Code:** `500 Internal Server Error` — Unexpected server error

```json
{
  "message": "Error logging in captain"
}
```

---

#### Status Code Summary

| Status Code | Meaning               | Cause                                                |
|-------------|-----------------------|------------------------------------------------------|
| `200`       | OK                    | Captain authenticated successfully                   |
| `400`       | Bad Request           | Validation failed, missing fields, wrong credentials |
| `500`       | Internal Server Error | Database error or unexpected server-side failure     |

---

#### Notes

- Both wrong email and wrong password return the same `"Invalid email or password"` message intentionally to prevent user enumeration attacks.
- The `password` field is explicitly selected with `+password` during login since it is excluded by default in the schema.
- Token is set as an `httpOnly` cookie and also returned in the response body.

---

### GET /captains/profile

Returns the authenticated captain's profile data. Requires a valid JWT token.

**URL:** `/captains/profile`  
**Method:** `GET`  
**Auth Required:** Yes  
**Content-Type:** `application/json`

---

#### Request Headers

| Header          | Value                | Required                  |
|-----------------|----------------------|---------------------------|
| `Authorization` | `Bearer <jwt_token>` | Yes (or token via cookie) |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "Captain profile retrieved successfully",
  "captain": {
    "_id": "6622ff7c0b7e9b5a12345678",
    "Fullname": {
      "Firstname": "John",
      "Lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "socketId": null
  }
}
```

#### Output Field Reference

| Field               | Type   | Description                                         |
|---------------------|--------|-----------------------------------------------------|
| `message`           | String | Success message                                     |
| `captain._id`       | String | MongoDB generated unique captain ID                 |
| `captain.Fullname`  | Object | Object containing Firstname and Lastname            |
| `captain.email`     | String | Registered email address                            |
| `captain.status`    | String | Captain availability status                         |
| `captain.vehicle`   | Object | Vehicle details (color, plate, capacity, type)      |
| `captain.socketId`  | String | Socket ID for real-time tracking, `null` by default |

---

#### Error Responses

**Code:** `401 Unauthorized` — Missing, invalid or blacklisted token

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Code Summary

| Status Code | Meaning      | Cause                                     |
|-------------|--------------|-------------------------------------------|
| `200`       | OK           | Profile retrieved successfully            |
| `401`       | Unauthorized | Token missing, invalid or blacklisted     |

---

#### Notes

- Token can be passed either via `Authorization: Bearer <token>` header or as an `httpOnly` cookie named `token`.
- The `password` field is never returned since it is excluded at the schema level (`select: false`).
- `req.captain` is set by the `authCaptain` middleware before reaching this route.

---

### POST /captains/logout

Logs out the authenticated captain by blacklisting the current JWT token and clearing the token cookie.

**URL:** `/captains/logout`  
**Method:** `POST`  
**Auth Required:** Yes  
**Content-Type:** `application/json`

---

#### Request Headers

| Header          | Value                | Required                  |
|-----------------|----------------------|---------------------------|
| `Authorization` | `Bearer <jwt_token>` | Yes (or token via cookie) |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "Captain logged out successfully"
}
```

#### Output Field Reference

| Field     | Type   | Description     |
|-----------|--------|-----------------|
| `message` | String | Success message |

---

#### Error Responses

**Code:** `401 Unauthorized` — Missing, invalid or blacklisted token

```json
{
  "message": "Unauthorized"
}
```

---

#### Status Code Summary

| Status Code | Meaning      | Cause                                     |
|-------------|--------------|-------------------------------------------|
| `200`       | OK           | Captain logged out successfully           |
| `401`       | Unauthorized | Token missing, invalid or blacklisted     |

---

#### Notes

- On logout, the token is added to a blacklist in the database, making it invalid for future requests even if it hasn't expired.
- The `token` cookie is cleared from the client on logout.
- Any subsequent request using the blacklisted token will be rejected with `401 Unauthorized`.


---

## Maps Endpoints

### GET /maps/get-coordinates

Retrieves the latitude and longitude coordinates for a given address. Requires a valid JWT token.

**URL:** `/maps/get-coordinates`  
**Method:** `GET`  
**Auth Required:** Yes  
**Content-Type:** `application/json`

---

#### Request Query Parameters

| Parameter | Type   | Required | Validation                          |
|-----------|--------|----------|-------------------------------------|
| `address` | String | Yes      | Minimum 3 characters                |

#### Example Request

```
GET /maps/get-coordinates?address=New%20York%20City
```

#### Request Headers

| Header          | Value                | Required                  |
|-----------------|----------------------|---------------------------|
| `Authorization` | `Bearer <jwt_token>` | Yes (or token via cookie) |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "Coordinates retrieved successfully",
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

#### Output Field Reference

| Field                | Type   | Description                                  |
|----------------------|--------|----------------------------------------------|
| `message`            | String | Success message                              |
| `coordinates`        | Object | Object containing latitude and longitude     |
| `coordinates.latitude` | Number | Latitude coordinate of the address           |
| `coordinates.longitude` | Number | Longitude coordinate of the address          |

---

#### Error Responses

**Code:** `400 Bad Request` — Validation failed

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Address must be at least 3 characters long",
      "path": "address",
      "location": "query"
    }
  ]
}
```

**Code:** `401 Unauthorized` — Missing or invalid token

```json
{
  "message": "Unauthorized"
}
```

**Code:** `500 Internal Server Error` — Unexpected server error

```json
{
  "message": "Error retrieving coordinates"
}
```

---

#### Status Code Summary

| Status Code | Meaning               | Cause                                            |
|-------------|-----------------------|--------------------------------------------------|
| `200`       | OK                    | Coordinates retrieved successfully              |
| `400`       | Bad Request           | Validation failed, address too short            |
| `401`       | Unauthorized          | Token missing, invalid or blacklisted           |
| `500`       | Internal Server Error | Map service error or unexpected server-side failure |

---

#### Notes

- Token can be passed either via `Authorization: Bearer <token>` header or as an `httpOnly` cookie named `token`.
- Address must be a valid location string (e.g., city name, street address, landmark).

---

### GET /maps/get-distance-time

Calculates the distance and estimated travel time between two addresses. Requires a valid JWT token.

**URL:** `/maps/get-distance-time`  
**Method:** `GET`  
**Auth Required:** Yes  
**Content-Type:** `application/json`

---

#### Request Query Parameters

| Parameter     | Type   | Required | Validation                          |
|---------------|--------|----------|-------------------------------------|
| `origin`      | String | Yes      | Minimum 3 characters                |
| `destination` | String | Yes      | Minimum 3 characters                |

#### Example Request

```
GET /maps/get-distance-time?origin=New%20York&destination=Boston
```

#### Request Headers

| Header          | Value                | Required                  |
|-----------------|----------------------|---------------------------|
| `Authorization` | `Bearer <jwt_token>` | Yes (or token via cookie) |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "Distance and time retrieved successfully",
  "distance": {
    "text": "215 km",
    "value": 215000
  },
  "duration": {
    "text": "3 hours 30 mins",
    "value": 12600
  }
}
```

#### Output Field Reference

| Field              | Type   | Description                                      |
|--------------------|--------|--------------------------------------------------|
| `message`          | String | Success message                                  |
| `distance`         | Object | Object containing distance information           |
| `distance.text`    | String | Human-readable distance (e.g., "215 km")        |
| `distance.value`   | Number | Distance in meters                               |
| `duration`         | Object | Object containing travel time information        |
| `duration.text`    | String | Human-readable duration (e.g., "3 hours 30 mins") |
| `duration.value`   | Number | Duration in seconds                              |

---

#### Error Responses

**Code:** `400 Bad Request` — Validation failed

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Origin must be at least 3 characters long",
      "path": "origin",
      "location": "query"
    }
  ]
}
```

**Code:** `401 Unauthorized` — Missing or invalid token

```json
{
  "message": "Unauthorized"
}
```

**Code:** `500 Internal Server Error` — Unexpected server error

```json
{
  "message": "Error retrieving distance and time"
}
```

---

#### Status Code Summary

| Status Code | Meaning               | Cause                                            |
|-------------|-----------------------|--------------------------------------------------|
| `200`       | OK                    | Distance and time retrieved successfully        |
| `400`       | Bad Request           | Validation failed, addresses too short          |
| `401`       | Unauthorized          | Token missing, invalid or blacklisted           |
| `500`       | Internal Server Error | Map service error or unexpected server-side failure |

---

#### Notes

- Token can be passed either via `Authorization: Bearer <token>` header or as an `httpOnly` cookie named `token`.
- Both origin and destination must be valid location strings.
- Distance is returned in meters; duration is returned in seconds.

---

### GET /maps/get-suggestions

Retrieves address suggestions based on partial input text. Useful for autocomplete functionality. Requires a valid JWT token.

**URL:** `/maps/get-suggestions`  
**Method:** `GET`  
**Auth Required:** Yes  
**Content-Type:** `application/json`

---

#### Request Query Parameters

| Parameter | Type   | Required | Validation                          |
|-----------|--------|----------|-------------------------------------|
| `input`   | String | Yes      | Minimum 3 characters                |

#### Example Request

```
GET /maps/get-suggestions?input=New%20Yor
```

#### Request Headers

| Header          | Value                | Required                  |
|-----------------|----------------------|---------------------------|
| `Authorization` | `Bearer <jwt_token>` | Yes (or token via cookie) |

---

#### Success Response

**Code:** `200 OK`

```json
{
  "message": "Suggestions retrieved successfully",
  "suggestions": [
    {
      "main_text": "New York",
      "secondary_text": "NY, USA",
      "place_id": "ChIJOwg_06VPwokR4v534GrPIAQ"
    },
    {
      "main_text": "New York City",
      "secondary_text": "NY, USA",
      "place_id": "ChIJNf7-gP9PwokRv534GrPIAQ"
    },
    {
      "main_text": "New York University",
      "secondary_text": "New York, NY, USA",
      "place_id": "ChIJrW5Yw-dPwokRv534GrPIAQ"
    }
  ]
}
```

#### Output Field Reference

| Field                    | Type   | Description                                      |
|--------------------------|--------|--------------------------------------------------|
| `message`                | String | Success message                                  |
| `suggestions`            | Array  | Array of address suggestion objects              |
| `suggestions[].main_text` | String | Primary text of the suggestion (e.g., location name) |
| `suggestions[].secondary_text` | String | Secondary text providing context (e.g., region, country) |
| `suggestions[].place_id` | String | Unique identifier for the place                  |

---

#### Error Responses

**Code:** `400 Bad Request` — Validation failed

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Input must be at least 3 characters long",
      "path": "input",
      "location": "query"
    }
  ]
}
```

**Code:** `401 Unauthorized` — Missing or invalid token

```json
{
  "message": "Unauthorized"
}
```

**Code:** `500 Internal Server Error` — Unexpected server error

```json
{
  "message": "Error retrieving suggestions"
}
```

---

#### Status Code Summary

| Status Code | Meaning               | Cause                                            |
|-------------|-----------------------|--------------------------------------------------|
| `200`       | OK                    | Suggestions retrieved successfully              |
| `400`       | Bad Request           | Validation failed, input too short              |
| `401`       | Unauthorized          | Token missing, invalid or blacklisted           |
| `500`       | Internal Server Error | Map service error or unexpected server-side failure |

---

#### Notes

- Token can be passed either via `Authorization: Bearer <token>` header or as an `httpOnly` cookie named `token`.
- Input must be at least 3 characters to trigger suggestions.
- Suggestions are typically sorted by relevance and popularity.
- The `place_id` can be used for further API calls to get detailed information about a location.

---

## Ride Endpoints

### POST /rides/create

Creates a new ride request for a user. Requires user authentication.

**URL:** `/rides/create`  
**Method:** `POST`  
**Auth Required:** Yes (User)  
**Content-Type:** `application/json`

---

#### Request Body

```json
{
  "pickup": "New York, NY, USA",
  "destination": "Boston, MA, USA",
  "vehicleType": "car"
}
```

#### Input Field Reference

| Field         | Type   | Required | Validation                                |
|---------------|--------|----------|-------------------------------------------|
| `pickup`      | String | Yes      | Minimum 3 characters                      |
| `destination` | String | Yes      | Minimum 3 characters                      |
| `vehicleType` | String | Yes      | Must be one of: `auto`, `car`, `motorcycle` |

---

### GET /rides/get-fares

Calculates estimated ride fares for different vehicle types. Requires user authentication.

**URL:** `/rides/get-fares`  
**Method:** `GET`  
**Auth Required:** Yes (User)  
**Content-Type:** `application/json`

---

#### Request Query Parameters

| Parameter     | Type   | Required | Validation                          |
|---------------|--------|----------|-------------------------------------|
| `pickup`      | String | Yes      | Minimum 3 characters                |
| `destination` | String | Yes      | Minimum 3 characters                |

#### Example Request

```
GET /rides/get-fares?pickup=New%20York&destination=Boston
```

---

### POST /rides/confirm

Confirms and accepts a ride request by a captain. Requires captain authentication.

**URL:** `/rides/confirm`  
**Method:** `POST`  
**Auth Required:** Yes (Captain)  
**Content-Type:** `application/json`

---

#### Request Body

```json
{
  "rideId": "6622ff7c0b7e9b5a12345678"
}
```

#### Input Field Reference

| Field    | Type   | Required | Validation               |
|----------|--------|----------|--------------------------|
| `rideId` | String | Yes      | Must be a valid Mongo ID |

---

### GET /rides/start-ride

Starts an accepted ride using a secure 6-digit OTP verification from the user. Requires captain authentication.

**URL:** `/rides/start-ride`  
**Method:** `GET`  
**Auth Required:** Yes (Captain)  
**Content-Type:** `application/json`

---

#### Request Query Parameters

| Parameter | Type   | Required | Validation               |
|-----------|--------|----------|--------------------------|
| `rideId`  | String | Yes      | Must be a valid Mongo ID |
| `otp`     | String | Yes      | Extactly 6 characters    |

#### Example Request

```
GET /rides/start-ride?rideId=6622ff7c0b7e9b5a12345678&otp=123456
```

---

### POST /rides/end-ride

Ends an active ride and triggers payment flow. Requires captain authentication.

**URL:** `/rides/end-ride`  
**Method:** `POST`  
**Auth Required:** Yes (Captain)  
**Content-Type:** `application/json`

---

#### Request Body

```json
{
  "rideId": "6622ff7c0b7e9b5a12345678"
}
```

#### Input Field Reference

| Field    | Type   | Required | Validation               |
|----------|--------|----------|--------------------------|
| `rideId` | String | Yes      | Must be a valid Mongo ID |
