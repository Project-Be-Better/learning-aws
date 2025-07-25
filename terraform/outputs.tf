# Output Values
output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}

output "nat_gateway_ids" {
  description = "IDs of the NAT Gateways"
  value       = aws_nat_gateway.main[*].id
}

output "load_balancer_dns_name" {
  description = "DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

output "load_balancer_zone_id" {
  description = "Zone ID of the load balancer"
  value       = aws_lb.main.zone_id
}

output "load_balancer_arn" {
  description = "ARN of the load balancer"
  value       = aws_lb.main.arn
}

output "api_gateway_target_group_arn" {
  description = "ARN of the API Gateway target group"
  value       = aws_lb_target_group.api_gateway.arn
}

output "user_service_target_group_arn" {
  description = "ARN of the User Service target group"
  value       = aws_lb_target_group.user_service.arn
}

output "product_service_target_group_arn" {
  description = "ARN of the Product Service target group"
  value       = aws_lb_target_group.product_service.arn
}

output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb.id
}

output "app_security_group_id" {
  description = "ID of the application security group"
  value       = aws_security_group.app.id
}

output "rds_security_group_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds.id
}

output "redis_security_group_id" {
  description = "ID of the Redis security group"
  value       = aws_security_group.redis.id
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket for ALB logs"
  value       = aws_s3_bucket.alb_logs.id
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_lb.main.dns_name}"
}

output "health_check_url" {
  description = "URL for health check"
  value       = "http://${aws_lb.main.dns_name}/health"
}

# Environment information
output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "project_name" {
  description = "Project name"
  value       = var.project_name
}

output "deployment_timestamp" {
  description = "Deployment timestamp"
  value       = timestamp()
}

# Useful for CI/CD
output "ecr_repository_urls" {
  description = "URLs of ECR repositories for pushing images"
  value = {
    api_gateway     = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.project_name}-api-gateway"
    user_service    = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.project_name}-user-service"
    product_service = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.project_name}-product-service"
  }
}

# Database outputs (when RDS is added)
# output "rds_endpoint" {
#   description = "RDS instance endpoint"
#   value       = aws_db_instance.main.endpoint
#   sensitive   = true
# }

# output "rds_port" {
#   description = "RDS instance port"
#   value       = aws_db_instance.main.port
# }

# Redis outputs (when ElastiCache is added)
# output "redis_endpoint" {
#   description = "Redis cluster endpoint"
#   value       = aws_elasticache_replication_group.main.configuration_endpoint_address
# }

# output "redis_port" {
#   description = "Redis cluster port"
#   value       = aws_elasticache_replication_group.main.port
# }
