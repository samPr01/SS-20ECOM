# E-commerce Backend API

A complete Node.js + Express backend for an e-commerce application with MongoDB Atlas integration, JWT authentication, and comprehensive API endpoints.

## 🚀 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **Product Management**: CRUD operations for products with search and filtering
- **Shopping Cart**: Add, remove, update items with stock validation
- **Order Management**: Place orders, view order history, cancel orders
- **MongoDB Integration**: Mongoose ODM with MongoDB Atlas
- **Input Validation**: Express-validator for request validation
- **Security**: bcrypt password hashing, JWT tokens
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Configure Environment Variables**
   ```env
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   
   # JWT Secret Key (generate a strong secret)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Server Port
   PORT=5000
   
   # Node Environment
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /auth/me
Authorization: Bearer <jwt-token>
```

### Product Endpoints

#### Get All Products
```http
GET /products?page=1&limit=10&category=electronics&search=laptop&sort=price&order=asc
```

#### Get Product by ID
```http
GET /products/:id
```

#### Create Product (Admin)
```http
POST /products
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "electronics",
  "image": "https://example.com/laptop.jpg",
  "stock": 10
}
```

### Cart Endpoints

#### Get User Cart
```http
GET /cart
Authorization: Bearer <jwt-token>
```

#### Add Item to Cart
```http
POST /cart
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "productId": "product-id-here",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /cart/:productId
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Item from Cart
```http
DELETE /cart/:productId
Authorization: Bearer <jwt-token>
```

#### Clear Cart
```http
DELETE /cart
Authorization: Bearer <jwt-token>
```

### Order Endpoints

#### Get User Orders
```http
GET /orders?page=1&limit=10&status=pending
Authorization: Bearer <jwt-token>
```

#### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <jwt-token>
```

#### Place Order
```http
POST /orders
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product-id-here",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

#### Place Order from Cart
```http
POST /orders/from-cart
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

#### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer <jwt-token>
```

## 🗄️ Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (enum),
  image: String (required, URL),
  stock: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number
  }],
  total: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    name: String
  }],
  total: Number,
  status: String (enum),
  shippingAddress: Object,
  paymentMethod: String (enum),
  paymentStatus: String (enum),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuration

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<cluster>` in the connection string

### JWT Secret
Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
PORT=5000
```

### PM2 (Recommended for production)
```bash
npm install -g pm2
pm2 start server.js --name "ecommerce-api"
pm2 save
pm2 startup
```

## 🧪 Testing

### Health Check
```http
GET /api/health
```

### Sample API Calls with curl

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

#### Get Products
```bash
curl -X GET http://localhost:5000/api/products
```

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **CORS**: Cross-origin resource sharing enabled
- **Error Sanitization**: No sensitive data in error responses

## 📊 Performance Features

- **Database Indexing**: Text search indexes on products
- **Pagination**: Efficient pagination for large datasets
- **Population**: Smart data population for related documents
- **Caching**: Ready for Redis integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

---

**Happy Coding! 🎉**
