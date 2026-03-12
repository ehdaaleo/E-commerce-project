# Technical Report: E-Commerce Platform

**Project Name:** Multi-Vendor E-Commerce Platform  
**Version:** 1.0.0  
**Date:** March 2026  
**Report Type:** Technical Documentation for Team Lead

---

## 1. Executive Summary

This document provides a comprehensive technical overview of the Multi-Vendor E-Commerce Platform, a full-featured backend API designed to demonstrate real-world software engineering practices. The system supports user management, product handling, shopping cart operations, order processing, payment integration, and AI-powered features including semantic search and visual product search.

---

## 2. Technology Stack

### 2.1 Core Framework
| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 18+ |
| Web Framework | Express.js | 5.2.1 |
| Database | MongoDB (Mongoose ODM) | 9.2.4 |
| API Type | RESTful JSON API | - |

### 2.2 Key Dependencies

| Category | Library | Purpose |
|----------|---------|---------|
| Authentication | JWT (jsonwebtoken) | Token-based auth |
| Security | bcryptjs | Password hashing |
| Security | helmet | HTTP security headers |
| Security | cors | Cross-origin resource sharing |
| Security | xss-clean | XSS protection |
| Security | express-mongo-sanitize | NoSQL injection prevention |
| Security | express-rate-limit | Rate limiting |
| File Upload | multer | Multi-part form data |
| Image Processing | sharp | Image resizing/optimization |
| Image Storage | cloudinary | Cloud image hosting |
| Email | nodemailer | Transactional emails |
| Payments | stripe | Payment gateway |
| Payments | razorpay | Payment gateway (India) |
| AI/ML | @google/generative-ai | AI features |
| AI/ML | groq-sdk | LLM integration |
| Real-time | socket.io | WebSocket support |
| Caching | node-cache | In-memory caching |
| Validation | express-validator | Request validation |
| Validation | ajv | JSON schema validation |

### 2.3 Development Tools
| Tool | Purpose |
|------|---------|
| nodemon | Auto-restart during development |
| @faker-js/faker | Mock data generation |
| dotenv | Environment configuration |
| vercel.json | Vercel deployment config |

---

## 3. System Architecture

### 3.1 Project Structure

```
ecommerce-project/
├── src/
│   ├── app.js                 # Express application setup
│   ├── config/                # Configuration files
│   │   ├── auth.js           # Auth middleware
│   │   ├── db.js             # Database connection
│   │   └── payment.js        # Payment config
│   ├── controllers/          # Route handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── profileController.js
│   │   ├── searchController.js
│   │   ├── visualSearchController.js
│   │   ├── setupBuilderController.js
│   │   └── ...
│   ├── middleware/           # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── upload.js
│   │   ├── validation.js
│   │   └── optionalAuth.js
│   ├── models/               # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── product.js
│   │   ├── Profile.js
│   │   ├── Order.js
│   │   ├── cart.model.js
│   │   └── ...
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── ...
│   ├── services/             # Business logic
│   │   ├── cloudinaryService.js
│   │   ├── embeddingService.js
│   │   ├── visualSearchService.js
│   │   ├── llmService.js
│   │   └── ...
│   ├── utils/                # Utilities
│   │   ├── emailService.js
│   │   └── helpers.js
│   ├── email/                # Email templates
│   │   ├── email.js
│   │   ├── emailTemplate.js
│   │   └── forgotPasswordTemplate.js
│   └── scripts/              # Database scripts
│       ├── generateEmbeddings.js
│       ├── generateImageEmbeddings.js
│       └── migrate-profiles.js
├── server.js                 # Entry point
├── package.json
└── vercel.json
```

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
│  (Angular Web, Mobile Apps, Postman, Third-party)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Express    │
                    │  Server     │
                    │  Port 3000  │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐      ┌─────▼─────┐      ┌────▼──────┐
   │ Routes   │      │ Middleware│      │ Services  │
   │ Layer    │      │ Layer     │      │ Layer     │
   └────┬─────┘      └─────┬─────┘      └────┬──────┘
        │                  │                  │
   ┌────▼──────────────────▼──────────────────▼──────┐
   │              Controllers Layer                    │
   │  (Auth, Product, Cart, Order, Profile, etc.)     │
   └────────────────────┬─────────────────────────────┘
                        │
   ┌────────────────────▼─────────────────────────────┐
   │              Models Layer (Mongoose)               │
   │  (User, Product, Order, Cart, Profile, etc.)      │
   └────────────────────┬─────────────────────────────┘
                        │
   ┌────────────────────▼─────────────────────────────┐
   │                   Database Layer                   │
   │              MongoDB (Atlas / Local)               │
   └────────────────────────────────────────────────────┘

                        External Services
   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │  Cloudinary  │  │    Stripe    │  │  Google AI   │
   │  (Images)    │  │  (Payments)  │  │    (LLM)     │
   └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 4. Database Schema

