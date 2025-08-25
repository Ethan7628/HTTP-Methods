const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// In-memory data store
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let posts = [
  { id: 1, title: 'First Post', body: 'This is my first post', userId: 1 },
  { id: 2, title: 'Second Post', body: 'This is my second post', userId: 1 },
  { id: 3, title: 'Hello World', body: 'Just saying hello!', userId: 2 }
];

// Helper function to generate unique IDs
const generateId = (items) => {
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
};

// Routes for users

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET /api/users/:id - Get a specific user
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// POST /api/users - Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: generateId(users),
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /api/users/:id - Fully update a user
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  users[userIndex] = { id: id, name, email };
  res.json(users[userIndex]);
});

// PATCH /api/users/:id - Partially update a user
app.patch('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[userIndex] = { ...users[userIndex], ...updates };
  res.json(users[userIndex]);
});

// DELETE /api/users/:id - Delete a user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

// Routes for posts

// GET /api/posts - Get all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// GET /api/posts/:id - Get a specific post
app.get('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
});

// POST /api/posts - Create a new post
app.post('/api/posts', (req, res) => {
  const { title, body, userId } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }
  
  const newPost = {
    id: generateId(posts),
    title,
    body,
    userId: userId || 1
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});

// PUT /api/posts/:id - Fully update a post
app.put('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, body, userId } = req.body;
  
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }
  
  posts[postIndex] = { 
    id: id, 
    title, 
    body, 
    userId: userId || posts[postIndex].userId 
  };
  res.json(posts[postIndex]);
});

// PATCH /api/posts/:id - Partially update a post
app.patch('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  posts[postIndex] = { ...posts[postIndex], ...updates };
  res.json(posts[postIndex]);
});

// DELETE /api/posts/:id - Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  posts.splice(postIndex, 1);
  res.status(204).send();
});

// Handle SPA routing - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Available endpoints:');
  console.log('  GET    /health');
  console.log('  GET    /api/users');
  console.log('  GET    /api/users/:id');
  console.log('  POST   /api/users');
  console.log('  PUT    /api/users/:id');
  console.log('  PATCH  /api/users/:id');
  console.log('  DELETE /api/users/:id');
  console.log('  GET    /api/posts');
  console.log('  GET    /api/posts/:id');
  console.log('  POST   /api/posts');
  console.log('  PUT    /api/posts/:id');
  console.log('  PATCH  /api/posts/:id');
  console.log('  DELETE /api/posts/:id');
});