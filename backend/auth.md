# Authentication Routes Documentation

## Overview
The Auth module handles user authentication, registration, profile management, and image uploads. It uses **JWT (JSON Web Tokens)** for secure authentication and **bcrypt** for password hashing. This module is the backbone of user identity and access control in the blog application.

---

## Module Structure

### File: `authRoute.js`
Defines all authentication-related API endpoints and their routing.

### File: `authController.js`
Contains the business logic for user registration, login, profile retrieval, and token generation.

---

## Core Functionality

### JWT Token Generation
```javascript
const generateToken = (userId) => {
    const token = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token
}
```

**Token Details:**
- **Expiration:** 7 days
- **Payload:** User ID (`id`)
- **Algorithm:** HS256 (default for jwt.sign)
- **Secret Key:** Retrieved from `JWT_SECRET` environment variable

---

## API Endpoints

### 1. **Register User**
**Route:** `POST /auth/register`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Creates a new user account with optional admin role assignment.

#### Request Body
```json
{
  "name": "string (required) - User's full name",
  "email": "string (required) - User's email address",
  "password": "string (required) - User's password",
  "profileImageUrl": "string (optional) - URL to profile picture",
  "bio": "string (optional) - User biography",
  "adminAccessToken": "string (optional) - Admin token for admin registration"
}
```

#### Response (Success - 200)
```json
{
  "_id": "ObjectId - Unique user identifier",
  "name": "string",
  "email": "string",
  "profileImageUrl": "string",
  "bio": "string",
  "role": "string - Either 'member' or 'admin'",
  "token": "string - JWT authentication token",
  "message": "Register successful"
}
```

#### How It Works
1. **Email Validation:** Checks if user already exists
2. **Password Hashing:**
   - Generates a salt with bcrypt (rounds: 10)
   - Hashes the password using the salt
   - Stores the hashed password in database
3. **Role Assignment:**
   - Default role: `"member"`
   - If `adminAccessToken` matches `process.env.ADMIN_ACCESS_TOKEN`, role becomes `"admin"`
4. **User Creation:** Creates user document in MongoDB
5. **Token Generation:** Generates 7-day JWT token
6. **Response:** Returns user data with token

#### Error Handling
- **400 Bad Request:** If user already exists
```json
{
  "message": "User already exists .. Plz login"
}
```
- **500 Internal Server Error:** Database or server error
```json
{
  "message": "Server error",
  "error": "error details"
}
```

#### Example Usage
```javascript
// Request - Register as regular member
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "profileImageUrl": "https://example.com/profile.jpg",
  "bio": "Full-stack developer"
}

// Response
{
  "_id": "65abc123def456",
  "name": "John Doe",
  "email": "john@example.com",
  "profileImageUrl": "https://example.com/profile.jpg",
  "bio": "Full-stack developer",
  "role": "member",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Register successful"
}
```

```javascript
// Request - Register as admin
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "AdminPassword123",
  "adminAccessToken": "secret_admin_key_12345"
}

// Response includes "admin" role
{
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. **Login User**
**Route:** `POST /auth/login`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Authenticates user credentials and returns a JWT token for session management.

#### Request Body
```json
{
  "email": "string (required) - User's email address",
  "password": "string (required) - User's password"
}
```

#### Response (Success - 200)
```json
{
  "_id": "ObjectId - User's unique identifier",
  "name": "string - User's full name",
  "email": "string",
  "profileImageUrl": "string",
  "bio": "string",
  "token": "string - JWT authentication token",
  "message": "Welcome back {name}"
}
```

#### How It Works
1. **Input Validation:**
   - Checks if email and password are provided
   - Trimmed to remove whitespace
2. **User Lookup:** Searches for user by email
3. **Password Verification:**
   - Compares provided password with stored hashed password
   - Uses bcrypt.compare() for secure comparison
4. **Token Generation:** Creates a new JWT token
5. **Response:** Returns user data with token

#### Error Handling
- **400 Bad Request:** If email or password is empty
```json
{
  "message": "email and password are required"
}
```
- **401 Unauthorized:** If user doesn't exist
```json
{
  "message": "User doesn't exist , Register plz..."
}
```
- **400 Bad Request:** If password is incorrect
```json
{
  "message": "Invalid Credentials"
}
```
- **500 Internal Server Error:** Server-side error

#### Example Usage
```javascript
// Request
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

