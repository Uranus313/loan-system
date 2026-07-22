# Loan System Backend

FastAPI backend for the Loan Management System. It provides JWT-authenticated REST APIs for user accounts, loans, installments, banks, notifications, and administrator operations.

For the complete product overview and frontend setup, see the [root README](../README.md).

## Backend Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT
- Passlib / bcrypt
- APScheduler

## Structure

```text
Backend/
├── main.py                  # FastAPI app and routes
├── crud.py                  # Database access and domain logic
├── models.py                # SQLAlchemy database models
├── schemas.py               # Pydantic schemas and validation
├── database.py              # Engine and session configuration
├── tokens.py                # JWT authentication
├── hashing.py               # Password hashing
├── email_sender.py          # Email notifications
├── Triggers_In_Database.txt # PostgreSQL triggers
└── config.env               # Local secrets; do not commit
```

## Local Setup

### 1. Create a database

```sql
CREATE DATABASE loan_system;
```

Update the connection string in `database.py` to match your PostgreSQL configuration.

### 2. Create the environment file

Create `config.env`:

```env
SECRET_KEY=replace_with_a_secure_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
Email_Password=replace_with_email_app_password
```

### 3. Create a virtual environment

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the API

```bash
uvicorn main:app --reload
```

- API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### 6. Apply database triggers

Execute the SQL in `Triggers_In_Database.txt` after the database tables are available.

## Main Domain Entities

- `User`
- `Loan`
- `Debt`
- `Bank`
- `CustomBank`
- `Notification`

Loan creation automatically generates the corresponding installment records.

## Main Route Groups

```text
/user/login
/user/
/user/loans
/user/debts
/user/banks
/user/notifications
/admin/users
/admin/admins
/admin/userLoans
/admin/notifications
/admin/userLoanDebts
/admin/bank
```

Open `/docs` for exact methods, parameters, schemas, and response models.

## Authentication Flow

Protected endpoints use an OAuth2 bearer token:

```http
Authorization: Bearer <access-token>
```

The token is created after a successful login and validated before protected operations.
