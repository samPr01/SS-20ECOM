#!/bin/bash

echo "🚀 Starting Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ -z "$MONGODB_URI" ]; then
        print_error "MONGODB_URI is not set"
        exit 1
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        print_error "JWT_SECRET is not set"
        exit 1
    fi
    
    if [ -z "$RAZORPAY_KEY_SECRET" ]; then
  print_error "RAZORPAY_KEY_SECRET is not set"
        exit 1
    fi
    
    if [ -z "$CLIENT_URL" ]; then
        print_error "CLIENT_URL is not set"
        exit 1
    fi
    
    print_status "All environment variables are set ✓"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd client
    
    if npm run build; then
        print_status "Frontend build successful ✓"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    
    cd ..
}

# Test backend
test_backend() {
    print_status "Testing backend..."
    cd backend
    
    if npm test; then
        print_status "Backend tests passed ✓"
    else
        print_warning "Backend tests failed or no tests configured"
    fi
    
    cd ..
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check environment variables
    check_env_vars
    
    # Build frontend
    build_frontend
    
    # Test backend
    test_backend
    
    print_status "Deployment preparation complete!"
    print_status "Next steps:"
    echo "1. Deploy backend to Render"
    echo "2. Deploy frontend to Netlify"
    echo "3. Update environment variables in deployment platforms"
    echo "4. Test the complete flow"
}

# Run main function
main
