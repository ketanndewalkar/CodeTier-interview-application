# USER MANUAL & SYSTEM INSTALLATION GUIDE
## CodeTier Technical Interview Platform

---

## 1. Introduction

### 1.1 Overview & System Description
**CodeTier** is a full-stack, enterprise-grade, real-time technical interview platform designed to facilitate automated workspace provisioning, collaborative multi-language coding sessions, real-time WebRTC audio/video communication, containerized code execution sandboxes, live application previewing, and comprehensive candidate evaluation.

The system decouples real-time orchestration from execution using an asynchronous queue-based architecture powered by **Redis** and **BullMQ**, while utilizing **Dockerode** to programmatically spawn isolated Docker containers for secure candidate code execution and live preview servers.

---

### 1.2 Key Features & System Capabilities
* **Role-Based Access Control (RBAC):** Supports three primary user roles (`CANDIDATE`, `INTERVIEWER`, and `ORGANIZATION`).
* **Automated Workspace Provisioning:** Asynchronously clones template repositories and constructs custom workspace environments inside isolated Docker containers.
* **Real-Time Collaborative Code Editor:** Features a Monaco-based editor supporting syntax highlighting, real-time code synchronization, and dynamic file tree navigation via WebSockets.
* **Integrated Containerized Sandbox:** Executes untrusted code inside isolated runtime containers with CPU and memory bounds to protect host infrastructure.
* **Live Application Previewing:** Provides host-bound TCP port forwarding enabling real-time preview of frontend applications (e.g., React dev servers).
* **Multi-Channel WebSocket Architecture:** Employs namespaced WebSocket handlers (`INTERVIEW`, `RTC`, `WORKSPACE`, `TERMINAL`, `ERROR`) for structured bi-directional communication.
* **Peer-to-Peer WebRTC Audio/Video Call:** Integrated real-time media streaming with interactive pre-call device selection and signal exchange.
* **Structured Evaluation & Scoring System:** Multi-dimensional rubric covering technical skills, behavioral competencies, qualitative feedback, and formal hiring decisions (`SELECTED`, `REJECTED`, `FURTHER_ROUND`).

---

### 1.3 System Architecture Overview
The CodeTier architecture comprises four primary layers:

```
+-----------------------------------------------------------------------+
|                            Client Layer                               |
|   React 19 + Vite | Monaco Editor | WebRTC Media | WebSocket Client   |
+-----------------------------------+-----------------------------------+
                                    | HTTP / WS (Port 8080)
+-----------------------------------v-----------------------------------+
|                        Application Backend                            |
|     Express 5 API Server  |  WebSocket Multiplexer  |  Auth & Models  |
+-----------------+---------------------------------+-------------------+
                  |                                 |
     Redis Queue  |                                 | Mongoose ODM
+-----------------v-----------------+      +--------v-------------------+
|     Redis & BullMQ Engine         |      |    MongoDB Database        |
| Background Job Worker Process     |      | Primary Data Persistence   |
+-----------------+-----------------+      +----------------------------+
                  |
  Docker TCP API  | (Port 2375)
+-----------------v-----------------------------------------------------+
|                     Docker Runtime Engine                             |
| Dynamic Sandbox Containers (Node.js / React / Python Execution)       |
+-----------------------------------------------------------------------+
```

---

## 2. System Requirements

### 2.1 Hardware Requirements

#### Minimum Hardware Specifications (Development & Testing)
* **Processor (CPU):** Dual-Core 2.0 GHz x86_64 or ARM64 processor (Intel Core i5 8th Gen, AMD Ryzen 3, Apple M1, or equivalent).
* **Random Access Memory (RAM):** 8 GB System RAM (Minimum 4 GB unallocated for Docker containers).
* **Disk Space:** 20 GB available SSD storage (to accommodate Docker runtime images, Node modules cache, and database storage).
* **Network Bandwidth:** Standard Broadband connection (5 Mbps upload/download minimum for WebRTC audio/video stream).

#### Recommended Hardware Specifications (Production Host Environment)
* **Processor (CPU):** Quad-Core 3.0 GHz+ (Intel Core i7/i9, AMD Ryzen 7/9, or Cloud VCPU Equivalent).
* **Random Access Memory (RAM):** 16 GB+ High-Speed System RAM.
* **Disk Space:** 50 GB+ NVMe SSD Storage.
* **Network Bandwidth:** Dedicated 100 Mbps+ low-latency connection.

