# Automated Multi-Tier Web Application & CI/CD Pipeline



A production-ready DevOps starter implementation featuring a containerized Node.js (Express) microservice connected to a PostgreSQL database, orchestrated locally via Docker Compose, and automated end-to-end with a GitHub Actions CI/CD pipeline targeting Docker Hub.

---

## 📌 Architecture Overview

```text
[Developer Push] 
       │
       ▼
 [GitHub Repository] ──(Webhook Trigger)──► [GitHub Actions CI/CD Runner]
                                                    │
                                     ┌──────────────┴──────────────┐
                                     ▼                             ▼
                              [Run Unit Tests]            [Build Docker Image]
                                     │                             │
                                     └──────────────┬──────────────┘
                                                    ▼
                                     [Push to Docker Hub Registry]
                                                    │
                                                    ▼
                                          [Target Production / VM]
                                                    ▲
                                                    │
               ┌────────────────────────────────────┴────────────────────────────────────┐
               │                         Local Orchestration                             │
               │                                                                         │
               │   ┌──────────────────────────┐         ┌──────────────────────────┐     │
               │   │      Web Service         │         │     PostgreSQL Service   │     │
               │   │    (Node.js / Express)   │◄───────►│      (postgres:alpine)   │     │
               │   │       Port: 3000         │         │         Port: 5432       │     │
               │   └──────────────────────────┘         └─────────────┬────────────┘     │
               │                                                      │                  │
               │                                                [pgdata Volume]          │
               └─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack & Key Concepts

* **Runtime & Framework:** Node.js 20 LTS, Express.js
* **Database:** PostgreSQL 15 (Alpine)
* **Containerization:** Docker (Multi-stage layer caching, Alpine base image)
* **Local Orchestration:** Docker Compose (Bridge network service discovery, persistent named volumes)
* **CI/CD Automation:** GitHub Actions (`actions/checkout`, `docker/build-push-action`, `docker/login-action`)
* **Artifact Management:** Docker Hub Container Registry
* **Security & Config:** 12-Factor App design pattern with runtime Environment Variables and GitHub Encrypted Secrets

---

## 📂 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml             # Automated CI/CD pipeline workflow
├── .dockerignore              # Prevents node_modules & cache leakage into builds
├── .gitignore                 # Version control hygiene
├── Dockerfile                 # Lightweight, cached container build recipe
├── docker-compose.yml         # Multi-service local cluster definition
├── package.json               # Node.js dependencies and lifecycle scripts
└── server.js                  # Express API with DB connection pool & health checks
```

---

## 🚀 Quick Start (Local Execution)

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* [Git](https://git-scm.com/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/Jatin-Gcs/devops-first-project.git
cd devops-first-project
```

### 2. Launch with Docker Compose
Run the following command to start both the Node.js application and the PostgreSQL instance:
```bash
docker compose up --build
```

### 3. Verify Health Endpoints
Open your browser or run `curl`:

* **Application Status:**
  ```bash
  curl http://localhost:3000/
  ```
  *Response:* `{"status":"success","message":"Devops first project is running successfully!",...}`

* **Database Connectivity Health:**
  ```bash
  curl http://localhost:3000/db-health
  ```
  *Response:* `{"database":"connected","dbTime":"..."}`

### 4. Stop Services
```bash
docker compose down
```

---

## 🔄 CI/CD Workflow Breakdown

Every push to the `main` branch automatically triggers the pipeline defined in `.github/workflows/ci.yml`:

1. **Lint & Test:** Sets up Node.js runtime and executes tests (`npm test`). If the test suite exits with non-zero status code, the build immediately aborts.
2. **Registry Authentication:** Authenticates against Docker Hub using secure secrets (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`).
3. **Build & Push:** Packages the application layer using BuildKit caching optimizations and pushes the tagged image directly to Docker Hub (`jatinpankhaniya/devops-first-project:latest`).


