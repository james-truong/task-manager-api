// ============================================
// DATABASE CONNECTION - MONGOOSE
// ============================================
// This file handles connecting to MongoDB using Mongoose
// Mongoose is an ODM (Object Document Mapper) that makes working with MongoDB easier

const mongoose = require('mongoose');

// Connect to MongoDB
// mongoose.connect() returns a Promise
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit if can't connect to database
  });

// LEARNING NOTES:
//
// What is MongoDB?
// - NoSQL database (stores data as documents, not tables)
// - Documents are stored as JSON-like objects
// - Flexible schema (fields can vary between documents)
//
// What is Mongoose?
// - Makes MongoDB easier to work with in Node.js
// - Provides schemas (structure for your data)
// - Built-in validation
// - Middleware hooks
// - Query helpers
//
// Connection String Format:
// mongodb://localhost:27017/database-name
// - localhost:27017 = where MongoDB is running
// - task-manager = database name (created automatically)
