output "alb_dns_name" {
  description = "Public URL of the load balancer"
  value       = aws_lb.main.dns_name
}

output "ecr_repository_url" {
  description = "ECR repository URL to push images to"
  value       = aws_ecr_repository.main.repository_url
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.address
}