---

### 2.2 Software Requirements

#### Operating System Compatibility
* **Windows:** Windows 10/11 64-bit Pro, Enterprise, or Education (WSL2 / Docker Desktop enabled).
* **Linux:** Ubuntu 20.04 LTS / 22.04 LTS / 24.04 LTS, Debian 11+, RHEL 8+.
* **macOS:** macOS Monterey (12.0) or higher (Intel & Apple Silicon architectures supported).

#### Core Software Dependencies & Tools

| Component | Required Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v18.x` or `v20.x` LTS (v20+ recommended) | JavaScript Runtime Engine for Backend and Vite Frontend |
| **npm** | `v9.x` or `v10.x` | Package Manager for dependency management |
| **Docker Desktop / Docker Engine**| `v24.0+` | Container virtualization for isolated code sandboxes |
| **Docker Compose** | `v2.20+` | Multi-container service orchestration (MongoDB, Redis, Mongo Express) |
| **MongoDB** | `v7.0+` (or containerized via Docker) | Document-oriented primary database |
| **Redis** | `v7.0+` (or containerized via Docker) | In-memory data store powering BullMQ interview queues |
| **Git** | `v2.35+` | Source control engine used by workspace generator |
| **Web Browser** | Chrome 100+, Edge 100+, Firefox 100+, Safari 15+ | Modern browser supporting WebRTC, WebSockets, and ES modules |

---

## 3. Installation & System Setup

### 3.1 Prerequisites Setup

#### Step 1: Install Node.js and npm
1. Download the Node.js LTS installer from the official site (`https://nodejs.org/`).
2. Run the installer and verify installation by executing the following commands in terminal/command prompt:
```bash
node -v
npm -v
```

#### Step 2: Install Git
1. Download Git from `https://git-scm.com/` and install with standard default options.
2. Verify installation:
```bash
git --version
```

#### Step 3: Install Docker Engine / Docker Desktop & Enable TCP Daemon
Docker is required to provision sandbox environments dynamically using `dockerode`.

1. **Install Docker Desktop:**
   * Download and install Docker Desktop for Windows, macOS, or Linux from `https://www.docker.com/products/docker-desktop/`.
   * Complete installation and start Docker Desktop.

2. **Enable Unencrypted TCP Daemon (Port 2375):**
   * Open **Docker Desktop Settings** -> **General** or **Advanced**.
   * Enable option: **"Expose daemon on tcp://localhost:2375 without TLS"**.
   * Click **Apply & Restart**.
   * *Note for Linux systems:* Ensure the Docker daemon socket is accessible or configure systemd to listen on `tcp://127.0.0.1:2375`.

3. Verify Docker operation:
```bash
docker info
```

---

### 3.2 Source Code Setup

1. Open your terminal or PowerShell and navigate to your target project directory:
```bash
cd /path/to/your/workspace
```

2. Clone or locate the source repository directory (`CodeTier-interview-application`):
```bash
cd CodeTier-interview-application
```

3. **Install Backend Dependencies:**
```bash
cd Backend
npm install
cd ..
```

4. **Install Frontend Dependencies:**
```bash
cd Frontend
npm install
cd ..
```

---

### 3.3 Environment Variables Configuration

The application requires configuration files for both the Backend and Frontend services.

#### Backend Environment Setup (`Backend/.env`)
Create a file named `.env` in the `Backend/` directory with the following variables:

```env
# Database Connection URL (Local or Containerized MongoDB)
MONGODB_URI=mongodb://admin:qwerty@localhost:27017/interviewer?authSource=admin

# JWT Authentication Secrets and Expiration
JWT_TOKEN_SECRET=your_super_secret_jwt_access_key_here
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_here
JWT_TIMEOUT=1d
JWT_REFRESH_TIMEOUT=7d

# Cloudinary Storage Configuration (For Resume/Asset Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Network & Service Ports
PORT=8080
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment Setup (`Frontend/.env`)
Create a file named `.env` in the `Frontend/` directory with the following variables:

```env
# Backend API Base URL
VITE_BACKEND_URL=http://localhost:8080

