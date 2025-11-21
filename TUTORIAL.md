# Task Manager API - Complete Learning Tutorial

This tutorial will guide you through understanding and building a REST API with Express.js and MongoDB.

## Part 1: Understanding the Stack (10 minutes)

### What is Express.js?
Express is a minimal web framework for Node.js that makes building web servers easy.

**Without Express:**
```javascript
const http = require('http');
http.createServer((req, res) => {
  if (req.url === '/users' && req.method === 'GET') {
    // handle request
  }
  // ... lots of manual routing
}).listen(3000);
```

**With Express:**
```javascript
const express = require('express');
const app = express();
app.get('/users', (req, res) => {
  // handle request
});
app.listen(3000);
```

Much cleaner!

### What is MongoDB?
- **NoSQL database** - stores data as JSON-like documents
- **Flexible schema** - no rigid table structure
- **Scalable** - designed for modern apps

### What is Mongoose?
- **ODM** (Object Document Mapper) for MongoDB
- Adds **structure** (schemas) to MongoDB
- Provides **validation**, **middleware**, and **query helpers**

## Part 2: Project Setup (15 minutes)

### Dependencies Installed:

1. **express** - Web framework
2. **mongoose** - MongoDB ODM
3. **bcryptjs** - Password hashing
4. **jsonwebtoken** - Authentication tokens
5. **dotenv** - Environment variables
6. **nodemon** (dev) - Auto-restart server on changes

### Why Each Dependency?

**bcryptjs**: Never store plain passwords!
```javascript
// Bad: password = "mypass123"
// Good: password = "$2a$08$Gt7xK..."
```

**jsonwebtoken**: Stateless authentication
```javascript
// User logs in → gets token
// User sends token with each request
// Server verifies token → allows access
```

**dotenv**: Keep secrets out of code
```javascript
// .env file: JWT_SECRET=mysecret
// code: process.env.JWT_SECRET
```

## Part 3: Code Walkthrough (60 minutes)

### File 1: Database Connection (`src/db/mongoose.js`)

```javascript
mongoose.connect(process.env.MONGODB_URL)
```

**What happens:**
1. Mongoose connects to MongoDB
2. If database doesn't exist, it's created automatically
3. Connection is maintained throughout app lifetime

**Key Concept**: Mongoose connection is **asynchronous** - returns a Promise.

### File 2: User Model (`src/models/User.js`)

**Schema Definition:**
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});
```

**What this does:**
- Defines structure for user documents
- `required: true` → field must be provided
- `unique: true` → no duplicates allowed

**Password Hashing Middleware:**
```javascript
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});
```

**Flow:**
1. User created with password "mypass123"
2. Before saving, middleware runs
3. Password hashed → "$2a$08$Gt7xK..."
4. Hashed password saved to database

**Why?** If database is compromised, passwords are safe!

**Instance Methods:**
```javascript
userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};
```

- Available on individual user documents
- `user.generateAuthToken()` creates a JWT token

**Static Methods:**
```javascript
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
  return user;
};
```

- Available on User model itself
- `User.findByCredentials()` finds and verifies user

### File 3: Task Model (`src/models/Task.js`)

```javascript
const taskSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
```

**Key Concept - Relationships:**
- `owner` field stores User's `_id`
- `ref: 'User'` tells Mongoose this references User model
- Creates a relationship: Task belongs to User

### File 4: Auth Middleware (`src/middleware/auth.js`)

**What is Middleware?**
Functions that run **before** route handlers.

```javascript
router.get('/users/me', auth, async (req, res) => {
  // auth middleware runs first
  // then this handler runs
});
```

**Authentication Flow:**
1. Client sends request with header: `Authorization: Bearer TOKEN`
2. Middleware extracts token
3. Middleware verifies token with `jwt.verify()`
4. Middleware finds user in database
5. Middleware attaches user to `req.user`
6. Route handler can now access `req.user`

### File 5: Auth Routes (`src/routes/auth.js`)

**Signup Route:**
```javascript
router.post('/users/signup', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  const token = await user.generateAuthToken();
  res.status(201).send({ user, token });
});
```

**What happens:**
1. Client sends: `{ name: "John", email: "john@test.com", password: "pass123" }`
2. New User created from request body
3. User saved (password automatically hashed by middleware)
4. Token generated
5. User and token sent back to client

**Login Route:**
```javascript
router.post('/users/login', async (req, res) => {
  const user = await User.findByCredentials(req.body.email, req.body.password);
  const token = await user.generateAuthToken();
  res.send({ user, token });
});
```

**What happens:**
1. Client sends email and password
2. Find user and verify password (static method)
3. Generate new token
4. Send user and token back

### File 6: Task Routes (`src/routes/tasks.js`)

**Create Task:**
```javascript
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  await task.save();
});
```

**Spread operator `...req.body`:**
```javascript
// If req.body = { description: "Learn Express" }
// Then:
{
  ...req.body,          // Spreads to: description: "Learn Express"
  owner: req.user._id   // Adds: owner: "abc123"
}
// Result: { description: "Learn Express", owner: "abc123" }
```

**Get Tasks with Filtering:**
```javascript
if (req.query.completed) {
  match.completed = req.query.completed === 'true';
}
```

**Remember**: Query parameters are **always strings**!
- `?completed=true` → `req.query.completed = 'true'` (string)
- Compare to string `'true'` → returns boolean

### File 7: Main Server (`src/index.js`)

```javascript
app.use(express.json());
app.use(authRouter);
app.use(taskRouter);
```

**Order matters!**
1. Parse JSON (makes `req.body` available)
2. Register auth routes
3. Register task routes

## Part 4: Hands-On Practice (90 minutes)

### Exercise 1: Start the Server

```bash
# Make sure MongoDB is running first!
brew services start mongodb-community

