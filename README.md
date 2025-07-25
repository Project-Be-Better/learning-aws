# Learning AWS with Microservices

A comprehensive learning project for AWS cloud deployment using microservices architecture, Infrastructure as Code (Terraform), and CI/CD pipelines.

## 🎯 Learning Objectives

This project will help you learn:

- **Microservices Architecture**: Building and orchestrating multiple services
- **Containerization**: Docker and container orchestration
- **AWS Cloud Services**: EC2, ECS, RDS, Load Balancers, VPC, and more
- **Infrastructure as Code**: Terraform for managing AWS resources
- **CI/CD Pipelines**: GitHub Actions for automated testing and deployment
- **Monitoring & Logging**: CloudWatch and application observability
- **Security Best Practices**: AWS security groups, IAM, and secure deployments

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  User Service   │    │Product Service  │
│    Port 3000    │    │    Port 3001    │    │    Port 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Application     │
                    │ Load Balancer   │
                    └─────────────────┘
                                 │
                         ┌───────────────┐
                         │   Internet    │
                         │   Gateway     │
                         └───────────────┘
```

### Services Description

1. **API Gateway** (`/services/api-gateway/`):

   - Entry point for all client requests
   - Routes requests to appropriate microservices
   - Handles cross-cutting concerns (CORS, logging)

2. **User Service** (`/services/user-service/`):

   - Manages user registration, authentication
   - JWT token generation
   - User CRUD operations

3. **Product Service** (`/services/product-service/`):
   - Manages product catalog
   - Inventory management
   - Product search and filtering

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Docker** & **Docker Compose**
- **AWS CLI** configured
- **Terraform** 1.6+
- **Git**

### Local Development Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/learning-aws.git
   cd learning-aws
   ```

2. **Install dependencies for each service:**

   ```bash
   # API Gateway
   cd services/api-gateway
   npm install
   cd ../..

   # User Service
   cd services/user-service
   npm install
   cd ../..

   # Product Service
   cd services/product-service
   npm install
   cd ../..
   ```

3. **Run with Docker Compose:**

   ```bash
   docker-compose up --build
   ```

4. **Test the services:**

   ```bash
   # API Gateway health check
   curl http://localhost:3000/health

   # Get all users
   curl http://localhost:3000/api/users

   # Get all products
   curl http://localhost:3000/api/products
   ```

### Individual Service Development

Each service can be run independently:

```bash
# API Gateway
cd services/api-gateway
npm run dev

# User Service
cd services/user-service
npm run dev

# Product Service
cd services/product-service
npm run dev
```

## ☁️ AWS Deployment

### Step 1: Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
```

### Step 2: Initialize Terraform

```bash
cd terraform
terraform init
```

### Step 3: Plan and Apply Infrastructure

```bash
# Review what will be created
terraform plan

# Apply the infrastructure
terraform apply
```

### Step 4: Deploy Applications

The GitHub Actions pipeline will automatically:

1. Build Docker images
2. Push to Amazon ECR
3. Deploy to ECS or EC2

## 🛠️ AWS Services Used

### Core Infrastructure

- **VPC**: Virtual Private Cloud for network isolation
- **EC2**: Virtual servers for running applications
- **ALB**: Application Load Balancer for traffic distribution
- **ECS**: Elastic Container Service for container orchestration
- **ECR**: Elastic Container Registry for Docker images

### Data & Storage

- **RDS**: PostgreSQL database for persistent data
- **ElastiCache**: Redis for caching and sessions
- **S3**: Object storage for logs and static assets

### Security & Monitoring

- **IAM**: Identity and Access Management
- **Security Groups**: Network-level security
- **CloudWatch**: Monitoring and logging
- **AWS Secrets Manager**: Secure credential storage

## 📊 API Endpoints

### API Gateway (Port 3000)

- `GET /` - Service information
- `GET /health` - Health check
- `GET /api/users/*` - Proxy to User Service
- `GET /api/products/*` - Proxy to Product Service

### User Service (Port 3001)

- `GET /` - List all users
- `POST /` - Create new user
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `POST /auth/login` - User authentication

### Product Service (Port 3002)

- `GET /` - List all products (with filtering)
- `POST /` - Create new product
- `GET /:id` - Get product by ID
- `PUT /:id` - Update product
- `DELETE /:id` - Delete product
- `GET /category/:category` - Get products by category
- `GET /search/:term` - Search products

## 🔧 Configuration

### Environment Variables

Each service uses environment variables for configuration. Copy `.env.example` to `.env` in each service directory:

```bash
# API Gateway
cp services/api-gateway/.env.example services/api-gateway/.env

# User Service
cp services/user-service/.env.example services/user-service/.env

# Product Service
cp services/product-service/.env.example services/product-service/.env
```

### Terraform Variables

Configure Terraform variables in `terraform/terraform.tfvars`:

```hcl
aws_region = "us-east-1"
environment = "dev"
project_name = "learning-aws"
instance_type = "t3.micro"
```

## 🚦 CI/CD Pipeline

### GitHub Actions Workflows

1. **Terraform Pipeline** (`.github/workflows/terraform.yml`):

   - Validates Terraform code
   - Security scanning with tfsec
   - Automated infrastructure deployment

2. **Microservices Pipeline** (`.github/workflows/microservices.yml`):
   - Tests all services
   - Builds Docker images
   - Pushes to ECR
   - Deploys to AWS

## 📚 Learning Path

### Beginner Level

1. ✅ Set up local development environment
2. ⏳ Run services with Docker Compose
3. ⏳ Test API endpoints with curl/Postman
4. ⏳ Understand microservices communication

### Intermediate Level

5. ⏳ Deploy basic infrastructure with Terraform
6. ⏳ Set up CI/CD pipeline
7. ⏳ Implement monitoring and logging
8. ⏳ Configure auto-scaling

### Advanced Level

9. ⏳ Implement service mesh (Istio/AWS App Mesh)
10. ⏳ Add distributed tracing
11. ⏳ Implement circuit breakers
12. ⏳ Set up multi-region deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Happy Learning! 🎉**

This project is designed to be your complete learning companion for AWS and microservices. Start with the basics and gradually work your way up to advanced cloud architecture patterns.
