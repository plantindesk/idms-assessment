# IDMS Assessment - Employee Management System

A full-stack Employee Management System (IDMS) built with a React frontend and Express.js backend. This application provides secure admin authentication and comprehensive employee management capabilities with a modern, responsive UI.

## Description

This is a complete full-stack application for managing employee records. It includes:

- **Secure Admin Authentication**: JWT-based login with HTTP-only cookies
- **Employee CRUD Operations**: Create, read, update, and delete employee records
- **Profile Image Upload**: Support for employee profile pictures
- **Dashboard Analytics**: Employee statistics by department, designation, and status
- **Advanced Filtering & Search**: Filter by department, designation, gender, and status
- **Pagination**: Server-side pagination for efficient data handling

## Architecture

```
idms-assessment/
├── backend/                 # Express.js REST API
│   ├── src/
│   │   ├── app.ts          # Application entry point
│   │   ├── config/         # Database & environment config
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/    # Auth, error handling, file upload
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # Helper utilities
│   │   └── validators/     # Input validation
│   └── README.md           # Backend-specific documentation
│
└── frontend/               # React SPA
    ├── src/
    │   ├── api/            # API service layer
    │   ├── components/     # UI components
    │   ├── context/        # React Context (Auth)
    │   ├── hooks/          # Custom React hooks
    │   ├── pages/          # Page components
    │   ├── types/          # TypeScript types
    │   └── utils/          # Utilities
    └── README.md           # Frontend-specific documentation
```

## Tech Stack

### Backend
| Category | Technology |
|----------|------------|
| Runtime | Bun |
| Language | TypeScript 5.x |
| Framework | Express.js 5.x |
| Database | MongoDB with Mongoose 9.x |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| File Handling | Multer |
| Security | Helmet, CORS |

### Frontend
| Category | Technology |
|----------|------------|
| Framework | React 19.2.0 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 8.x |
| Styling | Tailwind CSS 4.x |
| UI Components | shadcn/ui |
| Routing | React Router 7.x |
| HTTP Client | Axios |
| Package Manager | Bun |

## Prerequisites

Ensure you have the following installed:

- **Bun** >= 1.0.0 - [Installation Guide](https://bun.sh/docs/installation)
- **MongoDB** >= 6.0 - [Installation Guide](https://www.mongodb.com/docs/manual/installation/)
- **Node.js** >= 18.x (optional, if using npm instead of Bun)

## Quick Start

### 1. Clone and Setup

```bash
cd idms-assessment
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
bun install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration (see backend/README.md for details)
# Key variables:
#   - MONGO_URI=mongodb://localhost:27017/employee_management
#   - JWT_SECRET=your_secret_key

# Start development server
bun run dev
```

The backend API will be available at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
bun install

# Create .env file (if needed)
echo "VITE_API_BASE_URL=http://localhost:5000/api/v1" > .env
echo "VITE_UPLOADS_BASE_URL=http://localhost:5000" >> .env

# Start development server
bun run dev
```

The frontend will be available at `http://localhost:5173`

## Detailed Documentation

For more detailed information, refer to the individual README files:

- **[Backend README](./backend/README.md)** - API endpoints, database models, environment configuration, security features
- **[Frontend README](./frontend/README.md)** - UI components, routing, API integration, project structure

## Default Credentials

After setting up the backend, you may need to create an initial admin user. Refer to `backend/src/models/admin.model.ts` for the schema and `backend/src/services/admin.service.ts` for user creation logic.

## API Base URL

```
http://localhost:5000/api/v1
```

## Health Check

Verify the backend is running:

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

## License

This project is part of an assessment and is not licensed for public distribution.