# Start the API
npm run dev
```

Visit http://localhost:3000 - you should see the welcome message!

### Exercise 2: Create a User

**Using curl:**
```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","email":"you@test.com","password":"pass123"}'
```

**What to observe:**
1. Password in request: `"pass123"`
2. Password in response: Not shown (toJSON method hides it)
3. Token in response: Long string starting with `eyJ...`

**Save the token!** You'll need it for next steps.

### Exercise 3: Create Tasks

```bash
# Replace YOUR_TOKEN with the token from signup/login
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"description":"Learn Express.js"}'

curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"description":"Learn MongoDB"}'

curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"description":"Build a REST API","completed":true}'
```

### Exercise 4: Get All Tasks

```bash
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

You should see all 3 tasks!

### Exercise 5: Try Filtering

```bash
# Get only completed tasks
curl http://localhost:3000/tasks?completed=true \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get only incomplete tasks
curl http://localhost:3000/tasks?completed=false \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Exercise 6: Update a Task

```bash
# Replace TASK_ID with an actual task ID from previous request
curl -X PATCH http://localhost:3000/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"completed":true}'
```

### Exercise 7: Delete a Task

```bash
curl -X DELETE http://localhost:3000/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Part 5: Understanding Key Concepts (30 minutes)

### REST API Principles

**REST** = Representational State Transfer

Key principles:
1. **Resource-based URLs**: `/users`, `/tasks` (nouns, not verbs)
2. **HTTP methods**: GET, POST, PATCH, DELETE
3. **Stateless**: Each request is independent
4. **JSON format**: Standard data format

**RESTful Routes:**
```
GET    /tasks      → Get all tasks
POST   /tasks      → Create a task
GET    /tasks/:id  → Get one task
PATCH  /tasks/:id  → Update a task
DELETE /tasks/:id  → Delete a task
```

### HTTP Status Codes

- **200**: OK (successful GET, PATCH, DELETE)
- **201**: Created (successful POST)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (not authenticated)
- **404**: Not Found (resource doesn't exist)
- **500**: Server Error (something went wrong)

### Authentication vs Authorization

**Authentication**: "Who are you?"
- Login with email/password
- Receive token
- Send token with requests

**Authorization**: "What can you do?"
- Check if user owns the resource
- Example: Can only delete your own tasks

### Async/Await Pattern

```javascript
// Old way (callback hell)
User.findOne({ email }, (err, user) => {
  if (err) { /* handle error */ }
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) { /* handle error */ }
    // ...
  });
});

// Modern way (async/await)
try {
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
} catch (error) {
  // handle error
}
```

Much cleaner!

## Part 6: Extend the API (60 minutes)

Try adding these features on your own:

### Feature 1: Task Priority

Add a priority field to tasks (low, medium, high).

**Hint:**
```javascript
// In Task.js
priority: {
  type: String,
  enum: ['low', 'medium', 'high'],
  default: 'medium'
}
```

### Feature 2: Due Dates

Add a dueDate field to tasks.

**Hint:**
```javascript
dueDate: {
  type: Date
}
```

### Feature 3: Task Statistics

Create an endpoint: `GET /tasks/stats`

Returns:
```json
{
  "total": 10,
  "completed": 5,
  "incomplete": 5
}
```

## Part 7: Common Mistakes & Debugging (20 minutes)

### Mistake 1: Forgetting await

```javascript
// ❌ Wrong
const user = User.findOne({ email });

// ✅ Correct
const user = await User.findOne({ email });
```

### Mistake 2: Not handling errors

```javascript
// ❌ Wrong
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.send(task);
});

// ✅ Correct
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
```

### Mistake 3: Forgetting auth middleware

```javascript
// ❌ Wrong - anyone can access
router.get('/tasks', async (req, res) => { ... });

// ✅ Correct - requires authentication
router.get('/tasks', auth, async (req, res) => { ... });
```

### Mistake 4: Query parameter types

```javascript
// ❌ Wrong
if (req.query.completed) {  // 'false' is truthy!
  match.completed = req.query.completed;
}

// ✅ Correct
if (req.query.completed) {
  match.completed = req.query.completed === 'true';
}
```

## Part 8: Testing with Postman (30 minutes)

1. Download Postman: https://www.postman.com/downloads/
2. Create a new collection: "Task Manager API"
3. Add these requests:

**Request 1: Signup**
- Method: POST
- URL: http://localhost:3000/users/signup
- Body (JSON):
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

**Request 2: Login**
- Method: POST
- URL: http://localhost:3000/users/login
- Body (JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

**Request 3: Create Task**
- Method: POST
- URL: http://localhost:3000/tasks
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
  ```json
  {
    "description": "Test task"
  }
  ```

## Summary

You've learned:
✅ Express.js routing and middleware
✅ MongoDB and Mongoose
✅ User authentication with JWT
✅ Password hashing with bcrypt
✅ REST API design
✅ CRUD operations
✅ Async/await pattern
✅ Error handling

**Next steps:**
1. Complete Week 4 of your learning plan
2. Build a React frontend (Week 5-6)
3. Connect frontend to this API
4. Deploy to production!

Congratulations! 🎉
