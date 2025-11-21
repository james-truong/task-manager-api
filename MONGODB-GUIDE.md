# MongoDB Explorer Guide

## Using MongoDB Shell (mongosh)

### Connect to MongoDB
```bash
mongosh
```

### Basic Commands

#### List all databases
```bash
show dbs
```

#### Switch to a database
```bash
use task-manager
```

#### List collections in current database
```bash
show collections
```

#### View all documents in a collection
```bash
db.users.find()          # All users
db.tasks.find()          # All tasks
```

#### Pretty print (formatted output)
```bash
db.users.find().pretty()
db.tasks.find().pretty()
```

#### Find specific documents
```bash
# Find user by email
db.users.find({ email: "james@test.com" })

# Find completed tasks
db.tasks.find({ completed: true })

# Find incomplete tasks
db.tasks.find({ completed: false })
```

#### Count documents
```bash
db.users.countDocuments()
db.tasks.countDocuments()
db.tasks.countDocuments({ completed: true })
```

#### Find one document
```bash
db.users.findOne({ email: "james@test.com" })
```

#### Sort results
```bash
# Sort tasks by creation date (newest first)
db.tasks.find().sort({ createdAt: -1 })

# Sort tasks by creation date (oldest first)
db.tasks.find().sort({ createdAt: 1 })
```

#### Limit results
```bash
db.tasks.find().limit(5)
```

#### Select specific fields
```bash
# Only show description and completed fields
db.tasks.find({}, { description: 1, completed: 1 })

# Exclude _id
db.tasks.find({}, { description: 1, completed: 1, _id: 0 })
```

### Advanced Queries

#### Find tasks by owner ID
```bash
db.tasks.find({ owner: ObjectId("691f77e841710d2689fc3563") })
```

#### Find with multiple conditions (AND)
```bash
db.tasks.find({
  completed: false,
  owner: ObjectId("691f77e841710d2689fc3563")
})
```

#### Find with OR condition
```bash
db.tasks.find({
  $or: [
    { completed: true },
    { description: /Express/ }
  ]
})
```

#### Regular expressions (search)
```bash
# Find tasks containing "Express"
db.tasks.find({ description: /Express/ })

# Case-insensitive search
db.tasks.find({ description: /express/i })
```

### Update Operations

#### Update one document
```bash
db.tasks.updateOne(
  { _id: ObjectId("YOUR_TASK_ID") },
  { $set: { completed: true } }
)
```

#### Update multiple documents
```bash
# Mark all tasks as complete
db.tasks.updateMany(
  {},
  { $set: { completed: true } }
)
```

### Delete Operations

#### Delete one document
```bash
db.tasks.deleteOne({ _id: ObjectId("YOUR_TASK_ID") })
```

#### Delete multiple documents
```bash
# Delete all completed tasks
db.tasks.deleteMany({ completed: true })
```

#### Delete all documents in a collection
```bash
db.tasks.deleteMany({})
```

### Aggregation (Advanced)

#### Count tasks by completion status
```bash
db.tasks.aggregate([
  {
    $group: {
      _id: "$completed",
      count: { $sum: 1 }
    }
  }
])
```

#### Get tasks with user info (JOIN-like operation)
```bash
db.tasks.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "userInfo"
    }
  }
])
```

### Useful One-Liners

```bash
# Quick view of all data
mongosh task-manager --quiet --eval 'db.users.find().pretty()'
mongosh task-manager --quiet --eval 'db.tasks.find().pretty()'

# Count documents
mongosh task-manager --quiet --eval 'db.tasks.countDocuments()'

# Drop entire database (careful!)
mongosh task-manager --quiet --eval 'db.dropDatabase()'
```

## MongoDB Compass (GUI Tool)

For a visual interface, download **MongoDB Compass**:
https://www.mongodb.com/products/tools/compass

### Steps:
1. Download and install MongoDB Compass
2. Open it
3. Connect to: `mongodb://localhost:27017`
4. Browse your `task-manager` database visually
5. See documents, run queries, edit data with a GUI

### Compass Features:
- Visual query builder
- Schema analysis
- Performance monitoring
- Import/export data
- Index management

## Understanding MongoDB Storage

### Where is data stored?
```bash
/opt/homebrew/var/mongodb/
```

### File types:
- `.wt` files: WiredTiger storage engine data files
- `journal/`: Write-ahead logging for crash recovery
- `diagnostic.data/`: Performance metrics

### Why binary files?
- **Performance**: Binary is faster than JSON text
- **Compression**: Data is compressed automatically
- **Indexes**: Efficient index structures
- **Consistency**: ACID transactions support

## MongoDB vs SQL

### SQL (Relational)
```sql
SELECT tasks.*, users.name
FROM tasks
JOIN users ON tasks.user_id = users.id
WHERE tasks.completed = true;
```

### MongoDB (NoSQL)
```javascript
db.tasks.find({ completed: true }).populate('owner');
```

### Key Differences:

| Feature | SQL | MongoDB |
|---------|-----|---------|
| Schema | Fixed | Flexible |
| Relationships | Foreign keys | References or embedded |
| Queries | SQL language | JavaScript/JSON |
| Scaling | Vertical | Horizontal |
| Transactions | Strong ACID | ACID (4.0+) |

## Common MongoDB Operations for Your App

### Check what your API created:
```bash
# After signup
mongosh task-manager --quiet --eval 'db.users.find({}, {password: 0, tokens: 0}).pretty()'

# After creating tasks
mongosh task-manager --quiet --eval 'db.tasks.find().pretty()'

# See the relationship
mongosh task-manager --quiet --eval '
  const user = db.users.findOne();
  const tasks = db.tasks.find({ owner: user._id });
  printjson({ user: user.email, tasks: tasks.toArray() });
'
```

### Reset your database:
```bash
# Delete all users
mongosh task-manager --quiet --eval 'db.users.deleteMany({})'

# Delete all tasks
mongosh task-manager --quiet --eval 'db.tasks.deleteMany({})'

# Or drop entire database
mongosh --quiet --eval 'db.getSiblingDB("task-manager").dropDatabase()'
```

## Interactive MongoDB Shell Session

Try this interactive session:

```bash
# Start the shell
mongosh task-manager

# Now you're in the MongoDB shell, try these:
> db.tasks.find()
> db.tasks.countDocuments()
> db.tasks.find({ completed: false })
> db.users.findOne()

# Exit the shell
> exit
```

## Pro Tips

1. **Always use `.pretty()`** for readable output
2. **Tab completion works** in mongosh - start typing and press Tab
3. **Up arrow** recalls previous commands
4. **Use `it`** to iterate through more results when output is paginated
5. **JavaScript works!** You can use JS in mongosh:
   ```javascript
   let total = db.tasks.countDocuments();
   let completed = db.tasks.countDocuments({ completed: true });
   print(`${completed}/${total} tasks completed`);
   ```

## Resources

- MongoDB Manual: https://www.mongodb.com/docs/manual/
- mongosh Reference: https://www.mongodb.com/docs/mongodb-shell/
- MongoDB University (Free courses): https://university.mongodb.com/
