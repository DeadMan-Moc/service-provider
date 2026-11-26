# ServiceHub

Verified Service Request and Client Management Platform.

## Stack

- Frontend: React, Vite, Material UI
- Backend: Java 21, Spring Boot 3, Spring Security, stateless JWT authentication
- Database: PostgreSQL with Flyway migrations
- Planned integrations: email verification, identity document/selfie review, PayFast or Yoco, Render, Vercel, and Supabase PostgreSQL

## Local development

Requirements: Java 21, Maven 3.6.3+, Node.js 20.19+ or 22.12+, npm, and Docker Desktop.

1. Start PostgreSQL from the project root:

   ```powershell
   docker compose up -d postgres
   ```

2. Set a private 32-byte-or-longer JWT signing secret in the current PowerShell session. Generate one with OpenSSL, then set `JWT_SECRET_BASE64`:

   ```powershell
   $env:JWT_SECRET_BASE64 = (openssl rand -base64 32).Trim()
   ```

3. Start the API in one terminal:

   ```powershell
   mvn spring-boot:run
   ```

4. Start the web app in another terminal:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Open `http://localhost:5173`. Vite proxies `/api` to the Spring Boot server on port 8080.

## API foundation

- `POST /api/v1/auth/register` — create a client account in `PENDING_EMAIL_VERIFICATION`
- `POST /api/v1/auth/login` — authenticate and issue a short-lived bearer token
- `GET /api/v1/services` — service catalogue
- `GET /api/v1/health` and `/actuator/health` — health checks

All new accounts receive only the `CLIENT` role. Passwords are BCrypt-hashed. JWT signing secrets are supplied through environment configuration, and database changes are managed through Flyway.

## Current scope

This repository now contains the React app and a secure backend foundation. Email verification delivery, ID/selfie upload and review, account approval, service request management, quotes, invoice workflows, and PayFast/Yoco payment reconciliation still need implementation. The client currently shows the account verification steps and does not allow anyone to mark themselves verified. The earlier standalone browser prototype and planning documents remain at the repository root for reference.

Do not use real identity documents or payment details until the corresponding private storage, provider integrations, access controls, retention policy, and audit workflows are implemented.
