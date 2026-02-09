# 🛒 E-Commerce Project

A full-featured **multi-vendor e-commerce platform** built to demonstrate real-world software engineering practices including user management, product handling, payments, and admin control.

This project is designed for learning, evaluation, and showcasing backend & frontend integration using modern technologies.

---

## 📌 Project Overview

The system supports **Customers, Sellers (Vendors), and Admins** with role-based access control.  
Users can browse products, place orders, make payments, and track deliveries, while sellers and admins manage products, orders, and users.

---

## 🚀 Features

### 👤 User Management
- User registration & login (Email, Phone)
- Email confirmation
- Social login (Google – bonus)
- Profile management (name, address, payment details)
- Multi-user roles (Customer, Seller, Admin)
- Wishlist & favorites
- Order history
- Reviews & ratings

---

### 📦 Product Management
- Categories management
- Product listings (images, description, price)
- Stock availability
- Search by name
- Filtering by price, category, etc.

---

### 🛒 Shopping Cart & Checkout
- Add / remove products from cart
- Update product quantities
- Order summary with price breakdown
- Guest checkout
- Multiple payment methods:
  - Credit Card
  - PayPal
  - Cash on Delivery
  - Wallet
- Promo codes & discounts (bonus)

---

### 📑 Order Management
- Order placement & confirmation
- Order tracking with status updates
- Email notifications

---

### 💳 Payment Integration
- Secure payment gateways (Stripe / PayPal)
- Secure transactions
- Save cards & auto-fill for quick checkout (bonus)

---

### 🛠️ Admin Panel
- User management (approve / restrict users – soft delete)
- Product & category management
- Order & shipping management
- Discounts & promo code management (bonus)
- Homepage & banner content management

---

### 🏪 Seller (Vendor) Management
- Seller registration & profile setup
- Product listing & inventory management
- Order processing & status updates (bonus)
- Earnings & payout management (bonus)

---

### 🎯 Marketing & Engagement (Bonus)
- Push notifications
- Email marketing & newsletters
- Loyalty points & rewards
- Referral system
- Social media sharing
- Coupons & promotions
- Multi-language support

---

## 🧱 System Architecture

- Frontend: Web / Mobile Application
- Backend: RESTful API
- Database: MongoDB
- Authentication: JWT
- Payments: Stripe / PayPal

---

## 🗂️ Project Structure
ecommerce-api/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validators/      # Request validators
│   └── app.js           # Express app setup
├── tests/               # Test files
├── scripts/             # Database scripts
├── .env.example         # Environment template
├── .gitignore           # Git ignore file
├── package.json         # Dependencies
└── server.js           # Server entry point

🔐 API Documentation

Authentication

# Method	Endpoint	Description
- POST	/api/v1/auth/register	Register new user
- POST	/api/v1/auth/login	User login
- POST	/api/v1/auth/refresh-token	Refresh access token
- POST	/api/v1/auth/forgot-password	Request password reset
- POST	/api/v1/auth/reset-password	Reset password
- GET	/api/v1/auth/google	Google OAuth login
# Products

#Method	Endpoint	Description
-GET	/api/v1/products	Get all products
-GET	/api/v1/products/:id	Get single product
- POST	/api/v1/products	Create product (Seller)
- PUT	/api/v1/products/:id	Update product (Seller)
- DELETE	/api/v1/products/:id	Delete product (Seller/Admin)
- GET	/api/v1/products/search?q=	Search products
# Orders

# Method	Endpoint	Description
- POST	/api/v1/orders	Create order
- GET	/api/v1/orders	Get user orders
- GET	/api/v1/orders/:id	Get order details
- PUT	/api/v1/orders/:id/cancel	Cancel order
- GET	/api/v1/orders/:id/track	Track order
# Admin Endpoints

# Method	Endpoint	Description
- GET	/api/v1/admin/users	Get all users
- PUT	/api/v1/admin/users/:id	Update user status
- GET	/api/v1/admin/orders	Get all orders
- GET	/api/v1/admin/products	Get all products
- POST	/api/v1/admin/coupons	Create coupon
# 🧪 Testing

- Run tests

- bash
# Unit tests
- npm run test:unit

# Integration tests
- npm run test:integration

# All tests
-  npm test

# Test with coverage
- npm run test:coverage
- Test Structure

text
tests/
├── unit/
│   ├── controllers/
│   ├── services/
│   └── utils/
├── integration/
│   ├── auth.test.js
│   ├── products.test.js
│   └── orders.test.js
└── fixtures/
    ├── users.json
    └── products.json
🐳 Docker Support

Using Docker Compose

bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f api
Dockerfile

dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
📦 Deployment

1. Prepare for Production

bash
# Install production dependencies
npm ci --only=production

# Build the application
npm run build

# Set environment variables
export NODE_ENV=production
export MONGODB_URI=your_production_mongodb_uri
2. PM2 Process Manager

bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name ecommerce-api

# Monitor application
pm2 monit