### 4.1 User Model
```javascript
{
  name: String,           // Required
  email: String,          // Required, Unique
  phone: String,
  password: String,       // Hashed (bcrypt)
  isConfirmed: Boolean,   // Email verification status
  role: String,           // 'customer' | 'admin'
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Profile Model (Extended User Info)
```javascript
{
  userId: ObjectId,       // Ref: User (One-to-One)
  firstName: String,
  lastName: String,
  displayName: String,
  profilePicture: { url, publicId, alt },
  coverPicture: { url, publicId, alt },
  bio: String (max 500),
  dateOfBirth: Date,
  gender: String,
  occupation: String,
  company: String,
  website: String,
  phone: String,
  socialLinks: { facebook, twitter, instagram, linkedin, github, youtube },
  addresses: [{
    addressId: ObjectId,
    addressType: 'home'|'work'|'other'|'shipping'|'billing',
    fullName, phone, addressLine1, addressLine2,
    city, state, country, postalCode,
    isDefault, isBilling, isShipping,
    deliveryInstructions
  }],
  paymentMethods: [{
    methodId: ObjectId,
    methodType: 'card'|'paypal'|'bank'|'applepay'|'googlepay',
    cardLast4, cardBrand, cardHolderName,
    expiryMonth, expiryYear, paypalEmail,
    bankName, accountLast4, accountType
  }],
  preferences: {
    newsletter, emailNotifications, pushNotifications,
    smsNotifications, marketingEmails,
    language, currency, timezone, dateFormat,
    theme, twoFactorAuth
  },
  stats: {
    totalOrders, totalSpent, averageOrderValue,
    favoriteCategory, lastActive, loginCount,
    reviewCount, wishlistCount
  },
  isProfileComplete: Boolean,
  profileCompletionScore: Number (0-100),
  verificationBadges: [{
    type: 'email'|'phone'|'identity'|'seller',
    verifiedAt: Date,
    status: 'pending'|'verified'|'rejected'
  }]
}
```

### 4.3 Product Model
```javascript
{
  name: String (max 100),
  description: String (max 2000),
  shortDescription: String (max 200),
  price: Number,
  compareAtPrice: Number,
  category: ObjectId,       // Ref: Category
  createdBy: ObjectId,      // Ref: User
  images: [{
    url: String,
    publicId: String,
    alt: String,
    isPrimary: Boolean
  }],
  sku: String (Unique, Uppercase),
  inventory: {
    quantity: Number,
    lowStockThreshold: Number (default: 5),
    trackInventory: Boolean
  },
  variants: [{
    name: String,
    options: [{
      value: String, sku, price, quantity, images
    }]
  }],
  attributes: Map,
  seo: {
    title, description, keywords, slug
  },
  ratings: {
    average: Number (0-5),
    count: Number
  },
  views: Number,
  soldCount: Number,
  isActive: Boolean,
  isFeatured: Boolean,
  deletedAt: Date (Soft delete),
  shipping: {
    weight: { value, unit: 'kg'|'g'|'lb'|'oz' },
    dimensions: { length, width, height, unit },
    freeShipping: Boolean,
    shippingRate: Number
  },
  // Vector embeddings for AI features
  embedding: [Number],           // 384-dim (semantic search)
  imageEmbedding: [Number],       // 512-dim (visual search)
  imageEmbeddingGeneratedAt: Date
}
```

### 4.4 Order Model
```javascript
{
  user: ObjectId,           // Ref: User
  items: [{
    product: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  shippingAddress: {
    address, city, postalCode, country
  },
  paymentMethod: 'card'|'credit_card'|'paypal'|'cash_on_delivery'|'wallet',
  paymentStatus: 'pending'|'paid'|'failed',
  orderStatus: 'pending'|'processing'|'shipped'|'delivered'|'cancelled',
  orderNumber: String (Unique),
  isPaid: Boolean,
  createdAt, updatedAt
}
```

### 4.5 Cart Model
```javascript
{
  user_id: ObjectId (Ref: User, Optional),
  session_id: String (For guest users),
  createdAt, updatedAt
}
```

### 4.6 Additional Models
- **Category**: Product categories with hierarchy
- **Review**: Product reviews with ratings
- **Wishlist**: User wishlists
- **PromoCode**: Discount codes
- **Payment**: Payment records

---

## 5. API Endpoints

### 5.1 Authentication (`/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/signup` | Register new user | Public |
| POST | `/auth/signin` | User login | Public |
| GET | `/auth/verify-email/:token` | Verify email address | Public |
| POST | `/auth/forgot-password` | Request password reset | Public |
| POST | `/auth/reset-password/:id/:token` | Reset password (via email) | Public |
| PUT | `/auth/reset-password` | Change password (logged in) | Private |

### 5.2 Products (`/api/products`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/search?q=` | Search products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| GET | `/api/products/user/me` | Get user's products | User |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Owner/Admin |
| DELETE | `/api/products/:id` | Delete product | Owner/Admin |
| POST | `/api/products/:id/images` | Add images | Owner/Admin |
| POST | `/api/products/:id/upload` | Upload product images | Owner/Admin |
| DELETE | `/api/products/:id/images/:imageId` | Delete image | Owner/Admin |
| PUT | `/api/products/:id/images/:imageId/primary` | Set primary image | Owner/Admin |
| GET | `/api/products/admin/low-stock` | Low stock alerts | Admin |

### 5.3 Categories (`/api/categories`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get category by ID | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### 5.4 Cart (`/api/cart`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get cart | Optional Auth |
| POST | `/api/cart/items` | Add to cart | Optional Auth |
| PATCH | `/api/cart/items/:productId` | Update quantity | Optional Auth |
| DELETE | `/api/cart/items/:productId` | Remove item | Optional Auth |
| DELETE | `/api/cart` | Clear cart | Optional Auth |
| POST | `/api/cart/checkout` | Checkout | Auth Required |

### 5.5 Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create order | Auth |
| GET | `/api/orders/my-orders` | Get user orders | Auth |
| GET | `/api/orders/:id` | Get order details | Auth |
| PUT | `/api/orders/:id/cancel` | Cancel order | Auth |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| PUT | `/api/orders/:id/payment` | Update payment status | Admin |

### 5.6 Wishlist (`/api/wishlists`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/wishlists` | Get wishlist | Auth |
| POST | `/api/wishlists/add/:productId` | Add to wishlist | Auth |
| DELETE | `/api/wishlists/remove/:productId` | Remove from wishlist | Auth |
| DELETE | `/api/wishlists/clear` | Clear wishlist | Auth |

### 5.7 Reviews (`/api/reviews`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/reviews` | Get reviews | Public |
| POST | `/api/reviews` | Create review | Auth |
| PUT | `/api/reviews/:id` | Update review | Auth |
| DELETE | `/api/reviews/:id` | Delete review | Auth |

### 5.8 Profile (`/api/profile`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/profile` | Get profile | Auth |
| PUT | `/api/profile` | Update profile | Auth |
| PUT | `/api/profile/addresses` | Update addresses | Auth |
| PUT | `/api/profile/payment-methods` | Update payment methods | Auth |
| PUT | `/api/profile/preferences` | Update preferences | Auth |

### 5.9 Visual Search (`/api/visual-search`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/visual-search` | Search by image | Public |
| GET | `/api/visual-search/categories` | Get categories for filter | Public |
| POST | `/api/visual-search/embed/:productId` | Generate image embedding | Auth |
| POST | `/api/visual-search/embed/batch` | Batch embed products | Auth |
| GET | `/api/visual-search/health` | Health check | Public |

### 5.10 AI Setup Builder (`/api/ai/setup-builder`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/ai/setup-builder` | Get templates | Public |
| POST | `/api/ai/setup-builder` | Generate setup bundle | Public |
| GET | `/api/ai/setup-builder/debug` | Debug info | Public |

### 5.11 Search (`/api/search`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/search` | Semantic search | Public |

### 5.12 Compare (`/api/compare`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/compare` | Get comparison | Public |
| POST | `/api/compare` | Add to comparison | Public |
| DELETE | `/api/compare/:productId` | Remove from comparison | Public |

### 5.13 Promo Codes (`/api/promos`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/promos` | Get all promo codes | Public |
| POST | `/api/promos/validate` | Validate promo code | Auth |
| POST | `/api/promos` | Create promo code | Admin |
| PUT | `/api/promos/:id` | Update promo code | Admin |
| DELETE | `/api/promos/:id` | Delete promo code | Admin |

### 5.14 Chat (`/api/chat`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/chat` | Get chat messages | Auth |
| POST | `/api/chat` | Send message | Auth |

### 5.15 Payment (`/payment`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/payment/create-intent` | Create payment intent | Auth |
| POST | `/payment/webhook` | Payment webhook | Public |

---

## 6. Security Implementation

### 6.1 Authentication
- **JWT Tokens**: Bearer token authentication
- **Token Expiry**: 
  - Standard: 2 days
  - Remember me: 7 days
- **Password Hashing**: bcryptjs with salt rounds of 10
- **Email Verification**: Token-based confirmation

### 6.2 Authorization
- **Role-Based Access Control (RBAC)**:
  - `customer`: Standard user
  - `admin`: Full system access
- **Ownership Verification**: Middleware checks resource ownership
- **Protected Routes**: Middleware for private endpoints

### 6.3 API Security
| Middleware | Purpose |
|-----------|---------|
| helmet | Sets secure HTTP headers |
| cors | Configured for multiple origins |
| xss-clean | Sanitizes user input |
| express-mongo-sanitize | Prevents NoSQL injection |
| express-rate-limit | Prevents abuse (30 req/min default) |

### 6.4 CORS Configuration
- Allowed origins: localhost (4200, 4201, 3000, 8080)
- Production: Vercel deployments, configured client URL
- Credentials: Enabled
- Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH

---

## 7. AI & Advanced Features

### 7.1 Semantic Search
- **Embedding Model**: sentence-transformers/all-MiniLM-L6-v2
- **Vector Dimensions**: 384
- **Index**: product_vector_index
- **Purpose**: Natural language product search

### 7.2 Visual Search
- **Embedding Model**: openai/clip-vit-base-patch32
- **Vector Dimensions**: 512
- **Index**: product_image_vector_index
- **Features**: 
  - Image-based product search
  - Hybrid search (visual + keyword)
  - Reciprocal Rank Fusion for results

### 7.3 AI Setup Builder
- **LLM Integration**: Google Generative AI & Groq SDK
- **Features**:
  - AI-powered product setup suggestions
  - Template generation
  - Bundle creation

---

## 8. Image Handling

### 8.1 Upload Pipeline
1. **Client**: Sends multipart form data
2. **Multer**: Receives file (memory storage)
3. **Sharp**: Processes image (resize, convert to WebP)
4. **Cloudinary**: Stores image, returns URL
5. **Database**: Saves image metadata

### 8.2 Image Specifications
- **Max Size**: 5MB
- **Formats**: JPEG, PNG, WebP, GIF, BMP
- **Processing**: 
  - Resize to max 800x600
  - Convert to WebP
  - Quality: 80%

### 8.3 Cloudinary Configuration
- **Folder**: ecommerce/products
- **Format**: WebP (auto)
- **Quality**: Auto (good)
- **Transformation**: On-demand resizing

---

## 9. Payment Integration

### 9.1 Supported Payment Methods
| Method | Gateway |
|--------|---------|
| Credit/Debit Card | Stripe |
| PayPal | Stripe |
| Cash on Delivery | Internal |
| Wallet | Internal |
| Razorpay | Razorpay |

### 9.2 Payment Flow
1. Create payment intent
2. Process payment on client
3. Webhook receives confirmation
4. Update order status

---

## 10. Deployment

### 10.1 Environment Variables Required
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=<mongodb_connection_string>

# JWT
JWT_SECRET=<jwt_secret_key>
JWT_EMAIL_SECRET=<email_verification_secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>

# Email (SMTP)
EMAIL_USER=<gmail_address>
EMAIL_PASS=<gmail_app_password>

# Payment
STRIPE_SECRET_KEY=<stripe_key>
STRIPE_WEBHOOK_SECRET=<webhook_secret>
RAZORPAY_KEY_ID=<razorpay_key>
RAZORPAY_KEY_SECRET=<razorpay_secret>

# AI
GOOGLE_GENERATIVE_AI_API_KEY=<google_api_key>
GROQ_API_KEY=<groq_api_key>

# Client
CLIENT_URL=<frontend_url>
```

### 10.2 Deployment Platforms
- **Primary**: Vercel (Serverless Functions)
- **Local**: Node.js with nodemon

---

## 11. Key Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| User Authentication | ✅ | JWT-based with email verification |
| Product Management | ✅ | CRUD with variants, inventory |
| Category Management | ✅ | Hierarchical categories |
| Shopping Cart | ✅ | Guest & authenticated users |
| Order Management | ✅ | Full order lifecycle |
| Wishlist | ✅ | Save favorite products |
| Reviews & Ratings | ✅ | Product reviews |
| Profile Management | ✅ | Extended user profiles |
| Search | ✅ | Semantic search with embeddings |
| Visual Search | ✅ | Image-based product search |
| AI Features | ✅ | Setup builder, chat |
| Payment Integration | ✅ | Stripe, Razorpay |
| Image Upload | ✅ | Cloudinary + Sharp |
| Rate Limiting | ✅ | API protection |
| CORS | ✅ | Multi-origin support |

---

## 12. Recommendations for Team Lead

### 12.1 Immediate Actions
1. **Environment Variables**: Ensure all secrets are in `.env`
2. **Database Indexes**: Verify vector indexes are created in MongoDB Atlas
3. **Payment Webhooks**: Configure Stripe webhook endpoint
4. **Email Configuration**: Test SMTP settings

### 12.2 Performance Considerations
1. **Caching**: Consider Redis for production
2. **Rate Limiting**: Adjust based on traffic
3. **Image CDN**: Cloudinary handles this well

### 12.3 Security Enhancements
1. Enable 2FA for admin accounts
2. Implement request logging/monitoring
3. Add API versioning
4. Consider GraphQL for complex queries

### 12.4 Scalability
1. Database connection pooling
2. Horizontal scaling for Express instances
3. CDN for static assets
4. Message queue for async operations

---

## 13. Conclusion

This E-Commerce Platform demonstrates modern backend development practices with:
- RESTful API design
- JWT authentication
- MongoDB with Mongoose
- AI-powered search features
- Multiple payment gateways
- Cloud-based image management
- Production-ready security

The codebase is well-structured with clear separation of concerns and follows Node.js best practices.

---

*Report Generated: March 2026*  
*Project: E-Commerce Platform v1.0.0*
