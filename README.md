# 01Blog - Social Blogging Platform

## About
Brief project description, purpose, and target users.

## Features
- User authentication (registration, login, roles)
- User blocks (profile pages, subscriptions, notifications)
- Posts (CRUD, media upload, likes, comments)
- Reporting system for inappropriate content
- Admin panel for moderation and management

## Tech Stack
| Component | Technologies |
|-----------|--------------|
| Backend | Java Spring Boot, Spring Security, PostgreSQL |
| Frontend | Angular 20+, Angular Material |
| Others | Docker, JWT, Cloudinary |

## Prerequisites
-  Docker, Docker Compose

## Installation

```sh
git clone https://github.com/kill-ux/01-blog.git
cd 01-blog
```
rename .env.example to .env and put your data

## Build and run

```sh
docker-compose up --build
```

if you don't have docker you can tab (Ctr+shift+P) check "Tasks: Run task" and "run all"

#### Prerequisites
-  Java, Node js (npm), ng

# Other Method Manual

## Quick Start
1. Backend: `cd backend && ./gradlew bootRun`
2. Frontend: `cd frontend && npm i && npm i -g @angular/cli && ng serve`
3. Open in browser: `http://localhost:4200`

## Usage
- Register and log in
- Create/view posts and user blocks
- Subscribe to other users
- Admin operations for moderation

## Project Structure

```
01-blog/
├── backend/
├── frontend/
├── docker-compose.yaml
```


## Contribution
Fork, branch, commit, push, and open pull request.

# Database

<img src="assets/mcd.png" width="500"/>

# Auth

![alt text](<assets/Screenshot from 2025-11-28 16-52-02.png>)

# Home

![alt text](<assets/Screenshot from 2025-11-28 16-49-21.png>)

# Profile

![alt text](<assets/Screenshot from 2025-11-28 16-51-10.png>)

