const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// In-memory storage (in production, use a real database)
let products = [
  {
    id: uuidv4(),
    name: 'Learning AWS Book',
    description: 'A comprehensive guide to Amazon Web Services',
    price: 29.99,
    category: 'Books',
    inStock: true,
    quantity: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Cloud Architecture Course',
    description: 'Online course for cloud architecture design',
    price: 199.99,
    category: 'Education',
    inStock: true,
    quantity: 50,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'AWS Certification Prep',
    description: 'Preparation materials for AWS certifications',
    price: 79.99,
    category: 'Education',
    inStock: true,
    quantity: 25,
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
    service: 'product-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    products_count: products.length
  });
});

// Get all products
app.get('/', (req, res) => {
  const { category, inStock } = req.query;
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  if (inStock !== undefined) {
    const stockFilter = inStock === 'true';
    filteredProducts = filteredProducts.filter(p => p.inStock === stockFilter);
  }
  
  res.json({
    message: 'Product Service',
    products: filteredProducts,
    total: filteredProducts.length,
    filters_applied: {
      category: category || 'none',
      inStock: inStock || 'none'
    }
  });
});

// Get product by ID
app.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({
      error: 'Product not found',
      id: req.params.id
    });
  }
  
  res.json(product);
});

// Create new product
app.post('/', (req, res) => {
  try {
    const { name, description, price, category, quantity = 0 } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'price', 'category']
      });
    }
    
    if (price < 0) {
      return res.status(400).json({
        error: 'Price must be a positive number'
      });
    }
    
    const newProduct = {
      id: uuidv4(),
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      inStock: quantity > 0,
      quantity: parseInt(quantity),
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// Update product
app.put('/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Product not found',
        id: req.params.id
      });
    }
    
    const { name, description, price, category, quantity } = req.body;
    const product = products[productIndex];
    
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          error: 'Price must be a positive number'
        });
      }
      product.price = parseFloat(price);
    }
    if (category) product.category = category;
    if (quantity !== undefined) {
      product.quantity = parseInt(quantity);
      product.inStock = product.quantity > 0;
    }
    
    product.updatedAt = new Date().toISOString();
    products[productIndex] = product;
    
    res.json({
      message: 'Product updated successfully',
      product
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// Delete product
app.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({
      error: 'Product not found',
      id: req.params.id
    });
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: 'Product deleted successfully',
    product: {
      id: deletedProduct.id,
      name: deletedProduct.name,
      category: deletedProduct.category
    }
  });
});

// Get products by category
app.get('/category/:category', (req, res) => {
  const categoryProducts = products.filter(p => 
    p.category.toLowerCase() === req.params.category.toLowerCase()
  );
  
  res.json({
    category: req.params.category,
    products: categoryProducts,
    total: categoryProducts.length
  });
});

// Search products
app.get('/search/:term', (req, res) => {
  const searchTerm = req.params.term.toLowerCase();
  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.description.toLowerCase().includes(searchTerm) ||
    p.category.toLowerCase().includes(searchTerm)
  );
  
  res.json({
    search_term: req.params.term,
    products: searchResults,
    total: searchResults.length
  });
});

// Update product stock
app.patch('/:id/stock', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Product not found',
        id: req.params.id
      });
    }
    
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        error: 'Invalid quantity. Must be a non-negative number.'
      });
    }
    
    const product = products[productIndex];
    product.quantity = parseInt(quantity);
    product.inStock = product.quantity > 0;
    product.updatedAt = new Date().toISOString();
    
    products[productIndex] = product;
    
    res.json({
      message: 'Product stock updated successfully',
      product: {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        inStock: product.inStock
      }
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update product stock',
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
  console.log(`🛍️  Product Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
