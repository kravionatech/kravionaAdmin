# Kraviona Backend API

Complete backend API for Kraviona CMS platform built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Installation
```bash
cd backend
npm install
```

### Setup Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### Run Development Server
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

Server runs at: `http://localhost:5000`

## 📂 Project Structure

```
src/
├── config/          # Database & services configuration
├── models/          # MongoDB schemas
├── routes/          # API route handlers
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── validators/      # Request validation
└── utils/           # Helper functions
```

## 🔑 Key Features

- ✅ User Authentication (Sign up, Login, Email verification)
- ✅ JWT Token management (Access & Refresh tokens)
- ✅ Post Management (Create, Read, Update, Delete)
- ✅ File Upload with Cloudinary
- ✅ Category Management
- ✅ Newsletter Subscription
- ✅ Message System (Contact form)
- ✅ Role-based Access Control
- ✅ Input Validation
- ✅ Error Handling
- ✅ CORS support
- ✅ Security headers (Helmet)

## 📊 Database Models

### User
- Email verification with OTP
- Password hashing with bcrypt
- JWT tokens
- Profile information

### Post
- Title, slug, content, excerpt
- Category association
- Publish status
- Author tracking
- Timestamps

### Category
- Name and slug
- Post count
- Description

### File
- File URL and metadata
- Upload timestamp
- User association

### Subscriber
- Email
- Subscription status
- Timestamp

### Message
- Contact form messages
- User info and content
- Status tracking

## 🔗 API Endpoints

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete documentation

## 🔐 Authentication

Token-based authentication using JWT:
- Access Token: 15 minutes
- Refresh Token: 7 days
- Send in Authorization header: `Bearer <token>`

## 📝 Environment Variables

```env
PORT              - Server port (default: 5000)
MONGODB_URI       - MongoDB connection string
JWT_SECRET_KEY    - JWT signing key
CLOUDINARY_*      - Image upload service credentials
RESEND_API_KEY    - Email service API key
FRONTEND_CORS     - Frontend URL for CORS
ADMIN_CORS        - Admin URL for CORS
```

## 🛡️ Security

- CORS enabled
- Helmet.js for security headers
- bcryptjs for password hashing
- JWT for authentication
- Input validation
- Rate limiting ready

## 🧪 Testing Endpoints

Use curl or Postman. Examples provided in quick start guide.

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File uploads
- **cloudinary** - Image hosting
- **resend** - Email service
- **express-validator** - Input validation
- **cors** - Cross-origin requests
- **helmet** - Security headers

## 🚀 Deployment

Ready for deployment on:
- Vercel (with serverless functions)
- Heroku
- Railway
- Render
- AWS

## 📝 License

MIT

---

**For detailed API documentation, see API_ENDPOINTS.md**
