# IDMS Backend API

A robust Employee Management System backend built with Express.js, TypeScript, and MongoDB. This API provides secure admin authentication and comprehensive employee management capabilities.

## Description

This backend service powers an Employee Management System with the following capabilities:

- **Admin Authentication**: Secure JWT-based authentication with HTTP-only cookies for CSRF protection
- **Employee Management**: Full CRUD operations for employee records with auto-generated unique IDs
- **File Upload Support**: Profile image upload functionality via Multer
- **Role-based Data**: Predefined departments, designations, employment statuses, and educational courses
- **Security Hardened**: Helmet for security headers, CORS configuration, password hashing with bcrypt

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | [Bun](https://bun.sh/) |
| Language | TypeScript 5.x |
| Framework | Express.js 5.x |
| Database | MongoDB with Mongoose 9.x |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| File Handling | Multer |
| Security | Helmet, CORS |
| Logging | Morgan (development) |

## Prerequisites

Ensure the following are installed on your machine:

- **Bun** >= 1.0.0 - [Installation Guide](https://bun.sh/docs/installation)
- **MongoDB** >= 6.0 - [Installation Guide](https://www.mongodb.com/docs/manual/installation/)
- **Node.js** >= 18.x (optional, if using npm instead of Bun)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd idms-assessment/backend
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   Copy the example environment file and configure your values:

   ```bash
   cp .env.example .env
   ```

## Configuration

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=1d
COOKIE_MAX_AGE_MS=86400000
CLIENT_ORIGIN=http://localhost:5173
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `PORT` | Server port number | `5000` |
| `MONGO_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | `1d` |
| `COOKIE_MAX_AGE_MS` | Cookie max age in milliseconds | `86400000` (24h) |
| `CLIENT_ORIGIN` | Frontend origin for CORS | `http://localhost:5173` |

## Usage

### Development Mode

Start the server with hot-reload enabled:

```bash
bun run dev
```

### Production Mode

Start the server in production:

```bash
bun run start
```

### Verify Server

Check if the server is running:

```bash
curl http://localhost:5000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-21T00:00:00.000Z"
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/auth/login` | Admin login | Public |
| `POST` | `/api/v1/auth/logout` | Admin logout | Protected |
| `GET` | `/api/v1/auth/me` | Get current admin profile | Protected |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Server health status |

### Employee Management

> **Note**: Employee routes are available in the codebase. Uncomment in `src/routes/index.ts` to enable.

## Project Structure

```
backend/
├── src/
│   ├── app.ts                    # Application entry point
│   ├── config/
│   │   ├── db.ts                 # MongoDB connection
│   │   └── env.ts                # Environment configuration
│   ├── constants/
│   │   └── index.ts              # App constants (departments, statuses, etc.)
│   ├── controllers/
│   │   ├── admin.controller.ts   # Admin auth handlers
│   │   └── employee.controller.ts # Employee CRUD handlers
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT authentication
│   │   ├── error.middleware.ts   # Global error handler
│   │   ├── multer.middleware.ts  # File upload handling
│   │   └── multerError.middleware.ts # Multer error handling
│   ├── models/
│   │   ├── admin.model.ts        # Admin schema & model
│   │   └── employee.model.ts     # Employee schema & model
│   ├── routes/
│   │   ├── index.ts              # Route aggregator
│   │   └── admin.routes.ts       # Admin routes
│   ├── services/
│   │   ├── admin.service.ts      # Admin business logic
│   │   └── employee.service.ts   # Employee business logic
│   ├── types/
│   │   ├── admin.types.ts        # Admin TypeScript interfaces
│   │   ├── employee.types.ts     # Employee TypeScript interfaces
│   │   └── express.d.ts          # Express type extensions
│   ├── utils/
│   │   ├── ApiError.ts           # Custom error class
│   │   ├── ApiResponse.ts        # Standard API response
│   │   ├── asyncHandler.ts       # Async error wrapper
│   │   └── logger.ts             # Logging utility
│   └── validators/
│       ├── admin.validator.ts    # Admin input validation
│       └── employee.validator.ts # Employee input validation
├── .env.example                  # Environment template
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
└── bun.lock                      # Bun lockfile
```

## Data Models

### Admin

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userName` | String | Yes | Unique, 3-30 chars |
| `email` | String | Yes | Unique, validated |
| `password` | String | Yes | Min 6 chars, hashed |

### Employee

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `uniqueId` | String | Auto | Format: `EMP-00001` |
| `name` | String | Yes | 2-50 chars |
| `email` | String | Yes | Unique, validated |
| `phone` | String | Yes | Exactly 10 digits |
| `gender` | Enum | Yes | Male, Female, Other |
| `department` | Enum | Yes | HR, Engineering, Marketing, etc. |
| `designation` | Enum | Yes | Intern to CEO |
| `status` | Enum | Yes | Active, Inactive, Terminated, etc. |
| `courses` | Array | Yes | Education courses (MCA, BCA, etc.) |
| `dateOfJoining` | Date | Yes | Cannot be future date |
| `salary` | Number | Yes | Non-negative |
| `profileImage` | String | No | File path/URL |

## Security Features

- **HTTP-only Cookies**: JWT tokens stored in secure HTTP-only cookies
- **CSRF Protection**: SameSite cookie attribute configured
- **Password Hashing**: bcrypt with 12 salt rounds
- **Security Headers**: Helmet middleware for HTTP headers
- **CORS**: Configured origin whitelist with credentials support
- **Input Validation**: Request body validation on all endpoints

## License

This project is part of an assessment and is not licensed for production use.
