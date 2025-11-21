#!/bin/bash
echo "=== MongoDB Explorer ==="
echo ""
echo "📊 Databases:"
mongosh --quiet --eval "show dbs"
echo ""
echo "👥 Users in task-manager:"
mongosh task-manager --quiet --eval "db.users.find({}, {password: 0, tokens: 0}).pretty()"
echo ""
echo "📝 Tasks in task-manager:"
mongosh task-manager --quiet --eval "db.tasks.find().pretty()"

