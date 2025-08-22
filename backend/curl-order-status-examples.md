# Order Status Management - cURL Testing Examples

## Prerequisites
1. Start the backend server: `node server.js`
2. Get an authentication token by logging in
3. Create a test order to work with

## Step 1: Get Authentication Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "68a7f1f7afb3ce3d1bff118a",
    "name": "Test User",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Step 2: Get Available Order Statuses

```bash
curl -X GET http://localhost:5000/api/orders/statuses/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "statuses": [
    {
      "value": "pending",
      "label": "Pending",
      "description": "Order is waiting for confirmation"
    },
    {
      "value": "confirmed",
      "label": "Confirmed",
      "description": "Order has been confirmed"
    },
    {
      "value": "processing",
      "label": "Processing",
      "description": "Order is being prepared"
    },
    {
      "value": "shipped",
      "label": "Shipped",
      "description": "Order has been shipped"
    },
    {
      "value": "delivered",
      "label": "Delivered",
      "description": "Order has been delivered"
    },
    {
      "value": "cancelled",
      "label": "Cancelled",
      "description": "Order has been cancelled"
    }
  ],
  "validTransitions": {
    "pending": ["confirmed", "cancelled"],
    "confirmed": ["processing", "cancelled"],
    "processing": ["shipped", "cancelled"],
    "shipped": ["delivered"],
    "delivered": [],
    "cancelled": []
  }
}
```

## Step 3: Create a Test Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "street": "123 Test Street",
      "city": "Test City",
      "state": "Test State",
      "zipCode": "12345",
      "country": "Test Country"
    },
    "paymentMethod": "credit_card"
  }'
```

**Response:**
```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "68a7f8ffafb3ce3d1bff119d",
    "status": "pending",
    "statusHistory": [
      {
        "status": "pending",
        "changedAt": "2025-08-22T04:30:00.000Z",
        "changedBy": "System",
        "notes": "Order created"
      }
    ]
  }
}
```

## Step 4: Update Order Status (Admin API)

```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID_HERE/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Order confirmed by admin"
  }'
```

**Response:**
```json
{
  "message": "Order status updated successfully",
  "order": {
    "_id": "68a7f8ffafb3ce3d1bff119d",
    "status": "confirmed",
    "statusHistory": [
      {
        "status": "confirmed",
        "changedAt": "2025-08-22T04:31:00.000Z",
        "changedBy": "Test User",
        "notes": "Order confirmed by admin"
      },
      {
        "status": "pending",
        "changedAt": "2025-08-22T04:30:00.000Z",
        "changedBy": "System",
        "notes": "Order created"
      }
    ]
  }
}
```

## Step 5: Get Order Details & Status (User API)

```bash
curl -X GET http://localhost:5000/api/orders/ORDER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "order": {
    "_id": "68a7f8ffafb3ce3d1bff119d",
    "userId": "68a7f1f7afb3ce3d1bff118a",
    "items": [
      {
        "_id": "68a7f8ffafb3ce3d1bff119e",
        "productId": "507f1f77bcf86cd799439011",
        "quantity": 1,
        "price": 89.99,
        "name": "Test Product"
      }
    ],
    "total": 89.99,
    "status": "confirmed",
    "paymentStatus": "pending",
    "shippingAddress": {
      "street": "123 Test Street",
      "city": "Test City",
      "state": "Test State",
      "zipCode": "12345",
      "country": "Test Country"
    },
    "paymentMethod": "credit_card",
    "statusHistory": [
      {
        "status": "confirmed",
        "changedAt": "2025-08-22T04:31:00.000Z",
        "changedBy": "Test User",
        "notes": "Order confirmed by admin"
      },
      {
        "status": "pending",
        "changedAt": "2025-08-22T04:30:00.000Z",
        "changedBy": "System",
        "notes": "Order created"
      }
    ],
    "currentStatus": {
      "status": "confirmed",
      "lastUpdated": "2025-08-22T04:31:00.000Z",
      "updatedBy": "Test User"
    },
    "createdAt": "2025-08-22T04:30:00.000Z",
    "updatedAt": "2025-08-22T04:31:00.000Z"
  }
}
```

## Step 6: Test Invalid Status Transition

```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID_HERE/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "pending",
    "notes": "Trying to go back to pending (should fail)"
  }'
```

**Response (400 Bad Request):**
```json
{
  "message": "Invalid status transition from 'confirmed' to 'pending'. Allowed transitions: processing, cancelled"
}
```

## Step 7: Test Unauthorized Access

```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID_HERE/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing",
    "notes": "Unauthorized access attempt"
  }'
```

**Response (401 Unauthorized):**
```json
{
  "error": "Access denied. No token provided."
}
```

## Complete Order Status Flow Example

Here's a complete example of updating an order through all statuses:

```bash
# 1. Create order (starts as 'pending')
# 2. Update to 'confirmed'
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed", "notes": "Order confirmed"}'

# 3. Update to 'processing'
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "processing", "notes": "Order is being prepared"}'

# 4. Update to 'shipped'
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped", "notes": "Order shipped via express delivery"}'

# 5. Update to 'delivered'
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered", "notes": "Order successfully delivered"}'

# 6. View final status and history
curl -X GET http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## PowerShell Examples

For Windows PowerShell users:

```powershell
# Login
$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email": "test@example.com", "password": "TestPass123"}'
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.token

# Update order status
Invoke-WebRequest -Uri "http://localhost:5000/api/orders/ORDER_ID/status" -Method PUT -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token"} -Body '{"status": "confirmed", "notes": "Order confirmed by admin"}'

# Get order status
Invoke-WebRequest -Uri "http://localhost:5000/api/orders/ORDER_ID/status" -Method GET -Headers @{"Authorization"="Bearer $token"}
```

## Notes

- Replace `YOUR_TOKEN_HERE` with the actual JWT token from login
- Replace `ORDER_ID_HERE` with the actual order ID
- All status updates require authentication
- Status transitions are validated to ensure logical flow
- Status history is automatically tracked with timestamps and user info
- Users can only view their own orders
- Admin endpoints allow updating any order status
