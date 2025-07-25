const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory storage (in production, use a real database)
let users = [
  {
    id: uuidv4(),
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$EXAMPLE_HASH', // In real app, hash the password
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users_count: users.length
  });
});

// Get all users
app.get('/', (req, res) => {
  const safeUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));
  
  res.json({
    message: 'User Service',
    users: safeUsers,
    total: safeUsers.length
  });
});

// Get user by ID
app.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      id: req.params.id
    });
  }
  
  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
  
  res.json(safeUser);
});

// Create new user
app.post('/', async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['username', 'email', 'password']
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        field: existingUser.email === email ? 'email' : 'username'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    const safeUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json({
      message: 'User created successfully',
      user: safeUser
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
});

// Update user
app.put('/:id', async (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        error: 'User not found',
        id: req.params.id
      });
    }
    
    const { username, email, role } = req.body;
    const user = users[userIndex];
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    user.updatedAt = new Date().toISOString();
    
    users[userIndex] = user;
    
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    res.json({
      message: 'User updated successfully',
      user: safeUser
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// Delete user
app.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
      id: req.params.id
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  
  res.json({
    message: 'User deleted successfully',
    user: {
      id: deletedUser.id,
      username: deletedUser.username,
      email: deletedUser.email
    }
  });
});

// Authentication endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
