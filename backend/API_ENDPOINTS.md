# 📚 Kraviona Backend API Documentation

## 🔗 Base URL
```
http://localhost:5000/api
```

---

## 🔑 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📊 API Endpoints

### 1. Authentication Routes (`/auth`)

#### Sign Up
- **POST** `/auth/create-account`
- **Public** (No auth required)
- **Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "phone": "+91234567890",
  "password": "SecurePass@123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "User created. Check your email for OTP",
  "userId": "user_id_here"
}
```

#### Verify Email
- **POST** `/auth/verify-account`
- **Public** (No auth required)
- **Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

#### Resend OTP
- **POST** `/auth/resend-otp`
- **Public** (No auth required)
- **Request:**
```json
{
  "email": "john@example.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

#### Login
- **POST** `/auth/login-password`
- **Public** (No auth required)
- **Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

---

### 2. Posts Routes (`/posts`, `/post`)

#### Create Post
- **POST** `/post/create`
- **Protected** (Auth required)
- **Request:**
```json
{
  "title": "My First Post",
  "content": "This is the post content...",
  "excerpt": "Short excerpt of the post",
  "categoryID": "category_id_here",
  "tags": ["tag1", "tag2"]
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "post": { ... }
}
```

#### Get All Published Posts
- **GET** `/posts?page=1&limit=10&categoryID=category_id`
- **Public** (No auth required)
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `categoryID` (optional)
- **Response:**
```json
{
  "success": true,
  "posts": [ ... ],
  "totalPages": 5,
  "currentPage": 1
}
```

#### Get Post by Slug
- **GET** `/posts/:slug`
- **Public** (No auth required)
- **Response:**
```json
{
  "success": true,
  "post": { ... }
}
```

#### Get Admin Posts
- **GET** `/posts/admin/my-posts?page=1&limit=10`
- **Protected** (Auth required)
- **Response:**
```json
{
  "success": true,
  "posts": [ ... ],
  "totalPages": 5,
  "currentPage": 1
}
```

#### Update Post
- **PUT** `/post/:id`
- **Protected** (Auth required)
- **Request:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "excerpt": "Updated excerpt",
  "categoryID": "category_id",
  "status": "published",
  "tags": ["tag1", "tag2"]
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "post": { ... }
}
```

#### Delete Post
- **DELETE** `/post/:id`
- **Protected** (Auth required)
- **Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 3. Categories Routes (`/categories`, `/category`)

#### Create Category
- **POST** `/category/new`
- **Protected** (Auth required)
- **Request:**
```json
{
  "name": "Technology",
  "description": "Tech related posts"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": { ... }
}
```

#### Get All Categories
- **GET** `/categories/public`
- **Public** (No auth required)
- **Response:**
```json
{
  "success": true,
  "categories": [ ... ]
}
```

#### Get Category by Slug
- **GET** `/categories/:slug`
- **Public** (No auth required)
- **Response:**
```json
{
  "success": true,
  "category": { ... }
}
```

#### Update Category
- **PUT** `/category/:id`
- **Protected** (Auth required)
- **Request:**
```json
{
  "name": "Updated Category",
  "description": "Updated description"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": { ... }
}
```

#### Delete Category
- **DELETE** `/category/:id`
- **Protected** (Auth required)
- **Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### 4. Files Routes (`/files`, `/upload`)

#### Upload File
- **POST** `/upload`
- **Protected** (Auth required)
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `file` (File object, max 5MB)
- **Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "_id": "file_id",
    "filename": "image.jpg",
    "fileUrl": "https://cloudinary.com/...",
    "fileSize": 1024000,
    "mimeType": "image/jpeg",
    "fileType": "image"
  }
}
```

#### Get All Files
- **GET** `/files?page=1&limit=10`
- **Protected** (Auth required)
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
- **Response:**
```json
{
  "success": true,
  "files": [ ... ],
  "totalPages": 5,
  "currentPage": 1
}
```

#### Delete File
- **DELETE** `/files/:id`
- **Protected** (Auth required)
- **Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

### 5. Subscriber Routes (`/subscriber`)

#### Subscribe Newsletter
- **POST** `/subscriber/new`
- **Public** (No auth required)
- **Request:**
```json
{
  "email": "subscriber@example.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```

#### Unsubscribe Newsletter
- **POST** `/subscriber/unsubscribe`
- **Public** (No auth required)
- **Request:**
```json
{
  "email": "subscriber@example.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Unsubscribed successfully"
}
```

#### Get All Subscribers
- **GET** `/subscriber?page=1&limit=20`
- **Protected** (Auth required - Admin only)
- **Response:**
```json
{
  "success": true,
  "subscribers": [ ... ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

### 6. Message Routes (`/client`, `/admin`)

#### Send Message
- **POST** `/client/send-message`
- **Public** (No auth required)
- **Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about services",
  "message": "Hello, I have a question..."
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

#### Get All Messages
- **GET** `/admin/messages?page=1&limit=20&status=new`
- **Protected** (Auth required - Admin only)
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 20)
  - `status` (new, read, replied)
- **Response:**
```json
{
  "success": true,
  "messages": [ ... ],
  "totalPages": 5,
  "currentPage": 1
}
```

#### Get Single Message
- **GET** `/admin/:id`
- **Protected** (Auth required - Admin only)
- **Response:**
```json
{
  "success": true,
  "message": { ... }
}
```

#### Reply to Message
- **POST** `/admin/:id/reply`
- **Protected** (Auth required - Admin only)
- **Request:**
```json
{
  "reply": "Thank you for your message. Here's our response..."
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Reply sent successfully"
}
```

#### Delete Message
- **DELETE** `/admin/:id`
- **Protected** (Auth required - Admin only)
- **Response:**
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## 🧪 cURL Examples

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "+91234567890",
    "password": "SecurePass@123"
  }'
```

### Verify Email
```bash
curl -X POST http://localhost:5000/api/auth/verify-account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Create Post
```bash
curl -X POST http://localhost:5000/api/post/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Content here...",
    "excerpt": "Short excerpt",
    "categoryID": "category_id_here",
    "tags": ["tag1"]
  }'
```

### Upload File
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### Get All Posts
```bash
curl -X GET "http://localhost:5000/api/posts?page=1&limit=10"
```

### Subscribe Newsletter
```bash
curl -X POST http://localhost:5000/api/subscriber/new \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com"
  }'
```

### Send Message
```bash
curl -X POST http://localhost:5000/api/client/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "subject": "Inquiry",
    "message": "Hello..."
  }'
```

---

## ✅ Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔐 Token Usage

After login, use the `accessToken` in all protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires in **15 minutes**. Use the `refreshToken` to get a new token (implement token refresh endpoint as needed).

---

**For more information, see [README.md](./README.md)**
