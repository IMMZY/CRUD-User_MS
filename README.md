# CRUD User Management System (React + Node/Express + MySQL)

A full-stack CRUD (Create, Read, Update, Delete) user management system built with **React** (frontend), **Node.js/Express** (backend), and **MySQL** (database). It includes **authentication (Login/Sign Up)**, **protected routes**, and a modern UI with **search, modals, toast notifications, pagination, and dark/light mode**.

This project is containerized with **Docker**, provisioned on **AWS (ECS Fargate, RDS, ALB)** with **Terraform**, and deployed automatically via a **GitHub Actions CI/CD pipeline**.

**Live demo:** http://crud-user-ms-alb-1614942698.us-east-1.elb.amazonaws.com

---

## Features

### Core CRUD
- Create a new user
- View users list
- Update user details (Edit in **modal**)
- Delete user (Delete **confirmation modal**)

### Authentication
- Sign Up
- Login
- Logout
- Protected pages using `ProtectedRoute`
- Saves logged-in user in `localStorage`

### UI/UX
- Modern dashboard styling
- Search/filter by name, email, or phone
- Toast notifications for success/error
- Pagination + page size selector (10/20/50)
- Dark/Light mode toggle (saved in localStorage)

---

## Tech Stack

**Frontend:** React, React Router DOM, CSS
**Backend:** Node.js, Express.js
**Database:** MySQL (local: Docker container / production: AWS RDS)
**Infrastructure:** Docker, Terraform, AWS (VPC, ECS Fargate, ECR, RDS, ALB, Secrets Manager, IAM)
**CI/CD:** GitHub Actions

---

## Architecture

The Express backend also serves the built React frontend as static files, so the whole app runs as a **single process on a single port** — this becomes one Docker container and one ECS task in production, with no separate frontend service. All API calls in the frontend use relative paths (e.g. `/login`, `/users`), so the exact same code works identically in local development and in AWS.

```
Browser → Application Load Balancer → ECS Fargate (Express + React build) → RDS (MySQL)
```

---

## Local Development Setup

### Prerequisites
- Node.js v18+
- npm
- Docker Desktop

### 1. Clone the repository
```bash
git clone https://github.com/IMMZY/CRUD-User_MS.git
cd CRUD-User_MS
```

### 2. Start a local MySQL database (via Docker)
```bash
docker run --name crud-mysql -e MYSQL_ROOT_PASSWORD=localdevpassword -e MYSQL_DATABASE=user_management_db -p 3307:3306 -d mysql:8
```

### 3. Load the database schema
```bash
docker exec -i crud-mysql mysql -uroot -plocaldevpassword user_management_db < server/schema.sql
```

### 4. Configure environment variables
Create `server/.env`:
```
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=localdevpassword
DB_NAME=user_management_db
PORT=5000
```

### 5. Install dependencies and run the backend
```bash
cd server
npm install
npm start
```

### 6. Install dependencies and run the frontend (in a separate terminal)
```bash
cd client
npm install
npm start
```

The frontend dev server runs at `http://localhost:3000` and proxies API calls to the backend at `http://localhost:5000`.

---

## Running with Docker (unified build)

Build the image (multi-stage: compiles the React app, then packages it with the Express server):
```bash
docker build -t crud-user-ms .
```

Run it (on the same Docker network as your local MySQL container so it can resolve `crud-mysql` by name):
```bash
docker network create crud-network
docker network connect crud-network crud-mysql
docker run --name crud-app --network crud-network -p 5000:5000 \
  -e DB_HOST=crud-mysql -e DB_PORT=3306 -e DB_USER=root \
  -e DB_PASSWORD=localdevpassword -e DB_NAME=user_management_db -e PORT=5000 \
  -d crud-user-ms
```

Visit `http://localhost:5000` — the full app (frontend + API) is served from this single container.

---

## Cloud Infrastructure (Terraform)

All AWS infrastructure lives in [`/infra`](./infra) and is managed with Terraform: VPC with public/private subnets, security groups, RDS (MySQL), ECR, ECS cluster/task definition/service, Application Load Balancer, Secrets Manager (for the database password), and IAM roles/users (including a dedicated, least-privilege IAM user for GitHub Actions).

### Prerequisites
- An AWS account
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured with a named profile (create one with `aws configure --profile <your-profile-name>`)
- [Terraform](https://developer.hashicorp.com/terraform/install) v1.5+ installed

### Steps
1. Open `infra/provider.tf` and change `profile = "portfolio-projects"` to whatever you named your own AWS CLI profile in the prerequisite above.
2. Create `infra/terraform.tfvars` with a database password (this file is gitignored and never committed):
   ```
   db_password = "choose-a-strong-password"
   ```
3. Provision everything:
   ```bash
   cd infra
   terraform init
   terraform apply
   ```
4. Once complete, note the outputs (`alb_dns_name`, `ecr_repository_url`, `rds_endpoint`) — you'll need them next.
5. The database starts empty. Load the schema by running it as a one-off ECS task (see `infra/db_init.tf`), since RDS is deliberately not reachable from outside the VPC:
   ```bash
   aws ecs run-task --cluster crud-user-ms-cluster --task-definition crud-user-ms-db-init \
     --launch-type FARGATE \
     --network-configuration "awsvpcConfiguration={subnets=[<public-subnet-ids>],securityGroups=[<ecs-sg-id>],assignPublicIp=ENABLED}"
   ```
6. Build and push the initial image manually once (subsequent pushes happen automatically via CI/CD — see below):
   ```bash
   aws ecr get-login-password --region us-east-1 --profile <your-profile-name> | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t crud-user-ms .
   docker tag crud-user-ms:latest <ecr_repository_url>:latest
   docker push <ecr_repository_url>:latest
   ```

---

## CI/CD Pipeline (GitHub Actions)

Defined in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). On every push to `main`, it automatically:
1. Checks out the code
2. Builds the Docker image
3. Authenticates to Amazon ECR
4. Pushes the image (tagged with the commit SHA and `latest`)
5. Deploys the new image to ECS via `aws ecs update-service --force-new-deployment`

### One-time setup for the pipeline to work
Terraform (above) creates an IAM user named `github-actions-crud-ms`, scoped to only this project's ECR repository and ECS service. You still need to manually generate credentials for it and add them to this repository:

1. Generate an access key for that user:
   ```bash
   aws iam create-access-key --user-name github-actions-crud-ms --profile <your-profile-name>
   ```
2. In your GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**, add:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

After that, every push to `main` deploys automatically.