// Response
{
  "_id": "65abc123def456",
  "name": "John Doe",
  "email": "john@example.com",
  "profileImageUrl": "https://example.com/profile.jpg",
  "bio": "Full-stack developer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Welcome back John Doe"
}
```

#### Important Note
⚠️ **Bug Alert:** In the current code, `bcrypt.compare()` is missing `await`:
```javascript
const isMatch = bcrypt.compare(password, user.password); // Should be: await bcrypt.compare()
```
This should be fixed to ensure proper password verification.

---

### 3. **Get User Profile**
**Route:** `GET /auth/profile`  
**Access Level:** ⚠️ **PROTECTED** (requires valid JWT token)

#### Purpose
Retrieves the authenticated user's complete profile information.

#### Request Headers
```
Authorization: Bearer {token}
```

#### Response (Success - 200)
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "profileImageUrl": "string",
  "bio": "string",
  "role": "string",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

#### How It Works
1. **Authentication Check:** Middleware validates JWT token
2. **User Lookup:** Retrieves user by ID from token payload
3. **Password Exclusion:** Uses `.select('-password')` to exclude password
4. **Response:** Returns user document

#### Error Handling
- **401 Unauthorized:** If user not authenticated
```json
{
  "message": "User Not Authorized"
}
```
- **500 Internal Server Error:** Database or server error

#### Example Usage
```javascript
// Request (with Authorization header)
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response
{
  "_id": "65abc123def456",
  "name": "John Doe",
  "email": "john@example.com",
  "profileImageUrl": "https://example.com/profile.jpg",
  "bio": "Full-stack developer",
  "role": "member",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-02-08T15:45:00Z"
}
```

---

### 4. **Upload Profile Image**
**Route:** `POST /auth/image-upload`  
**Access Level:** 🟢 **PUBLIC** (no authentication required)

#### Purpose
Uploads a profile image and returns the accessible URL.

#### Request
- **Content-Type:** `multipart/form-data`
- **Field Name:** `image` (single file)

#### Response (Success - 200)
```json
{
  "imageUrl": "string - Full URL to the uploaded image"
}
```

#### How It Works
1. **File Upload:** Handled by `uploadMiddlewares` (multer)
2. **File Validation:** Checks if file was actually uploaded
3. **URL Construction:**
   - Protocol: `http://` or `https://` (based on request)
   - Host: Server hostname
   - Path: `uploads/{filename}`
4. **Response:** Returns full accessible URL

#### File Storage
- Files stored in: `/uploads/` directory
- Filename: Generated by multer middleware
- Access: Public HTTP endpoint

#### Error Handling
- **400 Bad Request:** If no file uploaded
```json
{
  "image": "No file uploaded"
}
```
- **500 Internal Server Error:** Upload or server error
```json
{
  "message": "error details"
}
```

#### Example Usage
```javascript
// Request (form-data)
POST /auth/image-upload
Content-Type: multipart/form-data

image: [file binary data]

// Response
{
  "imageUrl": "http://localhost:5000/uploads/image_1707387900000.jpg"
}
```

#### Usage in Frontend
```javascript
// Using FormData
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await axios.post('/auth/image-upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

const { imageUrl } = response.data;
```

---

## Security Features

### Password Security
- **Hashing Algorithm:** bcrypt with salt rounds = 10
- **Never Stored:** Plain passwords are never stored
- **Comparison:** Secure bcrypt.compare() for validation

