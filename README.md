# Loan Management System

A full-stack web application for managing personal loans, installments, payments, banks, users, and notifications. The system provides separate user and administrator workflows through a React interface backed by a FastAPI REST API and PostgreSQL database.

## Features

### User features
- Register and sign in using a username or email
- View and update profile information
- Add and manage loans
- Track installment schedules and payment progress
- Record installment payments
- Manage predefined and custom banks
- Receive and review notifications

### Administrator features
- View and manage users
- Promote or remove administrators
- Review loans across the system
- Add supported banks
- Create and manage user notifications
- Inspect loan installments and payment status

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- TanStack Query
- Axios
- React Bootstrap
- React Toastify

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- PostgreSQL
- JWT authentication
- Passlib / bcrypt
- APScheduler

## Project Structure

```text
loan-system/
├── Backend/
│   ├── main.py                  # FastAPI application and API routes
│   ├── crud.py                  # Database operations and business logic
│   ├── models.py                # SQLAlchemy models
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── database.py              # PostgreSQL connection and sessions
│   ├── tokens.py                # JWT creation and authentication
│   ├── hashing.py               # Password hashing and verification
│   ├── email_sender.py          # Email notification support
│   ├── Triggers_In_Database.txt # PostgreSQL trigger definitions
│   └── README.md                # Backend-specific documentation
├── src/
│   ├── components/              # React pages and reusable UI components
│   ├── connections/             # API client
│   ├── contexts/                # React contexts
│   ├── functions/               # Utility functions
│   ├── hooks/                   # Data-fetching hooks
│   └── routes/                  # Application routing
├── public/
├── package.json
└── vite.config.js
```

## Data Model

The application is built around the following entities:

- **User** — account, identity, profile, and administrator status
- **Loan** — amount, interest rate, duration, bank, and payment progress
- **Debt** — an individual installment associated with a loan
- **Bank** — a system-wide supported bank
- **Custom Bank** — a user-defined bank
- **Notification** — user and administrator messages, optionally linked to an installment

When a loan is created, its installment schedule is generated automatically from the loan amount, interest rate, start date, and number of installments.

## Getting Started

### Prerequisites

Install the following tools before running the project:

- Node.js 18 or later
- npm
- Python 3.10 or later
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/Uranus313/loan-system.git
cd loan-system
```

### 2. Configure PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE loan_system;
```

The current project reads the database connection from `Backend/database.py`. Update `SQLALCHEMY_DATABASE_URL` for your local PostgreSQL credentials.

For a safer production-ready setup, move the database URL to an environment variable instead of committing credentials to source control.

### 3. Configure backend environment variables

Create `Backend/config.env` based on the following template:

```env
SECRET_KEY=replace_with_a_secure_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
Email_Password=replace_with_email_app_password
```

Do not commit real secrets or credentials.

### 4. Install backend dependencies

From the `Backend` directory, create and activate a virtual environment:

```bash
cd Backend
python -m venv .venv
```

On Windows:

```bash
.venv\Scripts\activate
```

On macOS or Linux:

```bash
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r Backend/requirements.txt
```

### 5. Apply database triggers

After the tables have been created, execute the SQL statements in:

```text
Backend/Triggers_In_Database.txt
```

These triggers preserve related data integrity when users or loans are deleted.

### 6. Run the backend

From the `Backend` directory:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 7. Install and run the frontend

Open a second terminal from the repository root:

```bash
npm install
npm run dev
```

The Vite development server will display the frontend URL in the terminal, typically:

```text
http://localhost:5173
```

The frontend API client currently expects the backend at `http://127.0.0.1:8000/`.

## API Overview

The backend exposes authenticated user and administrator endpoints.

### Authentication and user account
- `POST /user/login`
- `POST /user/`
- `GET /user/`
- `PUT /user/`
- `DELETE /user/`

### Loans and installments
- `GET /user/loans`
- `POST /user/loans`
- `PUT /user/loans`
- `DELETE /user/loans/{loan_id}`
- `GET /user/debts/{debt_id}`
- `PUT /user/debts`

### Banks and notifications
- `GET /user/banks`
- `POST /user/banks`
- `DELETE /user/banks`
- `GET /user/notifications`
- `POST /user/notifications`
- `PUT /user/notifications`

### Administration
- User and administrator management
- System-wide loan inspection
- Bank management
- Notification management
- Installment inspection

For the complete request schemas and endpoint details, run the backend and open `/docs`.

## Authentication

The API uses bearer-token authentication:

1. A user signs in through `POST /user/login`.
2. The server issues a JWT access token.
3. The frontend stores the token and sends it in subsequent requests:

```http
Authorization: Bearer <access-token>
```

Passwords are hashed with bcrypt before being stored.

## Available Scripts

### Frontend

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

### Backend

```bash
uvicorn main:app --reload
```

## Security Notes

Before deploying the application:

- Remove committed secrets and rotate any credentials that have already been exposed.
- Load the database URL and all secrets from environment variables.
- Restrict CORS to trusted frontend origins.
- Disable debug/reload mode.
- Use HTTPS.
- Add database migrations, automated tests, and production logging.
- Review authorization rules for every administrator endpoint.

A `requirements.txt` file is included under `Backend/` to simplify backend setup.

## Current Status

This repository is an academic team project. It contains the main user, loan, installment, bank, notification, and administrator workflows. Additional testing, migrations, deployment configuration, and security hardening are recommended before production use.

## License

No license has been specified for this repository. All rights remain with the project authors unless a license is added.
