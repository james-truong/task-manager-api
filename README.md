# Task Manager REST API

A complete RESTful API built with Express.js and MongoDB for learning backend development fundamentals.

## What You'll Learn

### Week 3-4 Topics Covered:
✅ **Express.js** - Routing, middleware, REST API design
✅ **MongoDB & Mongoose** - Database, schemas, relationships
✅ **Authentication** - JWT tokens, password hashing with bcrypt
✅ **CRUD Operations** - Create, Read, Update, Delete
✅ **Error Handling** - Try/catch, validation
✅ **Security** - Password hashing, token-based auth, user ownership

## Prerequisites

1. **MongoDB** - You need MongoDB installed and running
   - Install: https://www.mongodb.com/docs/manual/installation/
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

2. **Node.js** - Already installed ✅

## Quick Start

### 1. Install Dependencies
```bash
cd "/Users/jamestruong/Documents/FullStack Projects/task-manager-api"
npm install
```

### 2. Start MongoDB (if using local installation)
```bash
# macOS/Linux
mongod

# Or if installed via Homebrew
brew services start mongodb-community
```

### 3. Configure Environment Variables
The `.env` file is already set up with default values. If using MongoDB Atlas, update the `MONGODB_URL`.

### 4. Start the Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 Server is running!
📍 Port: 3000
🌐 URL: http://localhost:3000
✨ Ready to accept requests!
```

## Project Structure

```
task-manager-api/
├── src/
│   ├── db/
│   │   └── mongoose.js        # Database connection
│   ├── models/
│   │   ├── User.js            # User schema & methods
│   │   └── Task.js            # Task schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── tasks.js           # Task CRUD routes
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   └── index.js               # Main server file
├── .env                       # Environment variables (not in git)
├── .env.example               # Template for .env
├── .gitignore                 # Files to ignore in git
└── package.json               # Project dependencies
```

## API Endpoints

### Authentication

#### Signup
```
POST /users/signup
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

#### Login
```
POST /users/login
Body: {
  "email": "john@example.com",
  "password": "mypassword123"
}
Response: {
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile (requires authentication)
```
GET /users/me
Header: Authorization: Bearer YOUR_TOKEN_HERE
```

#### Logout
```
POST /users/logout
Header: Authorization: Bearer YOUR_TOKEN_HERE
```

### Tasks

All task endpoints require authentication (send token in Authorization header).

#### Create Task
```
POST /tasks
Header: Authorization: Bearer YOUR_TOKEN_HERE
Body: {
  "description": "Learn Express.js"
}
```

#### Get All Tasks
```
GET /tasks
Header: Authorization: Bearer YOUR_TOKEN_HERE

# Filter by completed status
GET /tasks?completed=true

# Pagination
GET /tasks?limit=10&skip=0

# Sorting
GET /tasks?sortBy=createdAt:desc
```

#### Get Single Task
```
GET /tasks/:id
Header: Authorization: Bearer YOUR_TOKEN_HERE
```

#### Update Task
```
PATCH /tasks/:id
Header: Authorization: Bearer YOUR_TOKEN_HERE
Body: {
  "completed": true
}
```

#### Delete Task
```
DELETE /tasks/:id
Header: Authorization: Bearer YOUR_TOKEN_HERE
```

## Testing the API

### Option 1: VS Code Extension (Recommended)
1. Install "Thunder Client" or "REST Client" extension
2. Create requests and test directly in VS Code

### Option 2: Postman
1. Download Postman: https://www.postman.com/downloads/
2. Create a new collection
3. Add requests as shown above

### Option 3: curl (Command Line)
```bash
# Signup
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login (save the token from response)
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Create task (replace TOKEN with your actual token)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"description":"Learn MongoDB"}'

# Get all tasks
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer TOKEN"
```

## Learning Path

### Step 1: Understand the Code (2 hours)
Read through the files in this order:
1. `src/db/mongoose.js` - Database connection
2. `src/models/User.js` - User schema and methods
3. `src/models/Task.js` - Task schema
4. `src/middleware/auth.js` - Authentication middleware
5. `src/routes/auth.js` - Authentication routes
6. `src/routes/tasks.js` - Task routes
7. `src/index.js` - Main server

Each file has detailed comments explaining every concept!

### Step 2: Test the API (1 hour)
1. Start the server
2. Create a user account (signup)
3. Login and get a token
4. Create some tasks
5. Try all CRUD operations
6. Test filtering and sorting

### Step 3: Experiment (2 hours)
Try adding:
- A "priority" field to tasks (low, medium, high)
- A "due date" field to tasks
- An endpoint to get task statistics
- Input validation for task descriptions

### Step 4: Deploy (Optional)
- Deploy to Heroku or Render
- Use MongoDB Atlas for cloud database
- Share your API with others!

## Key Concepts Explained

### REST API Design
- **Resource-based URLs**: `/users`, `/tasks`
- **HTTP methods**: GET (read), POST (create), PATCH (update), DELETE (delete)
- **Status codes**: 200 (OK), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found)

### Authentication Flow
1. User signs up → password is hashed → user saved to DB
2. User logs in → password verified → JWT token generated
3. User makes request → sends token in header → middleware verifies token
4. Token valid → request processed → response sent

### Mongoose Relationships
- User has many Tasks (one-to-many relationship)
- Task belongs to one User (owner field)
- Virtual populate connects them

### Middleware
- Functions that run before route handlers
- `express.json()` parses JSON
- `auth` middleware verifies JWT tokens
- Can modify req/res objects

## Troubleshooting

### "MongooseServerSelectionError: connect ECONNREFUSED"
- MongoDB is not running
- Start MongoDB: `brew services start mongodb-community`
- Or check connection string in .env

### "Please authenticate"
- You need to send a valid token
- Login first to get a token
- Add header: `Authorization: Bearer YOUR_TOKEN`

### "Validation failed"
- Check your request body
- Make sure all required fields are provided
- Check field types (e.g., completed must be boolean)

## Next Steps

After mastering this project:
1. ✅ Build a frontend with React (Week 5-6 of your plan)
2. ✅ Add file uploads (profile pictures)
3. ✅ Add email notifications
4. ✅ Write tests with Jest
5. ✅ Deploy to production

## Resources

- Express docs: https://expressjs.com/
- Mongoose docs: https://mongoosejs.com/
- JWT: https://jwt.io/
- MongoDB docs: https://www.mongodb.com/docs/

---

**Great job setting up your first Express API!** 🎉

This project covers everything you need for Week 3-4 of your MERN learning plan.