### JWT Authentication
- **Token Expiration:** 7 days
- **Signed with Secret:** `JWT_SECRET` environment variable
- **Payload:** Contains user ID only
- **Transport:** Send in Authorization header as Bearer token

### Protected Endpoints
- **Middleware:** `protect` middleware validates JWT
- **Error Response:** 401 if token missing or invalid
- **Header Format:** `Authorization: Bearer {token}`

### Admin Access
- **Token-Based:** Requires `ADMIN_ACCESS_TOKEN` during registration
- **Role-Based:** Sets `role: "admin"` in database
- **Verification:** Checked at registration time only

---

## Request & Response Flow

### Registration Flow
```
Client Registration Request
    ↓
Check Email Exists
    ↓
Hash Password (bcrypt)
    ↓
Determine Role (admin or member)
    ↓
Create User in Database
    ↓
Generate JWT Token
    ↓
Return User Data + Token
```

### Login Flow
```
Client Login Request
    ↓
Validate Input (email & password)
    ↓
Find User by Email
    ↓
Compare Password (bcrypt)
    ↓
Generate JWT Token
    ↓
Return User Data + Token
```

### Protected Endpoint Flow
```
Client Request + Token
    ↓
Middleware: Verify JWT
    ↓
Extract User ID from Token
    ↓
Retrieve User Profile
    ↓
Exclude Password Field
    ↓
Return User Data
```

---

## Environment Variables Required
```
JWT_SECRET=your_secret_key_for_jwt_signing
ADMIN_ACCESS_TOKEN=your_secret_admin_token
```

---

## Database Model (User Schema)

Expected fields on User model:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  profileImageUrl: String,
  bio: String,
  role: String (enum: ['member', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Middleware Used

### `protect` Middleware
- Validates JWT token from Authorization header
- Extracts user ID and attaches to `req.user`
- Returns 401 if token invalid or missing
- Required for: `/profile` endpoint

### `upload` Middleware (multer)
- Handles multipart file uploads
- Configured for single file (`single('image')`)
- Stores files in `/uploads/` directory
- Used for: `/image-upload` endpoint

---

## Best Practices for Implementation

### Frontend - Storing Token
```javascript
// After successful login/register
localStorage.setItem('token', response.data.token);
```

### Frontend - Sending Token
```javascript
// In API interceptor or request headers
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

### Frontend - Logout
```javascript
// Clear stored token
localStorage.removeItem('token');
```

### Token Refresh
⚠️ **Note:** Current system doesn't have token refresh mechanism. Consider implementing:
- Refresh token endpoint
- 7-day expiration is reasonable for this use case

---

## Related Files
- Route Definition: `authRoute.js`
- Controller Logic: `authController.js`
- User Model: `models/User.js`
- Authentication Middleware: `middlewares/authMiddlewares.js`
- Upload Middleware: `middlewares/uploadMiddlewares.js`

---

## Common Issues & Solutions

### Issue: "Invalid Credentials" on correct password
**Cause:** `bcrypt.compare()` returns a Promise but isn't awaited  
**Solution:** Add `await` before `bcrypt.compare()`

### Issue: Token appears valid but 401 error
**Cause:** JWT_SECRET mismatch between generation and verification  
**Solution:** Ensure same JWT_SECRET in .env file

### Issue: File upload fails
**Cause:** `uploads/` directory doesn't exist  
**Solution:** Create `/uploads` directory in project root

### Issue: Can't login after register
**Cause:** User exists but password validation fails  
**Solution:** Check bcrypt salt rounds consistency

---

## Summary

The Auth module provides essential user management features:

✅ **User Registration** - Create accounts with optional admin role  
✅ **Secure Login** - Password verification with bcrypt hashing  
✅ **Profile Access** - Retrieve authenticated user's profile  
✅ **Image Upload** - Store and access profile images  
✅ **JWT Authentication** - 7-day token-based session management  

It uses industry-standard security practices with bcrypt hashing and JWT tokens for secure, scalable authentication across the application.
