# 🚀 Kraviona Backend Setup Guide

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Local](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas)

---

## ⚙️ Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs all required packages:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File uploads
- **cloudinary** - Image hosting
- **resend** - Email service
- **cors** - Cross-origin requests
- **helmet** - Security headers
- And more...

---

## 🔐 Step 2: Configure Environment Variables

### Copy the example file:
```bash
cp .env.example .env
```

### Edit `.env` and fill in your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/kraviona
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kraviona?retryWrites=true&w=majority

# JWT
JWT_SECRET_KEY=your_super_secret_key_here
JWT_EXPIRE=15m

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Get from: https://cloudinary.com/console/settings/api-keys

# Resend (Email Service)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@kraviona.com
SUPPORT_EMAIL=support@kraviona.com
# Get from: https://resend.com/api-keys

# CORS
FRONTEND_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:3001
```

---

## 🗄️ Step 3: Setup MongoDB

### Option A: Local MongoDB
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service via Services or:
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project and cluster
4. Create a database user
5. Whitelist your IP (or allow all: 0.0.0.0/0)
6. Copy connection string and update `MONGODB_URI` in `.env`

---

## 📧 Step 4: Setup Email Service (Resend)

1. Go to [Resend.com](https://resend.com)
2. Sign up for free account
3. Create an API key from settings
4. Verify your domain (or use @resend.dev for testing)
5. Copy API key to `.env` as `RESEND_API_KEY`

---

## 🖼️ Step 5: Setup Cloudinary (Image Upload)

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard → Settings → API Keys
4. Copy the credentials to `.env`:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

## 🎯 Step 6: Start the Server

### Development (with auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

You should see:
```
🚀 Server running at http://localhost:5000
Environment: development
MongoDB Connected: localhost
```

---

## ✅ Step 7: Test the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

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

### Get All Posts
```bash
curl http://localhost:5000/api/posts
```

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete API documentation.

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   ├── cloudinary.js # Cloudinary setup
│   │   ├── email.js      # Email service
│   │   └── jwt.js        # JWT token generation
│   │
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Category.js
│   │   ├── File.js
│   │   ├── Subscriber.js
│   │   └── Message.js
│   │
│   ├── controllers/      # Business logic
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── categoryController.js
│   │   ├── fileController.js
│   │   ├── subscriberController.js
│   │   └── messageController.js
│   │
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── fileRoutes.js
│   │   ├── subscriberRoutes.js
│   │   └── messageRoutes.js
│   │
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── errorHandler.js
│   │   └── uploadMiddleware.js
│   │
│   ├── validators/       # Input validation
│   │   └── index.js
│   │
│   ├── utils/            # Helper functions
│   │   └── helpers.js
│   │
│   └── server.js         # Main server file
│
├── .env                  # Environment variables (create this)
├── .env.example          # Example env file
├── .gitignore
├── package.json
├── README.md
└── API_ENDPOINTS.md      # Complete API documentation
```

---

## 🔄 API Endpoints Summary

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/create-account` | ❌ | Sign up |
| POST | `/api/auth/verify-account` | ❌ | Verify email |
| POST | `/api/auth/login-password` | ❌ | Login |
| POST | `/api/post/create` | ✅ | Create post |
| GET | `/api/posts` | ❌ | Get all posts |
| GET | `/api/posts/:slug` | ❌ | Get post details |
| PUT | `/api/post/:id` | ✅ | Update post |
| DELETE | `/api/post/:id` | ✅ | Delete post |
| POST | `/api/category/new` | ✅ | Create category |
| GET | `/api/categories/public` | ❌ | Get categories |
| POST | `/api/upload` | ✅ | Upload file |
| GET | `/api/files` | ✅ | List files |
| DELETE | `/api/files/:id` | ✅ | Delete file |
| POST | `/api/subscriber/new` | ❌ | Subscribe newsletter |
| POST | `/api/client/send-message` | ❌ | Send message |
| GET | `/api/admin/messages` | ✅ | Get messages |

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
- ✅ Ensure MongoDB is running (`mongod`)
- ✅ Check `MONGODB_URI` in `.env`
- ✅ For Atlas, whitelist your IP address

### Email Not Sending
- ✅ Verify `RESEND_API_KEY` is correct
- ✅ Check email is verified in Resend dashboard
- ✅ Verify `RESEND_FROM_EMAIL` matches registered email

### File Upload Failed
- ✅ Check Cloudinary credentials
- ✅ Ensure file size < 5MB
- ✅ Verify file type is allowed (jpeg, jpg, png, gif, pdf, doc, docx)

### 401 Unauthorized Error
- ✅ Ensure token is included in Authorization header
- ✅ Check token format: `Bearer <token>`
- ✅ Token might be expired (expires in 15 minutes)

### CORS Error
- ✅ Add your frontend URL to `FRONTEND_CORS` in `.env`
- ✅ Add admin URL to `ADMIN_CORS` in `.env`

---

## 🔄 Environment Variables Checklist

Before starting the server, ensure you have:

- [ ] `PORT` set (default: 5000)
- [ ] `MONGODB_URI` configured
- [ ] `JWT_SECRET_KEY` set (use a strong random key)
- [ ] `CLOUDINARY_*` credentials filled
- [ ] `RESEND_API_KEY` filled
- [ ] `RESEND_FROM_EMAIL` verified
- [ ] `FRONTEND_CORS` updated
- [ ] `ADMIN_CORS` updated

---

## 🚀 Connecting Frontend

Update your frontend API base URL:

```javascript
// src/config.jsx
export const API_BASE_URL = 'http://localhost:5000/api';

// Or use environment variable:
export const API_BASE_URL = import.meta.env.VITE_BACKEND_API;
```

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Resend Docs](https://resend.com/docs)

---

## ✨ Features Implemented

- ✅ User authentication (Sign up, Email verification, Login)
- ✅ JWT token-based authorization
- ✅ Post management (CRUD operations)
- ✅ Category management
- ✅ File uploads to Cloudinary
- ✅ Newsletter subscription
- ✅ Contact form messages
- ✅ Email notifications
- ✅ Input validation
- ✅ Error handling
- ✅ CORS support
- ✅ Security headers (Helmet.js)
- ✅ MongoDB integration
- ✅ Pagination support

---

## 🎉 Next Steps

1. ✅ Complete all setup steps
2. ✅ Test API endpoints with curl or Postman
3. ✅ Connect your frontend to backend
4. ✅ Deploy to production (Vercel, Railway, etc.)

---

**Happy Coding! 🚀**

Need help? Check [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete documentation.
