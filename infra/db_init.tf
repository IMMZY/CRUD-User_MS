resource "aws_ecs_task_definition" "db_init" {
  family                   = "${var.project_name}-db-init"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([
    {
      name      = "db-init"
      image     = "mysql:8"
      essential = true
      command = [
        "sh", "-c",
        "mysql -h $DB_HOST -u $DB_USER -p\"$DB_PASSWORD\" $DB_NAME -e \"CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, phone VARCHAR(50), password VARCHAR(255) NOT NULL);\""
      ]
      environment = [
        { name = "DB_HOST", value = aws_db_instance.main.address },
        { name = "DB_USER", value = var.db_username },
        { name = "DB_NAME", value = var.db_name }
      ]
      secrets = [
        { name = "DB_PASSWORD", valueFrom = aws_secretsmanager_secret.db_password.arn }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "db-init"
        }
      }
    }
  ])
}
