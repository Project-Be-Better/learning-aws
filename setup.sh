#!/bin/bash

# Quick Start Script for Learning AWS Microservices
# This script sets up the local development environment

set -e

echo "🚀 Starting Learning AWS Microservices Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    node_version=$(node --version | sed 's/v//')
    if [ "$(printf '%s\n' "18.0.0" "$node_version" | sort -V | head -n1)" != "18.0.0" ]; then
        print_error "Node.js version $node_version is too old. Please install Node.js 18+."
        exit 1
    fi
    print_success "Node.js $node_version is installed"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    print_success "npm $(npm --version) is installed"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. You'll need it for containerization."
    else
        print_success "Docker $(docker --version | cut -d' ' -f3 | sed 's/,//') is installed"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is not installed. You'll need it for multi-container setup."
    else
        print_success "Docker Compose $(docker-compose --version | cut -d' ' -f3 | sed 's/,//') is installed"
    fi
}

# Install dependencies for all services
install_dependencies() {
    print_status "Installing dependencies for all services..."
    
    services=("api-gateway" "user-service" "product-service")
    
    for service in "${services[@]}"; do
        print_status "Installing dependencies for $service..."
        cd "services/$service"
        
        if [ -f "package.json" ]; then
            npm install
            print_success "Dependencies installed for $service"
        else
            print_error "package.json not found for $service"
        fi
        
        cd "../.."
    done
}

# Create environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    services=("api-gateway" "user-service" "product-service")
    
    for service in "${services[@]}"; do
        env_example="services/$service/.env.example"
        env_file="services/$service/.env"
        
        if [ -f "$env_example" ] && [ ! -f "$env_file" ]; then
            cp "$env_example" "$env_file"
            print_success "Created .env file for $service"
        elif [ -f "$env_file" ]; then
            print_warning ".env file already exists for $service"
        fi
    done
}

# Test individual services
test_services() {
    print_status "Testing services individually..."
    
    services=("api-gateway" "user-service" "product-service")
    ports=("3000" "3001" "3002")
    
    for i in "${!services[@]}"; do
        service="${services[i]}"
        port="${ports[i]}"
        
        print_status "Starting $service on port $port..."
        cd "services/$service"
        
        # Start service in background
        npm start &
        service_pid=$!
        
        # Wait for service to start
        sleep 5
        
        # Test health endpoint
        if curl -f "http://localhost:$port/health" &> /dev/null; then
            print_success "$service is running and healthy"
        else
            print_error "$service health check failed"
        fi
        
        # Stop the service
        kill $service_pid 2>/dev/null || true
        
        cd "../.."
    done
}

# Run with Docker Compose
run_docker_compose() {
    print_status "Running services with Docker Compose..."
    
    if command -v docker-compose &> /dev/null; then
        docker-compose up --build -d
        sleep 10
        
        # Test the services
        if curl -f "http://localhost:3000/health" &> /dev/null; then
            print_success "All services are running with Docker Compose!"
            print_status "Services available at:"
            echo "  - API Gateway: http://localhost:3000"
            echo "  - User Service: http://localhost:3001"
            echo "  - Product Service: http://localhost:3002"
            echo ""
            print_status "To stop services: docker-compose down"
        else
            print_error "Services failed to start with Docker Compose"
        fi
    else
        print_warning "Docker Compose not available, skipping container setup"
    fi
}

# Main setup function
main() {
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    Learning AWS Microservices                ║"
    echo "║                      Quick Start Setup                       ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    check_prerequisites
    echo ""
    
    install_dependencies
    echo ""
    
    setup_environment
    echo ""
    
    print_status "Setup completed! 🎉"
    echo ""
    
    print_status "Next steps:"
    echo "1. Start services individually with: npm start (in each service directory)"
    echo "2. Or use Docker Compose: docker-compose up --build"
    echo "3. Test endpoints with curl or Postman"
    echo "4. Check out the README.md for detailed learning path"
    echo ""
    
    read -p "Would you like to run Docker Compose setup now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        run_docker_compose
    fi
    
    print_success "Happy learning! 🚀"
}

# Run main function
main "$@"