# WebSocket Base Gateway Endpoint
VITE_WEBSOCKET_URL=ws://localhost:8080
```

---

### 3.4 Database Setup & Collection Seeding

The application uses MongoDB as its primary database system to persist users, interviews, jobs, environments, applications, and evaluations.

1. Ensure MongoDB is running (either locally as a service or inside a Docker container via `docker compose up -d`).
2. The initial database schema, collections, and indexes will automatically be instantiated upon initial connection by Mongoose.
3. Supported Collections:
   * `users`
   * `jobs`
   * `applications`
   * `interviews`
   * `environments`
   * `interviewenvironments`
   * `interviewevaluations`
   * `availabilities`
   * `slots`

4. **Importing Custom Environments Collection:**
   To populate the customized coding environments (such as React + Vite, C++ GCC, Python 3, C GCC, and Java JDK), execute the `mongoimport` command against the running MongoDB container. The seed data file `environments.json` is located directly at the project root directory (`CodeTier-interview-application/environments.json`) and not within any child directory:

```bash
docker compose exec -T mongo mongoimport \
  --uri="mongodb://admin:qwerty@localhost:27017/interviewer?authSource=admin" \
  --collection=environments \
  --jsonArray \
  --file=/dev/stdin < environments.json
```

---

### 3.5 Docker Setup & Container Services

The application provides a pre-configured Docker Compose file (`compose.yaml`) located at the root of the repository to instantly spin up **MongoDB**, **Mongo Express** (Database GUI), and **Redis**.

#### Step 1: Start Container Services via Docker Compose
From the root repository directory (`CodeTier-interview-application`), execute:

```bash
docker compose up -d
```

This will initialize:
* **MongoDB Container (`mongo`):** Bound to port `27017` with credentials `admin:qwerty`.
* **Mongo Express Container (`mongo-express`):** Web GUI bound to `http://localhost:8081` (Login: `admin` / Password: `qwerty`).
* **Redis Container (`redis`):** Bound to port `6379` for BullMQ queues.

#### Step 2: Verify Running Containers
```bash
docker ps
```
Ensure `mongo`, `mongo-express`, and `redis` containers display a status of `Up`.

#### Step 3: Import Environments Dataset to MongoDB
Seed the database using the `environments.json` file located directly in the project root directory (`CodeTier-interview-application/environments.json`):
```bash
docker compose exec -T mongo mongoimport \
  --uri="mongodb://admin:qwerty@localhost:27017/interviewer?authSource=admin" \
  --collection=environments \
  --jsonArray \
  --file=/dev/stdin < environments.json
```

#### Step 4: Pull Base Language Docker Images for Interview Sandboxes
The application provisions isolated environments per interview session (e.g. Node.js, React, Python). Execute the following commands to pull the standard container images into your local Docker daemon:

```bash
docker pull ketan980/react-temp:latest
docker pull python:3.10-alpine
docker pull gcc:latest
```

---

### 3.6 Cloudinary Media Service & PDF Asset Configuration

The application integrates **Cloudinary** as a cloud-based media storage service for securely uploading, hosting, and serving candidate PDF resume files.

#### Step 1: Create Cloudinary Account & Access Credentials
1. Register for an account at [https://cloudinary.com](https://cloudinary.com).
2. Log in to the Cloudinary Management Console.
3. Open **Product Environment Settings** -> **API Keys / Access Keys** or click the **Settings Gear** icon.
4. Copy your account API credentials:
   * **Cloud Name:** Account identifier string (e.g., `your_cloud_name_example`).
   * **API Key:** 15-digit API key string (e.g., `123456789012345`).
   * **API Secret:** Authorization secret string (e.g., `your_cloudinary_api_secret_example`).

#### Step 2: Configure Environment Credentials (`Backend/.env`)
Populate your `Backend/.env` file with these credentials using example placeholders:

```env
# Cloudinary Media Configuration (For Candidate Resume Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name_example
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_example
```

*(Note: Keep the operational MongoDB URI string `mongodb://admin:qwerty@localhost:27017/interviewer?authSource=admin` for local database connections while using example placeholders for third-party keys).*

#### Step 3: PDF Resume Upload & URL Access Pipeline
1. **Multer Ingestion:** When a candidate applies for a position and submits a PDF resume, Multer processes the file payload.
2. **Cloudinary Raw Resource Dispatch:** The backend utility `uploadResumeToCloudinary.js` uploads the PDF using `resource_type: "raw"` under folder `interview-platform/resumes`:
   ```javascript
   const response = await cloudinary.uploader.upload(filePath, {
     resource_type: "raw",
     folder: "interview-platform/resumes",
   });
   ```
3. **Automatic Server File Cleanup:** Once uploaded, the transient local file is removed from disk (`fs.unlink(filePath)`).
4. **Cloudinary URL Storage & Viewing:** Cloudinary returns a secure HTTPS URL (`response.secure_url`), which is stored in the candidate's `Application` schema (`resumeUrl`) in MongoDB. Organizations and interviewers can access, preview, and download PDF resumes directly via this URL from the candidate review modal.

---

### 3.7 Running the Application

To run the complete CodeTier application platform, three processes must be started concurrently:
1. **Backend Express & WebSocket Server**
2. **Asynchronous BullMQ Interview Worker**
3. **Frontend Vite Server**

#### Terminal Process 1: Start Backend API & WebSocket Server
```bash
cd Backend
npm run dev
```
*Output verification:*
```text
MONGODB CONNECTED ✅
Listening on http://localhost:8080
WEBSOCKET on ws://localhost:8080
```

#### Terminal Process 2: Start Background Interview Worker
```bash
cd Backend
npm run worker
```
*Output verification:*
```text
MongoDB connected for worker
Worker Started...
```

#### Terminal Process 3: Start Frontend Vite Server
```bash
cd Frontend
npm run dev
```
*Output verification:*
```text
  VITE v8.x.x  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Access the application by navigating to `http://localhost:5173` in your web browser.

---

## 4. Application Usage & Operational Workflow

### 4.1 Registration & User Authentication

1. **User Registration (`/register`):**
   * Navigate to the Signup page.
   * Select target account role:
     * **`ORGANIZATION`:** Create job postings, review candidate applications, shortlist applicants, and manage recruitment pipelines.
     * **`INTERVIEWER`:** Publish availability slots, conduct technical coding sessions, review candidate code, and submit evaluations.
     * **`CANDIDATE`:** Apply for job openings, select interview slots, and complete live coding assessments.
   * Enter required credentials (Full Name, Username, Email, Password, Skills, Experience, Timezone).
   * Click **Register**.

2. **User Authentication (`/login`):**
   * Log in with registered Email and Password.
   * Upon verification, the server issues a JWT Access Token (stored in Zustand application state) and sets an HTTP-only JWT Refresh Token cookie.
   * The user is automatically redirected to their role-specific dashboard (`/organization/dashboard`, `/interviewer/dashboard`, or `/dashboard`).

---

### 4.2 Job Posting & Interviewer Availability Setup

1. **Organization Job Posting:**
   * Log in with an **`ORGANIZATION`** account.
   * Navigate to **Job Dashboard** -> **Create Job Post**.
   * Enter Job Title, Description, Required Skills (e.g., React, JavaScript), Experience Level, Application Deadline, and Compensation.
   * Configure Interview Settings: Select **React** execution environment, Interview Duration (e.g. 60 min), and Buffer Time (e.g. 15 min).
   * Click **Publish Job**.

2. **Interviewer Availability Slot Setup:**
   * Log in with an **`INTERVIEWER`** account.
   * Navigate to **Availability / Slot Manager**.
   * Create availability time slots matching the domain skills (e.g. React/Full-Stack) required for the posted job.

---

### 4.3 Candidate Application & Organization Shortlisting

1. **Candidate Job Application:**
   * Log in with a **`CANDIDATE`** account.
   * Browse available positions under **Jobs** section.
   * Select the target job posting and click **Apply Now**.

2. **Organization Review & Shortlisting:**
   * Log in with the **`ORGANIZATION`** account.
   * Open the **Applications Dashboard**.
   * Review submitted candidate profiles and update application status from `APPLIED` to **`SHORTLISTED`**.

---

### 4.4 Candidate Slot Selection & Automated Interview Scheduling

1. **Selecting Overlapping Slot:**
   * Log in as the **`CANDIDATE`** and navigate to the **Applications** tab in the sidebar.
   * For the **`SHORTLISTED`** application, an interactive slot selection UI is rendered.
   * The candidate views available interviewer time slots and selects a slot overlapping with their availability.

2. **Automated Interview Creation:**
   * Selecting the slot schedules the session and creates a corresponding `Interview` record in MongoDB with status `SCHEDULED`.

---

### 4.5 Instant Docker Environment Provisioning & Testing

To instantly initialize and test the sandbox container for an interview session:

1. **Retrieving `interviewId` via Mongo Express:**
   * Open the **Mongo Express GUI** in browser: `http://localhost:8081` (Credentials: `admin` / `qwerty`).
   * Select database **`interviewer`** -> collection **`interviews`**.
   * Copy the target interview `_id` string (e.g., `6a93dd8f3e8a7929eefacce6`).

2. **Triggering Sandbox Provisioning API Endpoint:**
   * Execute an HTTP GET request to the Express provisioning endpoint:
     ```http
     GET http://localhost:8080/spin-off-docker/<interviewId>
     ```
   * *API Code Implementation in `Backend/index.js`:*
     ```javascript
     app.get("/spin-off-docker/:id", async (req, res) => {
       const { id } = req.params;
       await interviewQueue.add("prepare-interview", { interviewId: id }, { delay: 0 });
       return res.send("Provisioning job added to queue");
     });
     ```

3. **Background Worker Execution:**
   * The backend adds the `prepare-interview` job to `interviewQueue` in Redis.
   * The **BullMQ Worker** process (`npm run worker`) picks up the job, clones the workspace template (`https://github.com/ketanndewalkar/react-temp.git`), mounts `/workspace` binds, allocates host port forwarding for `5173`, and spawns the isolated `ketan980/react-temp:latest` Docker container using **Dockerode**.
   * The database record `interviewenvironment` updates status from `PROVISIONING` to **`RUNNING`**.

---

### 4.6 Joining & Conducting the Interview Session

1. **Accessing Interview Session:**
   * Both **Candidate** and **Interviewer** log in and navigate to **Interviews** tab in their respective sidebars.
   * When the interview environment status displays **`RUNNING`**, click **Join Session**.

2. **Pre-Call Media Lobby:**
   * Grant browser camera and microphone permissions.
   * Check video preview feed and audio level indicator.
   * Click **Enter Interview Room**.

3. **Real-Time Workspace Workspace Panes:**
   * **File Explorer Pane:** Browse and create files in the cloned sandbox repository.
   * **Monaco Collaborative Code Editor Pane:** Multi-file code editor with instantaneous bi-directional WebSocket code synchronization (`WORKSPACE` namespace).
   * **Integrated Terminal Output Pane:** Real-time container standard output (`stdout`) and error execution logs.
   * **Containerized Live App Preview Window:** Embedded iframe rendering the running React frontend application at `http://localhost:<dynamic_host_port>`.
   * **Real-Time WebRTC Media Stream:** Low-latency peer-to-peer video and audio communication between candidate and interviewer.

---

### 4.7 Session Conclusion, Evaluation Modal & Environment Teardown

1. **Ending the Session:**
   * Once coding and technical discussion conclude, the Interviewer clicks **End & Evaluate Interview**.

2. **Submitting Evaluation Scorecard (`EvaluationModal.jsx`):**
   * An evaluation form pop-up modal automatically renders on the Interviewer's screen.
   * The Interviewer completes the multi-parameter rubric:
     * **Overall Rating & Recommendation:** 1 to 5 Stars; Choice of `STRONG_HIRE`, `HIRE`, `HOLD`, `NO_HIRE`, `STRONG_NO_HIRE`.
     * **Technical Skills (1-5):** Problem Solving, Coding Skills, DS & Algorithms, Technical Fundamentals, System Design, Debugging.
     * **Behavioral Competencies (1-5):** Communication, Clarity of Thought, Confidence, Collaboration, Adaptability, Professionalism.
     * **Qualitative Notes:** Strengths, Areas for Improvement, Key Observations.
     * **Final Decision:** `SELECTED`, `REJECTED`, or `FURTHER_ROUND` with formal reasoning.
   * Click **Submit Evaluation**.

3. **Database Update & Container Teardown:**
   * Submitting the scorecard persists the `InterviewEvaluation` record to MongoDB.
   * The interview status is updated to **`ENDED`**.
   * Automatic environment cleanup stops the Docker container (`container.stop()`), removes container instances (`container.remove()`), and cleans up transient workspace directory volumes.

---

### 4.8 Viewing Results & Hiring Reports

1. **Interviewer & Organization Dashboards:**
   * Access **Completed Interviews** tab.
   * View candidate performance summary cards, category radar/breakdown charts, and evaluation history.
   * Download or review official candidate evaluation feedback reports.

2. **Candidate Dashboard:**
   * Access **Application Status** under candidate portal.
   * View application decisions (`SELECTED`, `REJECTED`, or `FURTHER_ROUND`) along with released feedback summary.

---

## 5. Troubleshooting

### Common Setup & Operational Issues

#### Issue 1: Docker Connection Error (`ECONNREFUSED 127.0.0.1:2375`)
* **Symptom:** Backend fails when provisioning an interview sandbox with log error: `connect ECONNREFUSED 127.0.0.1:2375`.
* **Cause:** The Docker daemon TCP port is not exposed or Docker Desktop is not running.
* **Resolution:**
  1. Open Docker Desktop.
  2. Navigate to **Settings** -> **General**.
  3. Ensure checkbox **"Expose daemon on tcp://localhost:2375 without TLS"** is enabled.
  4. Restart Docker Desktop.

#### Issue 2: Redis Connection Error (`ioredis: Connection refused`)
* **Symptom:** Worker or backend logs show `Error: connect ECONNREFUSED 127.0.0.1:6379`.
* **Cause:** Redis server container is stopped or port `6379` is blocked.
* **Resolution:**
  1. Run `docker compose up -d redis` to ensure Redis container is active.
  2. Verify port binding with `docker ps`.

#### Issue 3: MongoDB Authentication Failure
* **Symptom:** Backend crashes on startup with `MongoServerError: Authentication failed`.
* **Cause:** `.env` database connection credentials mismatch Docker Compose environment variables.
* **Resolution:**
  1. Confirm `Backend/.env` contains `MONGODB_URI=mongodb://admin:qwerty@localhost:27017/interviewer?authSource=admin`.
  2. Ensure `compose.yaml` has `MONGO_INITDB_ROOT_USERNAME: admin` and `MONGO_INITDB_ROOT_PASSWORD: qwerty`.

#### Issue 4: WebSocket Connection Failed (`ws://localhost:8080`)
* **Symptom:** Editor code updates or WebRTC call signaling fail to connect.
* **Cause:** Backend server is not running or firewall is blocking WebSocket upgrade requests.
* **Resolution:**
  1. Verify Backend is running on port `8080`.
  2. Ensure `Frontend/.env` has `VITE_WEBSOCKET_URL=ws://localhost:8080`.

#### Issue 5: WebRTC Media Stream (Camera/Microphone) Blocked
* **Symptom:** Video boxes remain black or display permission denied alerts.
* **Cause:** Browser media permissions denied or insecure HTTP context (WebRTC requires `localhost` or HTTPS).
* **Resolution:**
  1. Ensure you are accessing the application via `http://localhost:5173` (not raw IP without HTTPS).
  2. Click the lock/camera icon in browser address bar and grant camera/microphone permissions.

---

## 6. Conclusion

### 6.1 Maintenance & System Management
The **CodeTier Technical Interview Platform** offers a highly resilient, scalable environment for remote technical assessments. To maintain optimal system performance:
* Periodically clean up stale Docker containers and unused volumes (`docker system prune`).
* Monitor Redis queue health and BullMQ retry logs.
* Ensure database backup procedures are maintained for MongoDB collections.

### 6.2 Copyright & Intellectual Property Summary
This document serves as the complete technical manual and system specification for the **CodeTier Technical Interview Platform**. All architectural designs, data models, source code implementations, algorithms, and interface structures documented herein represent proprietary technology developed for automated and collaborative technical interview management.

---
*End of User Manual & System Installation Guide.*
